import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CreatureType } from '../constants/creatures';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { differenceInDays, startOfDay } from 'date-fns';

interface CoupleData {
    id: string;
    partner1_id: string;
    partner2_id: string | null;
    creature_type: CreatureType;
    invite_code: string;
    p1_choice: CreatureType | null;
    p2_choice: CreatureType | null;
    p1_name_choice: string | null;
    p2_name_choice: string | null;
    creature_name: string | null;
    matched_at: string | null;
    accessories?: string[]; // New field
    accessory_colors?: Record<string, string>; // New field
}

interface ProfileData {
    id: string;
    display_name: string | null;
    last_active_at: string | null;
}

interface CreatureContextType {
    selectedCreature: CreatureType;
    couple: CoupleData | null;
    loading: boolean;
    refreshCouple: () => Promise<void>;
    setCreature: (id: CreatureType) => void;
    // New Stats
    daysTogether: number;
    streak: number;
    partnerName: string;
    partnerCheckedIn: boolean;
    isPartnerOnline: boolean;
    updateAccessories: (items: string[]) => Promise<void>; // Deprecated
    saveAccessories: (items: string[], colors: Record<string, string>) => Promise<void>; // New
}

const CreatureContext = createContext<CreatureContextType | undefined>(undefined);

export function CreatureProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [selectedCreature, setSelectedCreature] = useState<CreatureType>('bear');
    const [couple, setCouple] = useState<CoupleData | null>(null);
    const [loading, setLoading] = useState(true);

    // Stats
    const [daysTogether, setDaysTogether] = useState(0);
    const [streak, setStreak] = useState(0);
    const [partnerName, setPartnerName] = useState('Partner');
    const [partnerCheckedIn, setPartnerCheckedIn] = useState(false);
    const [isPartnerOnline, setIsPartnerOnline] = useState(false);

    // Update Presence Helper
    const updatePresence = async () => {
        if (!user) return;
        // Quietly fail if column doesn't exist yet
        const { error } = await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', user.id);
        if (error) console.log("Presence update failed (migration pending?)");
    };

    const updateAccessories = async (items: string[]) => {
        if (!couple) return;
        // Optimistic update
        setCouple(prev => prev ? { ...prev, accessories: items } : null);

        const { error } = await supabase
            .from('couples')
            .update({ accessories: items })
            .eq('id', couple.id);

        if (error) {
            console.error('Failed to update accessories:', error);
            // Revert on error would go here, omitting for brevity
        }
    };

    const saveAccessories = async (items: string[], colors: Record<string, string>) => {
        if (!couple || !user) return;

        // 1. Optimistic Update
        setCouple(prev => prev ? { ...prev, accessories: items, accessory_colors: colors } : null);

        try {
            // 2. Persist to DB
            const { error } = await supabase
                .from('couples')
                .update({
                    accessories: items,
                    accessory_colors: colors
                })
                .eq('id', couple.id);

            if (error) throw error;

            // 3. Create a Memory (Log the style change)
            // Only create memory if something actually changed (naive check: just do it for now)
            const memoryTitle = `${partnerName || 'Someone'} updated the look! 🎨`;
            const memoryDesc = `New accessories added to your creature. Check out the fresh style!`;

            await supabase.from('memories').insert({
                couple_id: couple.id,
                type: 'Growth', // or 'Milestone'
                title: memoryTitle,
                description: memoryDesc,
                image_emoji: '🎩',
                color_theme: 'lavender',
                created_at: new Date().toISOString()
            });

            // 4. Send Notification (Simulated)
            // In a real app, you'd call a backend function here
            console.log(`[NOTIFICATION] Sending to partner: "${memoryTitle}"`);

        } catch (err) {
            console.error('Failed to save accessories:', err);
            // Revert optimistic update ideally
        }
    };

    const fetchCouple = async () => {
        if (!user) return;

        try {
            // Fetch Relationship - Reverting to * to be safe if column missing
            const { data, error } = await supabase
                .from('couples')
                .select('*')
                .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
                .single();

            if (data) {
                setCouple(data);
                setSelectedCreature(data.creature_type as CreatureType);

                // 2. Calculate Days Together
                if (data.matched_at) {
                    const start = new Date(data.matched_at);
                    const now = new Date();
                    setDaysTogether(differenceInDays(now, start) + 1); // +1 because day 0 is day 1
                }

                // 3. Fetch Partner Name & Check-in Status
                const partnerId = data.partner1_id === user.id ? data.partner2_id : data.partner1_id;
                if (partnerId) {
                    const { data: pData } = await supabase.from('profiles').select('display_name, last_active_at').eq('id', partnerId).single();
                    if (pData) {
                        if (pData.display_name) setPartnerName(pData.display_name);

                        // Check if online (active in last 5 mins)
                        if (pData.last_active_at) {
                            const lastActive = new Date(pData.last_active_at);
                            const now = new Date();
                            const diffMins = (now.getTime() - lastActive.getTime()) / 60000;
                            setIsPartnerOnline(diffMins < 5); // 5 minute threshold for "Online"
                        }
                    }

                    // Check if partner checked in today

                    // Check if partner checked in today
                    const today = new Date().toISOString().split('T')[0];
                    const { data: checkin } = await supabase
                        .from('daily_checkins')
                        .select('id')
                        .eq('user_id', partnerId)
                        .eq('checkin_date', today)
                        .maybeSingle();

                    setPartnerCheckedIn(!!checkin);
                }

                // Auto-Checkin User
                const today = new Date().toISOString().split('T')[0];
                const { error: checkinError } = await supabase
                    .from('daily_checkins')
                    .upsert({
                        couple_id: data.id,
                        user_id: user.id,
                        checkin_date: today
                    }, { onConflict: 'user_id, checkin_date' }); // Use unique constraint to avoid duplicates

                if (checkinError) console.log("Checkin Error:", checkinError);

                // Update our own presence
                updatePresence();

                // 4. Calculate Streak (Count unique days with checkins)
                const { data: checkins } = await supabase
                    .from('daily_checkins')
                    .select('checkin_date, user_id')
                    .eq('couple_id', data.id)
                    .order('checkin_date', { ascending: false });

                if (checkins) {
                    const dates = new Set(checkins.map(c => c.checkin_date));
                    setStreak(dates.size);
                }
            }
        } catch (error) {
            console.log('Error fetching creature context:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouple();
    }, [user]);

    return (
        <CreatureContext.Provider
            value={{
                selectedCreature,
                couple,
                loading,
                refreshCouple: fetchCouple,
                setCreature: setSelectedCreature,
                daysTogether,
                streak,
                partnerName,
                partnerCheckedIn,
                partnerCheckedIn,
                isPartnerOnline,
                updateAccessories,
                saveAccessories
            }}
        >
            {children}
        </CreatureContext.Provider>
    );
}

export function useCreature() {
    const context = useContext(CreatureContext);
    if (!context) {
        throw new Error('useCreature must be used within a CreatureProvider');
    }
    return context;
}
