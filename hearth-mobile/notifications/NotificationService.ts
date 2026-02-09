import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

// Notification types for Hearth app
export type NotificationType =
    | 'partner_message'
    | 'partner_surprise'
    | 'partner_answered_question'
    | 'daily_question_available'
    | 'streak_at_risk'
    | 'partner_checked_in';

interface NotificationPayload {
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
}

// Configure how notifications appear when app is foregrounded
// Configure how notifications appear when app is foregrounded
// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//         shouldShowBanner: true,
//         shouldShowList: true,
//     }),
// });

class NotificationService {
    private expoPushToken: string | null = null;

    // Initialize notification service
    async initialize(): Promise<string | null> {
        // Skip on web - notifications are mobile-only
        if (Platform.OS === 'web') {
            console.log('Notifications not available on web');
            return null;
        }

        // Check if physical device (required for push notifications)
        if (!Device.isDevice) {
            console.log('Push notifications require a physical device');
            return null;
        }

        // Request permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token - permissions not granted');
            return null;
        }

        // Get Expo push token
        try {
            const token = await Notifications.getExpoPushTokenAsync({
                projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
            });
            this.expoPushToken = token.data;

            // Save token for server-side notifications
            await this.savePushToken(token.data);

            return token.data;
        } catch (error) {
            console.error('Error getting push token:', error);
            return null;
        }
    }

    // Save push token to user's profile (graceful fail if column doesn't exist)
    private async savePushToken(token: string): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({ push_token: token })
                    .eq('id', user.id);

                if (error) {
                    // Column might not exist yet - this is okay
                    console.log('Push token save skipped (column may not exist):', error.message);
                }
            }
        } catch (error) {
            // Silently fail - push tokens are optional
            console.log('Push token save skipped');
        }
    }

    // Schedule a local notification
    async scheduleLocalNotification(payload: NotificationPayload): Promise<string | null> {
        // Check if this notification type is enabled
        const isEnabled = await this.isNotificationEnabled(payload.type);
        if (!isEnabled) return null;

        try {
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: payload.title,
                    body: payload.body,
                    data: { type: payload.type, ...payload.data },
                    sound: true,
                },
                trigger: null, // Immediate
            });
            return id;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return null;
        }
    }

    // Schedule daily question reminder (morning)
    async scheduleDailyQuestionReminder(hour: number = 9): Promise<void> {
        // Cancel existing daily reminders
        await this.cancelScheduledNotifications('daily_question_available');

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Today's Question is Ready 💭",
                body: "Share your thoughts with your partner!",
                data: { type: 'daily_question_available', screen: '/rituals/daily-question' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour,
                minute: 0,
            },
        });
    }

    // Schedule streak reminder (evening)
    async scheduleStreakReminder(hour: number = 20): Promise<void> {
        await this.cancelScheduledNotifications('streak_at_risk');

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Keep Your Streak Alive! 🔥",
                body: "Check in with your partner before midnight",
                data: { type: 'streak_at_risk', screen: '/' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour,
                minute: 0,
            },
        });
    }

    // Cancel notifications by type
    async cancelScheduledNotifications(type?: NotificationType): Promise<void> {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();

        for (const notification of scheduled) {
            if (!type || notification.content.data?.type === type) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }
    }

    // Check if notification type is enabled
    async isNotificationEnabled(type: NotificationType): Promise<boolean> {
        const prefs = await this.getNotificationPreferences();
        return prefs[type] !== false; // Default to enabled
    }

    // Get notification preferences
    async getNotificationPreferences(): Promise<Record<NotificationType, boolean>> {
        try {
            const stored = await AsyncStorage.getItem('notification_preferences');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error reading notification preferences:', error);
        }

        // Default preferences (all enabled)
        return {
            partner_message: true,
            partner_surprise: true,
            partner_answered_question: true,
            daily_question_available: true,
            streak_at_risk: true,
            partner_checked_in: true,
        };
    }

    // Update notification preference
    async setNotificationPreference(type: NotificationType, enabled: boolean): Promise<void> {
        const prefs = await this.getNotificationPreferences();
        prefs[type] = enabled;
        await AsyncStorage.setItem('notification_preferences', JSON.stringify(prefs));
    }

    // Send test notification
    async sendTestNotification(): Promise<void> {
        await this.scheduleLocalNotification({
            type: 'partner_message',
            title: '💕 Test Notification',
            body: 'Notifications are working perfectly!',
        });
    }

    // Get badge count
    async getBadgeCount(): Promise<number> {
        return await Notifications.getBadgeCountAsync();
    }

    // Set badge count
    async setBadgeCount(count: number): Promise<void> {
        await Notifications.setBadgeCountAsync(count);
    }

    // Clear all notifications
    async clearAllNotifications(): Promise<void> {
        await Notifications.dismissAllNotificationsAsync();
        await this.setBadgeCount(0);
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
