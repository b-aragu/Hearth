import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { CreatureType } from '../constants/creatures';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { syncWidgetData } from '../widgets/WidgetSync';

import { useCreatureData, CoupleData } from '../hooks/useCreatureData';
import { useCreatureMood } from '../hooks/useCreatureMood';
import { useCreatureStats } from '../hooks/useCreatureStats';
import { useRealtimeEvents } from '../hooks/useRealtimeEvents';
import { GAME_CONFIG } from '../constants/game-config';

interface CreatureContextType {
    selectedCreature: CreatureType;
    couple: CoupleData | null;
    loading: boolean;
    refreshCouple: () => Promise<void>;
    setCreature: (id: CreatureType) => void;
    // Stats
    daysTogether: number;
    streak: number;
    partnerName: string;
    partnerCheckedIn: boolean;
    isPartnerOnline: boolean;
    partnerLastSeen: string | null;
    userName: string;
    updateAccessories: (items: string[]) => Promise<void>;
    saveAccessories: (items: string[], colors: Record<string, string>) => Promise<void>;
    recordTap: () => Promise<void>;
    updateRoom: (roomId: string) => Promise<void>;
    creatureMood: string;
    setTemporaryMood: (mood: string, durationMs?: number) => void;
}

const CreatureContext = createContext<CreatureContextType | undefined>(undefined);

export function CreatureProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    // 1. Data Persistence
    const { couple, loading, refreshCouple, updateLocalCouple } = useCreatureData(user?.id);

    // 2. Mood Logic
    const { creatureMood, setTemporaryMood } = useCreatureMood(couple);

    // 3. Stats & Presence
    const {
        daysTogether,
        streak,
        partnerName,
        partnerCheckedIn,
        isPartnerOnline,
        partnerLastSeen,
        userName,
        hasAnsweredToday,
        partnerHasAnsweredToday,
        selectedCreature,
        setSelectedCreature
    } = useCreatureStats(user, couple);

    // 4. Realtime Events (Messages/Surprises)
    useRealtimeEvents({ user, couple, setTemporaryMood });

    // 5. Actions (Accessories, Taps, Room)
    const updateAccessories = async (items: string[]) => {
        if (!couple) return;
        updateLocalCouple({ accessories: items });
        const { error } = await supabase.from('couples').update({ accessories: items }).eq('id', couple.id);
        if (error) console.error('Failed to update accessories:', error);
    };

    const saveAccessories = async (items: string[], colors: Record<string, string>) => {
        if (!couple || !user) return;
        updateLocalCouple({ accessories: items, accessory_colors: colors }); // Optimistic update

        try {
            const { error } = await supabase
                .from('couples')
                .update({ accessories: items, accessory_colors: colors })
                .eq('id', couple.id);

            if (error) throw error;

            const memoryTitle = `${userName || 'Someone'} updated the look! 🎨`;
            await supabase.from('memories').insert({
                couple_id: couple.id,
                type: 'Growth',
                title: memoryTitle,
                description: `New accessories added to your creature. Check out the fresh style!`,
                image_emoji: '🎩',
                color_theme: 'lavender',
                created_at: new Date().toISOString()
            });
        } catch (err) {
            console.error('Failed to save accessories in Context:', err);
            refreshCouple(); // Revert on failure
            throw err;
        }
    };

    const recordTap = async () => {
        if (!couple || !user) return;

        setTemporaryMood('happy', 10000); // Instant feedback

        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString();

        let currentCounts = couple.daily_tap_count || { partner1: 0, partner2: 0, date: today };
        if (currentCounts.date !== today) {
            currentCounts = { partner1: 0, partner2: 0, date: today };
        }

        const isPartner1 = couple.partner1_id === user.id;
        const newCounts = {
            ...currentCounts,
            [isPartner1 ? 'partner1' : 'partner2']: (currentCounts[isPartner1 ? 'partner1' : 'partner2'] || 0) + 1,
            date: today
        };

        const totalTaps = newCounts.partner1 + newCounts.partner2;

        updateLocalCouple({ daily_tap_count: newCounts, last_petted_at: now });

        try {
            const { error } = await supabase
                .from('couples')
                .update({ daily_tap_count: newCounts, last_petted_at: now })
                .eq('id', couple.id);

            if (error) throw error;

            if (GAME_CONFIG.TAPS.MILESTONES.includes(totalTaps)) {
                const msg = GAME_CONFIG.TAPS.MESSAGES[totalTaps];
                if (msg) {
                    await supabase.from('memories').insert({
                        couple_id: couple.id,
                        type: 'Growth',
                        title: msg.title,
                        description: msg.desc,
                        image_emoji: msg.emoji,
                        color_theme: 'coral',
                        created_at: new Date().toISOString()
                    });
                }
            }
        } catch (err) {
            console.error("Failed to record tap:", err);
            // We usually don't revert taps to avoid jarring UX, but could trigger a refresh if critical
        }
    };

    const updateRoom = async (roomId: string) => {
        if (!couple) return;
        updateLocalCouple({ room_theme: roomId });
        try {
            const { error } = await supabase.from('couples').update({ room_theme: roomId }).eq('id', couple.id);
            if (error) console.error('[CreatureContext] DB Update Failed:', error);
        } catch (err) {
            console.error('[CreatureContext] Exception in updateRoom:', err);
        }
    };

    // 6. Side Effects (Daily Check-in creation, Widget Sync, Reminders)
    useEffect(() => {
        const performCheckIn = async () => {
            if (!couple?.id || !user) return;
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const { data: existing } = await supabase.from('memories').select('id').eq('couple_id', couple.id).eq('type', 'Daily').gte('created_at', startOfToday.toISOString()).maybeSingle();
            if (existing) return;

            await supabase.from('memories').insert({
                couple_id: couple.id,
                type: 'Daily',
                title: 'Daily Check-in',
                description: 'Another day taking care of our creature together.',
                color_theme: 'mint',
                image_emoji: '📅'
            });
        };
        performCheckIn();
    }, [couple?.id]);

    useEffect(() => {
        if (couple) {
            const isStreakGlowing = hasAnsweredToday && partnerHasAnsweredToday;
            syncWidgetData({
                streak,
                creatureType: couple.creature_type,
                creatureName: couple.creature_name || undefined,
                partnerName,
                partnerStatus: isPartnerOnline ? 'Online' : 'Offline',
                lastSeen: partnerLastSeen ? formatDistanceToNow(new Date(partnerLastSeen), { addSuffix: true }) : undefined,
                mood: creatureMood || undefined,
                streakGlowing: isStreakGlowing
            });
        }
    }, [couple, streak, partnerName, isPartnerOnline, partnerLastSeen, creatureMood, hasAnsweredToday, partnerHasAnsweredToday]);

    useEffect(() => {
        const scheduleReminders = async () => {
            const { notificationService } = await import('../notifications');
            await notificationService.scheduleDailyQuestionReminder(9);
            await notificationService.scheduleStreakReminder(20);
        };
        scheduleReminders();
    }, []);

    return (
        <CreatureContext.Provider
            value={{
                selectedCreature,
                couple,
                loading,
                refreshCouple,
                setCreature: setSelectedCreature,
                daysTogether,
                streak,
                partnerName,
                partnerCheckedIn,
                isPartnerOnline,
                partnerLastSeen,
                userName,
                updateAccessories,
                saveAccessories,
                recordTap,
                updateRoom,
                creatureMood,
                setTemporaryMood
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
