import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CoupleData } from './useCreatureData';

interface UseRealtimeEventsProps {
    user: any;
    couple: CoupleData | null;
    setTemporaryMood: (mood: string, durationMs?: number) => void;
}

export function useRealtimeEvents({ user, couple, setTemporaryMood }: UseRealtimeEventsProps) {
    useEffect(() => {
        if (!user || !couple?.id) return;

        const channel = supabase.channel('events-realtime')
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
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, couple?.id, setTemporaryMood]);
}
