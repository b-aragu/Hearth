import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { CreatureType } from '../constants/creatures';
import { differenceInDays } from 'date-fns';

const CACHE_KEY_COUPLE = 'hearth_couple_data';

export interface CoupleData {
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
    accessories?: string[];
    accessory_colors?: Record<string, string>;
    last_petted_at?: string;
    daily_tap_count?: { partner1: number; partner2: number; date: string };
    room_theme?: string;
}

export function useCreatureData(userId: string | undefined) {
    const [couple, setCouple] = useState<CoupleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    // Initial Load: Cache First, then Network
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        loadData();
    }, [userId]);

    const loadData = async () => {
        setLoading(true);

        // 1. Try to load from cache immediately
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY_COUPLE);
            if (cached) {
                console.log('[useCreatureData] Loaded from cache');
                setCouple(JSON.parse(cached));
                setLoading(false); // Valid data to show
            }
        } catch (e) {
            console.error('[useCreatureData] Cache read error:', e);
        }

        // 2. Fetch fresh data
        try {
            const { data, error } = await supabase
                .from('couples')
                .select('*')
                .or(`partner1_id.eq.${userId},partner2_id.eq.${userId}`)
                .single();

            if (error) throw error;

            if (data) {
                console.log('[useCreatureData] Fetched fresh data');
                setCouple(data as CoupleData);
                await AsyncStorage.setItem(CACHE_KEY_COUPLE, JSON.stringify(data));
                setIsOfflineMode(false);
            }
        } catch (err) {
            console.warn('[useCreatureData] Network fetch failed, ensuring offline mode:', err);
            setIsOfflineMode(true);
        } finally {
            setLoading(false);
        }
    };

    const updateLocalCouple = useCallback((newData: Partial<CoupleData>) => {
        setCouple(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...newData };
            AsyncStorage.setItem(CACHE_KEY_COUPLE, JSON.stringify(updated)).catch(e => console.error(e));
            return updated;
        });
    }, []);

    return {
        couple,
        loading,
        isOfflineMode,
        refreshCouple: loadData,
        updateLocalCouple
    };
}
