import { useState, useEffect, useCallback } from 'react';
import { differenceInHours } from 'date-fns';
import { GAME_CONFIG } from '../constants/game-config';
import { CoupleData } from './useCreatureData';

export function useCreatureMood(couple: CoupleData | null) {
    const [creatureMood, setCreatureMood] = useState('happy');
    const [temporaryMood, setTemporaryMoodState] = useState<string | null>(null);

    const setTemporaryMood = useCallback((mood: string, durationMs: number = 5000) => {
        setTemporaryMoodState(mood);
        setTimeout(() => setTemporaryMoodState(null), durationMs);
    }, []);

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
        const interval = setInterval(calculateMood, 60000); // Recalculate every minute
        return () => clearInterval(interval);
    }, [temporaryMood, couple?.last_petted_at, couple?.daily_tap_count]);

    return {
        creatureMood,
        setTemporaryMood
    };
}
