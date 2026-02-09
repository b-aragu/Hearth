export const GAME_CONFIG = {
    MOOD: {
        NEGLECT_HOURS: 24,       // Hours since last pet before creature gets sad
        SLEEP_START_HOUR: 21,    // 9 PM
        SLEEP_END_HOUR: 6,       // 6 AM
        EXCITED_TAPS_THRESHOLD: 20, // Daily taps needed for excited mood
    },
    TAPS: {
        MILESTONES: [10, 50, 100],
        MESSAGES: {
            10: { title: "Feeling Loved! 💕", desc: "You two have tapped your creature 10 times today!", emoji: "☺️" },
            50: { title: "Cuddle Party! 🧸", desc: "50 taps! Your creature is overwhelming with joy.", emoji: "🥰" },
            100: { title: "Maximum Love! 💖", desc: "100 taps! That's true dedication.", emoji: "🔥" }
        } as Record<number, { title: string; desc: string; emoji: string }>
    },
    PRESENCE: {
        ONLINE_THRESHOLD_MINUTES: 5,
        HEARTBEAT_INTERVAL_MS: 60000, // 1 minute
    }
};
