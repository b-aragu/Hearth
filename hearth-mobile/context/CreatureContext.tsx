import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CreatureType } from '../constants/creatures';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { differenceInDays, startOfDay, formatDistanceToNow, differenceInHours } from 'date-fns';
import { syncWidgetData } from '../widgets/WidgetSync';

import { useCreatureData, CoupleData } from '../hooks/useCreatureData';
import { GAME_CONFIG } from '../constants/game-config';

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

    // Use the new hook for data persistence
    const { couple, loading, refreshCouple, updateLocalCouple } = useCreatureData(user?.id);

    // Stats
    const [daysTogether, setDaysTogether] = useState(0);
    const [streak, setStreak] = useState(0);
    const [partnerName, setPartnerName] = useState('Partner');
    const [partnerCheckedIn, setPartnerCheckedIn] = useState(false);

    // Advanced Logic State
    const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
    const [partnerHasAnsweredToday, setPartnerHasAnsweredToday] = useState(false);

    const [isPartnerOnline, setIsPartnerOnline] = useState(false);
    const [partnerLastSeen, setPartnerLastSeen] = useState<string | null>(null);
    const [userName, setUserName] = useState('Someone');

    // Mood State
    const [creatureMood, setCreatureMood] = useState('happy');
    const [temporaryMood, setTemporaryMoodState] = useState<string | null>(null);

    // Update Presence Helper
    const updatePresence = async () => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', user.id);
        if (error) console.log("Presence update failed (migration pending?)");
    };

    // Temporary mood change helper
    const setTemporaryMood = (mood: string, durationMs: number = 5000) => {
        setTemporaryMoodState(mood);
        setTimeout(() => setTemporaryMoodState(null), durationMs);
    };

    const updateAccessories = async (items: string[]) => {
        if (!couple) return;
        updateLocalCouple({ accessories: items });
        const { error } = await supabase.from('couples').update({ accessories: items }).eq('id', couple.id);
        if (error) console.error('Failed to update accessories:', error);
    };

    const saveAccessories = async (items: string[], colors: Record<string, string>) => {
        if (!couple || !user) return;
        updateLocalCouple({ accessories: items, accessory_colors: colors });

        try {
            const { error } = await supabase
                .from('couples')
                .update({ accessories: items, accessory_colors: colors })
                .eq('id', couple.id);

            if (error) throw error;

            const memoryTitle = `${userName || 'Someone'} updated the look! 🎨`;
            const { error: memError } = await supabase.from('memories').insert({
                couple_id: couple.id,
                type: 'Growth',
                title: memoryTitle,
                description: `New accessories added to your creature. Check out the fresh style!`,
                image_emoji: '🎩',
                color_theme: 'lavender',
                created_at: new Date().toISOString()
            });

            if (memError) console.error("Memory Log Error:", memError);
        } catch (err) {
            console.error('Failed to save accessories in Context:', err);
            // Revert is hard without previous state, but we rely on refresh
            refreshCouple();
            throw err;
        }
    };

    const recordTap = async () => {
        if (!couple || !user) return;

        // Interactive Mood: Wakes up / Happy when tapped
        setTemporaryMood('happy', 10000);

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
                await createTapMilestoneMemory(totalTaps, couple.id);
            }
        } catch (err) {
            console.error("Failed to record tap:", err);
        }
    };

    const createTapMilestoneMemory = async (taps: number, coupleId: string) => {
        const msg = GAME_CONFIG.TAPS.MESSAGES[taps];
        if (!msg) return;

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

    // Logic to update derived state (stats, names) when couple data changes
    useEffect(() => {
        const updateDerivedState = async () => {
            if (!couple || !user) return;

            setSelectedCreature((couple.creature_type as CreatureType) || 'bunny');

            const { data: uData } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
            if (uData?.display_name) setUserName(uData.display_name);

            if (couple.matched_at) {
                const start = new Date(couple.matched_at);
                const now = new Date();
                setDaysTogether(differenceInDays(now, start) + 1);
            }

            const partnerId = couple.partner1_id === user.id ? couple.partner2_id : couple.partner1_id;
            if (partnerId) {
                // ... (Fetch partner profile logic remains similar or can be moved to a hook)
                const { data: pData } = await supabase.from('profiles').select('display_name, last_active_at').eq('id', partnerId).single();
                if (pData) {
                    if (pData.display_name) setPartnerName(pData.display_name);
                    if (pData.last_active_at) {
                        setPartnerLastSeen(pData.last_active_at);
                        const now = new Date();
                        const diffMins = (now.getTime() - new Date(pData.last_active_at).getTime()) / 60000;
                        setIsPartnerOnline(diffMins < GAME_CONFIG.PRESENCE.ONLINE_THRESHOLD_MINUTES);
                    }
                }

                const today = new Date().toISOString().split('T')[0];
                const { data: checkin } = await supabase
                    .from('daily_checkins')
                    .select('id')
                    .eq('user_id', partnerId)
                    .eq('checkin_date', today)
                    .maybeSingle();

                setPartnerCheckedIn(!!checkin);
            }

            // Daily Ritual Status
            const today = new Date().toISOString().split('T')[0];
            const { data: ritual } = await supabase
                .from('daily_rituals')
                .select('partner1_response, partner2_response')
                .eq('couple_id', couple.id)
                .eq('date', today)
                .maybeSingle();

            if (ritual) {
                const isP1 = couple.partner1_id === user.id;
                setHasAnsweredToday(!!(isP1 ? ritual.partner1_response : ritual.partner2_response));
                setPartnerHasAnsweredToday(!!(isP1 ? ritual.partner2_response : ritual.partner1_response));
            }

            // Checkins
            const { error: checkinError } = await supabase
                .from('daily_checkins')
                .upsert({ couple_id: couple.id, user_id: user.id, checkin_date: today }, { onConflict: 'user_id, checkin_date' });
            if (checkinError) console.log("Checkin Error:", checkinError);
            updatePresence();

            const { data: checkins } = await supabase
                .from('daily_checkins')
                .select('checkin_date, user_id')
                .eq('couple_id', couple.id)
                .order('checkin_date', { ascending: false });

            if (checkins) {
                const dates = new Set(checkins.map(c => c.checkin_date));
                setStreak(dates.size);
            }
        };

        updateDerivedState();
    }, [couple, user]);

    // MOOD CALCULATION LOOP
    useEffect(() => {
        const calculateMood = () => {
            if (temporaryMood) {
                setCreatureMood(temporaryMood);
                return;
            }

            const now = new Date();
            const hour = now.getHours();

            // Neglect (24h)
            if (couple?.last_petted_at) {
                const hoursSincePet = differenceInHours(now, new Date(couple.last_petted_at));
                if (hoursSincePet >= GAME_CONFIG.MOOD.NEGLECT_HOURS) {
                    setCreatureMood('sad');
                    return;
                }
            }

            // Sleepy (9 PM - 6 AM)
            if (hour >= GAME_CONFIG.MOOD.SLEEP_START_HOUR || hour < GAME_CONFIG.MOOD.SLEEP_END_HOUR) {
                setCreatureMood('sleepy');
                return;
            }

            // Excited (>20 taps)
            const totalTaps = (couple?.daily_tap_count?.partner1 || 0) + (couple?.daily_tap_count?.partner2 || 0);
            if (totalTaps > GAME_CONFIG.MOOD.EXCITED_TAPS_THRESHOLD) {
                setCreatureMood('excited');
                return;
            }

            setCreatureMood('happy');
        };

        calculateMood();
        const interval = setInterval(calculateMood, 60000);
        return () => clearInterval(interval);
    }, [temporaryMood, couple?.last_petted_at, couple?.daily_tap_count]);


    // Real-time subscription for couple data
    useEffect(() => {
        if (!user || !couple?.id) return;

        const subscription = supabase
            .channel('couple_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'couples' }, (payload) => {
                if (payload.new.id === couple?.id) {
                    // Update cache via hook
                    updateLocalCouple(payload.new as CoupleData);
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(subscription); };
    }, [user, couple?.id, updateLocalCouple]);

    // WIDGET SYNC
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

    // PARTNER CHECKINS
    useEffect(() => {
        if (!user || !couple?.id) return;
        const partnerId = couple.partner1_id === user.id ? couple.partner2_id : couple.partner1_id;
        if (!partnerId) return;

        const checkinSubscription = supabase
            .channel('partner-checkins')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'daily_checkins', filter: `user_id=eq.${partnerId}` }, async () => {
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
            })
            .subscribe();

        return () => { supabase.removeChannel(checkinSubscription); };
    }, [user, couple?.id, partnerName]);

    // REAL-TIME: Messages, Surprises, Presence & Rituals
    useEffect(() => {
        if (!user || !couple?.id) return;
        const partnerId = couple.partner1_id === user.id ? couple.partner2_id : couple.partner1_id;

        const channel = supabase.channel('hearth-realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `couple_id=eq.${couple.id}` }, async (payload) => {
                if (payload.new.sender_id !== user.id) {
                    const { notificationService } = await import('../notifications');
                    await notificationService.scheduleLocalNotification({ type: 'partner_message', title: 'New Message 💌', body: payload.new.content || 'New message!', data: { messageId: payload.new.id } });
                    setTemporaryMood('excited', 5000);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'surprises', filter: `couple_id=eq.${couple.id}` }, async (payload) => {
                if (payload.new.sender_id !== user.id) {
                    const { notificationService } = await import('../notifications');
                    await notificationService.scheduleLocalNotification({ type: 'partner_surprise', title: 'Surprise! 🎁', body: payload.new.message || 'Surprise!', });
                    setTemporaryMood('loved', 8000);
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'daily_rituals', filter: `couple_id=eq.${couple.id}` }, async (payload) => {
                const newData = payload.new;
                const isP1 = couple.partner1_id === user.id;

                const myResp = isP1 ? newData.partner1_response : newData.partner2_response;
                const partnerResp = isP1 ? newData.partner2_response : newData.partner1_response;

                setHasAnsweredToday(!!myResp);
                setPartnerHasAnsweredToday(!!partnerResp);

                if (partnerResp && !payload.old?.[isP1 ? 'partner2_response' : 'partner1_response']) {
                    const { notificationService } = await import('../notifications');
                    await notificationService.scheduleLocalNotification({ type: 'partner_answered_question', title: 'Daily Answer 💭', body: `${partnerName} answered today's question!`, });
                }
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${partnerId}` }, (payload) => {
                if (payload.new.last_active_at) {
                    setPartnerLastSeen(payload.new.last_active_at);
                    const now = new Date();
                    const diffMins = (now.getTime() - new Date(payload.new.last_active_at).getTime()) / 60000;
                    setIsPartnerOnline(diffMins < GAME_CONFIG.PRESENCE.ONLINE_THRESHOLD_MINUTES);
                }
            })
            .subscribe();

        const heartbeat = setInterval(() => { updatePresence(); }, GAME_CONFIG.PRESENCE.HEARTBEAT_INTERVAL_MS);
        updatePresence();

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
        };
    }, [user, couple?.id, partnerName]);

    // Daily Check-in Logic
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

    // SCHEDULE DAILY NOTIFICATIONS
    useEffect(() => {
        const scheduleReminders = async () => {
            const { notificationService } = await import('../notifications');
            await notificationService.scheduleDailyQuestionReminder(9); // 9 AM
            await notificationService.scheduleStreakReminder(20);       // 8 PM
        };
        scheduleReminders();
    }, []);

    return (
        <CreatureContext.Provider
            value={{
                selectedCreature,
                couple,
                loading,
                refreshCouple, // Use hook's refresh
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
                    updateLocalCouple({ room_theme: roomId });
                    try {
                        const { error } = await supabase.from('couples').update({ room_theme: roomId }).eq('id', couple.id);
                        if (error) console.error('[CreatureContext] DB Update Failed:', error);
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
