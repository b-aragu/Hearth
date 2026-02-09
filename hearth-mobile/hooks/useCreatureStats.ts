import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { supabase } from '../lib/supabase';
import { GAME_CONFIG } from '../constants/game-config';
import { CoupleData } from './useCreatureData';
import { CreatureType } from '../constants/creatures';

interface UseCreatureStatsReturn {
    daysTogether: number;
    streak: number;
    partnerName: string;
    partnerCheckedIn: boolean;
    isPartnerOnline: boolean;
    partnerLastSeen: string | null;
    userName: string;
    hasAnsweredToday: boolean;
    partnerHasAnsweredToday: boolean;
    selectedCreature: CreatureType;
    setSelectedCreature: (c: CreatureType) => void;
}

export function useCreatureStats(user: any, couple: CoupleData | null): UseCreatureStatsReturn {
    // Stats State
    const [daysTogether, setDaysTogether] = useState(0);
    const [streak, setStreak] = useState(0);
    const [partnerName, setPartnerName] = useState('Partner');
    const [partnerCheckedIn, setPartnerCheckedIn] = useState(false);
    const [isPartnerOnline, setIsPartnerOnline] = useState(false);
    const [partnerLastSeen, setPartnerLastSeen] = useState<string | null>(null);
    const [userName, setUserName] = useState('Someone');
    const [selectedCreature, setSelectedCreature] = useState<CreatureType>('bear');

    // Advanced Logic State
    const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
    const [partnerHasAnsweredToday, setPartnerHasAnsweredToday] = useState(false);

    // Helper to update presence
    const updatePresence = async () => {
        if (!user) return;
        const { error } = await supabase.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('id', user.id);
        if (error) console.log("Presence update failed");
    };

    // 1. Initial Fetch & Updates based on Couple/User
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

            // Checkins & Presence
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

    // 2. Real-time Subscriptions (Partner Updates)
    useEffect(() => {
        if (!user || !couple?.id) return;
        const partnerId = couple.partner1_id === user.id ? couple.partner2_id : couple.partner1_id;

        const channel = supabase.channel('stats-realtime')
            // Daily Ritual Updates
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
            // Partner Profile Updates (Presence)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${partnerId}` }, (payload) => {
                if (payload.new.last_active_at) {
                    setPartnerLastSeen(payload.new.last_active_at);
                    const now = new Date();
                    const diffMins = (now.getTime() - new Date(payload.new.last_active_at).getTime()) / 60000;
                    setIsPartnerOnline(diffMins < GAME_CONFIG.PRESENCE.ONLINE_THRESHOLD_MINUTES);
                }
            })
            // Partner Check-ins
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'daily_checkins', filter: `user_id=eq.${partnerId}` }, async () => {
                setPartnerCheckedIn(true);
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

        const heartbeat = setInterval(() => { updatePresence(); }, GAME_CONFIG.PRESENCE.HEARTBEAT_INTERVAL_MS);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(heartbeat);
        };
    }, [user, couple?.id, partnerName]);

    return {
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
    };
}
