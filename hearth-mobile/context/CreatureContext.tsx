import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CreatureType } from '../constants/creatures';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { differenceInDays, startOfDay, formatDistanceToNow } from 'date-fns';
import { syncWidgetData } from '../widgets/WidgetSync';

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
    last_petted_at?: string; // New synced field
    daily_tap_count?: { partner1: number; partner2: number; date: string }; // New synced field
    room_theme?: string; // Room theme/style customization
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
    // Stats
    daysTogether: number;
    streak: number;
    partnerName: string;
    partnerCheckedIn: boolean;
    isPartnerOnline: boolean;
    partnerLastSeen: string | null; // New: for "last seen X ago"
    userName: string;
    updateAccessories: (items: string[]) => Promise<void>;
    saveAccessories: (items: string[], colors: Record<string, string>) => Promise<void>;
    recordTap: () => Promise<void>;
    updateRoom: (roomId: string) => Promise<void>;
    creatureMood: string; // New: for pet expression changes
    setTemporaryMood: (mood: string, durationMs?: number) => void; // New
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
    const [partnerLastSeen, setPartnerLastSeen] = useState<string | null>(null);
    const [userName, setUserName] = useState('Someone');
    const [creatureMood, setCreatureMood] = useState('happy'); // default mood

    // Update Presence Helper
    const updatePresence = async () => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', user.id);
        if (error) console.log("Presence update failed (migration pending?)");
    };

    // Temporary mood change helper
    const setTemporaryMood = (mood: string, durationMs: number = 5000) => {
        setCreatureMood(mood);
        setTimeout(() => setCreatureMood('happy'), durationMs);
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

            if (error) {
                console.error("Supabase Save Error:", error);
                throw error;
            }

            // 3. Create a Memory (Log the style change)
            // Only create memory if something actually changed (naive check: just do it for now)
            const memoryTitle = `${userName || 'Someone'} updated the look! 🎨`;
            const memoryDesc = `New accessories added to your creature. Check out the fresh style!`;

            const { error: memError } = await supabase.from('memories').insert({
                couple_id: couple.id,
                type: 'Growth', // or 'Milestone'
                title: memoryTitle,
                description: memoryDesc,
                image_emoji: '🎩',
                color_theme: 'lavender',
                created_at: new Date().toISOString()
            });

            if (memError) console.error("Memory Log Error:", memError);

            // 4. Send Notification (Simulated)
            // In a real app, you'd call a backend function here
            console.log(`[NOTIFICATION] Sending to partner: "${memoryTitle}"`);

        } catch (err) {
            console.error('Failed to save accessories in Context:', err);
            // Revert optimistic update
            setCouple(prev => prev); // This triggers a refresh if needed, but ideally we'd have a deep revert
            throw err; // Propagate to UI
        }
    };



    const recordTap = async () => {
        if (!couple || !user) return;

        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString();

        // Initialize or Reset counts if date changed
        let currentCounts = couple.daily_tap_count || { partner1: 0, partner2: 0, date: today };
        if (currentCounts.date !== today) {
            currentCounts = { partner1: 0, partner2: 0, date: today };
        }

        // Increment local user's count
        const isPartner1 = couple.partner1_id === user.id;
        const newCounts = {
            ...currentCounts,
            [isPartner1 ? 'partner1' : 'partner2']: (currentCounts[isPartner1 ? 'partner1' : 'partner2'] || 0) + 1,
            date: today
        };

        // Calculate total for milestones
        const totalTaps = newCounts.partner1 + newCounts.partner2;

        // Optimistic Update
        setCouple(prev => prev ? { ...prev, daily_tap_count: newCounts, last_petted_at: now } : null);

        try {
            // Update DB
            const { error } = await supabase
                .from('couples')
                .update({
                    daily_tap_count: newCounts,
                    last_petted_at: now
                })
                .eq('id', couple.id);

            if (error) throw error;

            // Check Milestones (10, 50, 100) - Only trigger if we just crossed it
            const milestones = [10, 50, 100];
            if (milestones.includes(totalTaps)) {
                // Check if we already created a memory for this milestone today (to prevent dupes from race conditions)
                // In a robust app we'd query DB, but for now we'll optimistically create it
                // We use a unique constraint in DB or check locally if we had this state (simplified here)

                await createTapMilestoneMemory(totalTaps, couple.id);
            }

        } catch (err) {
            console.error("Failed to record tap:", err);
            // Revert would happen on next fetch/sync
        }
    };

    const createTapMilestoneMemory = async (taps: number, coupleId: string) => {
        const messages: Record<number, { title: string; desc: string; emoji: string }> = {
            10: { title: "Feeling Loved! 💕", desc: "You two have tapped your creature 10 times today!", emoji: "☺️" },
            50: { title: "Cuddle Party! 🧸", desc: "50 taps! Your creature is overwhelming with joy.", emoji: "🥰" },
            100: { title: "Maximum Love! 💖", desc: "100 taps! That's true dedication.", emoji: "🔥" }
        };

        const msg = messages[taps];
        if (!msg) return;

        // prevent duplicate milestone today
        // const { data } = await supabase.from('memories').select('id').eq('type', 'Growth').ilike('title', msg.title).gte('created_at', startOfDay(new Date()).toISOString());
        // if (data?.length) return;

        await supabase.from('memories').insert({
            couple_id: coupleId,
            type: 'Growth',
            title: msg.title,
            description: msg.desc,
            image_emoji: msg.emoji,
            color_theme: 'coral',
            created_at: new Date().toISOString()
        });
    };

    const fetchCouple = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Fetch Relationship - Reverting to * to be safe if column missing
            const { data, error } = await supabase
                .from('couples')
                .select('*')
                .or(`partner1_id.eq.${user.id},partner2_id.eq.${user.id}`)
                .single();

            if (data) {
                setCouple(data);
                // Sync creature type with fallback to 'bunny' if not set
                setSelectedCreature((data.creature_type as CreatureType) || 'bunny');

                // 2. Fetch User Profile
                const { data: uData } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
                if (uData?.display_name) setUserName(uData.display_name);

                // 3. Calculate Days Together
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
                            setPartnerLastSeen(pData.last_active_at); // Set last seen
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
            } else {
                console.log("[CreatureContext] No couple data found for user");
            }
        } catch (error) {
            console.error('[CreatureContext] Error fetching creature context:', error);
        } finally {
            console.log("[CreatureContext] Loading set to false");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouple();

        // REAL-TIME SYNC
        if (!user) return;

        // Subscribe to changes in the couples table for our specific ID
        const subscription = supabase
            .channel('couple_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'couples'
                },
                (payload) => {
                    // Only update if it's OUR couple and something relevant changed
                    if (payload.new.id === couple?.id || (payload.new.partner1_id === user.id || payload.new.partner2_id === user.id)) {
                        console.log('Real-time update received:', payload.new);
                        // Update local couple state immediately
                        setCouple(payload.new as CoupleData);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, couple?.id]);

    // WIDGET SYNC
    useEffect(() => {
        if (couple) {
            syncWidgetData({
                streak,
                creatureType: couple.creature_type,
                creatureName: couple.creature_name || undefined,
                partnerName,
                partnerStatus: isPartnerOnline ? 'Online' : 'Offline',
                lastSeen: partnerLastSeen ? formatDistanceToNow(new Date(partnerLastSeen), { addSuffix: true }) : undefined,
                mood: creatureMood || undefined,
            });
        }
    }, [couple, streak, partnerName, isPartnerOnline, partnerLastSeen, creatureMood]);

    // PARTNER ACTIVITY NOTIFICATIONS
    useEffect(() => {
        if (!user || !couple?.id) return;

        const partnerId = couple.partner1_id === user.id ? couple.partner2_id : couple.partner1_id;
        if (!partnerId) return;

        // Subscribe to partner's check-ins
        const checkinSubscription = supabase
            .channel('partner-checkins')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'daily_checkins',
                    filter: `user_id=eq.${partnerId}`
                },
                async (payload) => {
                    // Partner just checked in - trigger notification
                    try {
                        const { notificationService } = await import('../notifications');
                        await notificationService.scheduleLocalNotification({
                            type: 'partner_checked_in',
                            title: `${partnerName} just checked in! 💕`,
                            body: 'Your partner is thinking of you today',
                        });
                    } catch (e) {
                        console.log('Notification skipped:', e);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(checkinSubscription);
        };
    }, [user, couple?.id, couple?.partner1_id, couple?.partner2_id, partnerName]);

    // REAL-TIME: Messages, Surprises, Presence & Rituals
    useEffect(() => {
        if (!user || !couple?.id) return;
        const partnerId = couple.partner1_id === user.id ? couple.partner2_id : couple.partner1_id;

        const channel = supabase.channel('hearth-realtime')
            // 1. Messages
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `couple_id=eq.${couple.id}` },
                async (payload) => {
                    if (payload.new.sender_id !== user.id) {
                        // Partner sent a message
                        const { notificationService } = await import('../notifications');
                        await notificationService.scheduleLocalNotification({
                            type: 'partner_message',
                            title: 'New Message 💌',
                            body: payload.new.content || 'You have a new message from your partner!',
                            data: { messageId: payload.new.id }
                        });
                        setTemporaryMood('excited', 5000); // Creature gets excited
                    }
                }
            )
            // 2. Surprises
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'surprises', filter: `couple_id=eq.${couple.id}` },
                async (payload) => {
                    if (payload.new.sender_id !== user.id) {
                        const { notificationService } = await import('../notifications');
                        await notificationService.scheduleLocalNotification({
                            type: 'partner_surprise',
                            title: 'Surprise! 🎁',
                            body: payload.new.message || 'Your partner sent you a surprise!',
                        });
                        setTemporaryMood('loved', 8000); // Creature feels loved
                    }
                }
            )
            // 3. Daily Rituals (Answers)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'daily_rituals', filter: `couple_id=eq.${couple.id}` },
                async (payload) => {
                    // Check if partner answered (and we haven't been notified yet logic could go here)
                    const newData = payload.new;
                    const oldData = payload.old; // Only available if REPLICA IDENTITY FULL, usually just new

                    // Simple check: if partner field changed and isn't null
                    const isP1 = couple.partner1_id === user.id;
                    const partnerField = isP1 ? 'partner2_response' : 'partner1_response';

                    if (newData[partnerField]) {
                        // In a real app we'd check if it was just added. 
                        // For now we rely on the component or just notify.
                        // Assuming this update meant they answered.
                        const { notificationService } = await import('../notifications');
                        await notificationService.scheduleLocalNotification({
                            type: 'partner_answered_question',
                            title: 'Daily Answer 💭',
                            body: `${partnerName} answered today's question!`,
                        });
                    }
                }
            )
            // 4. Partner Presence (Profiles)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${partnerId}` },
                (payload) => {
                    if (payload.new.last_active_at) {
                        const lastActive = new Date(payload.new.last_active_at);
                        setPartnerLastSeen(payload.new.last_active_at);

                        const now = new Date();
                        const diffMins = (now.getTime() - lastActive.getTime()) / 60000;
                        setIsPartnerOnline(diffMins < 5);
                    }
                }
            )
            .subscribe();

        // Presence Heartbeat
        const heartbeat = setInterval(() => {
            updatePresence();
        }, 60000); // Every minute
        updatePresence(); // And immediately

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
        };
    }, [user, couple?.id, partnerName]);

    // Daily Check-in Logic
    const performCheckIn = async (currentCoupleId: string) => {
        if (!user) return;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const { data: existing } = await supabase
            .from('memories')
            .select('id')
            .eq('couple_id', currentCoupleId)
            .eq('type', 'Daily')
            .gte('created_at', startOfToday.toISOString())
            .maybeSingle();

        if (existing) return;

        console.log("Creating daily check-in...");
        const { error } = await supabase.from('memories').insert({
            couple_id: currentCoupleId,
            type: 'Daily',
            title: 'Daily Check-in',
            description: 'Another day taking care of our creature together.',
            color_theme: 'mint',
            image_emoji: '📅'
        });
        if (error) console.log("Check-in error:", error);
    };

    useEffect(() => {
        if (couple?.id) {
            performCheckIn(couple.id);
        }
    }, [couple?.id]);

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
                isPartnerOnline,
                userName,
                updateAccessories,
                saveAccessories,
                recordTap,
                updateRoom: async (roomId: string) => {
                    if (!couple) return;
                    // Optimistic update
                    setCouple(prev => prev ? { ...prev, room_theme: roomId } : null);
                    try {
                        const { error } = await supabase.from('couples').update({ room_theme: roomId }).eq('id', couple.id);
                        if (error) {
                            console.error('[CreatureContext] DB Update Failed:', error);
                        }
                    } catch (err) {
                        console.error('[CreatureContext] Exception in updateRoom:', err);
                    }
                },
                partnerLastSeen,
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
