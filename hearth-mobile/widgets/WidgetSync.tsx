import { Platform } from 'react-native';
import { DayStreakWidget } from './DayStreakWidget';
import { PartnerStatusWidget } from './PartnerStatusWidget';

// Safe import helper - only load on Android
let requestWidgetUpdate: any = async () => { };
if (Platform.OS === 'android') {
    try {
        const widgetLib = require('react-native-android-widget');
        requestWidgetUpdate = widgetLib.requestWidgetUpdate;
    } catch (e) {
        console.warn("Failed to load android widget lib", e);
    }
}

interface SyncWidgetDataProps {
    streak: number;
    creatureType: string; // e.g., 'bear', 'bunny'
    creatureName?: string;
    partnerName: string;
    partnerStatus: 'Online' | 'Offline' | 'Sleeping' | 'Away';
    lastSeen?: string;
    mood?: string;
    streakGlowing?: boolean;
}

const getCreatureEmoji = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'bear': return '🐻';
        case 'bunny': return '🐰';
        case 'cat': return '🐱';
        case 'penguin': return '🐧';
        case 'dog': return '🐶';
        case 'fox': return '🦊';
        case 'panda': return '🐼';
        case 'koala': return '🐨';
        default: return '❤️';
    }
};

const getMoodEmoji = (mood?: string) => {
    switch (mood) {
        case 'happy': return '😊';
        case 'loved': return '😍';
        case 'excited': return '🤩';
        case 'sad': return '😢';
        case 'sleepy': return '😴';
        case 'neutral': return '';
        default: return '';
    }
};

/**
 * Sync widget data to Android home screen widgets
 * Call this whenever relevant data changes (streak, partner status, etc.)
 */
export async function syncWidgetData({
    streak,
    creatureType,
    creatureName,
    partnerName,
    partnerStatus,
    lastSeen,
    mood,
    streakGlowing,
}: SyncWidgetDataProps) {
    if (Platform.OS !== 'android') return;

    try {
        // Update DayStreak Widget
        await requestWidgetUpdate({
            widgetName: 'DayStreak',
            renderWidget: () => (
                <DayStreakWidget
                    streak={streak.toString()}
                    creature={`${getCreatureEmoji(creatureType)} ${getMoodEmoji(mood)}`}
                    creatureName={creatureName}
                    isGlowing={streakGlowing}
                />
            ),
            widgetNotFound: () => {
                // Widget might not be added by user yet - this is normal
            }
        });

        // Update PartnerStatus Widget
        await requestWidgetUpdate({
            widgetName: 'PartnerStatus',
            renderWidget: () => (
                <PartnerStatusWidget
                    partnerName={partnerName}
                    status={partnerStatus}
                    lastSeen={lastSeen}
                />
            ),
            widgetNotFound: () => {
                // Widget might not be added by user yet - this is normal
            }
        });

        console.log('Widgets synced successfully');
    } catch (error) {
        console.log("Widget Sync Error:", error);
    }
}

/**
 * Force refresh all widgets
 * Call when user explicitly requests a refresh
 */
export async function forceRefreshWidgets() {
    if (Platform.OS !== 'android') return;

    try {
        const widgetLib = require('react-native-android-widget');
        await widgetLib.requestWidgetUpdateById('DayStreak');
        await widgetLib.requestWidgetUpdateById('PartnerStatus');
    } catch (error) {
        console.log("Widget force refresh error:", error);
    }
}

export default syncWidgetData;
