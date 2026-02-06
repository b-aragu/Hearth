import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import notificationService, { NotificationType } from './NotificationService';

// Route mapping for notification types
const NOTIFICATION_ROUTES: Record<NotificationType, string> = {
    partner_message: '/',
    partner_surprise: '/',
    partner_answered_question: '/rituals/daily-question',
    daily_question_available: '/rituals/daily-question',
    streak_at_risk: '/',
    partner_checked_in: '/',
};

// Handle notification tap (when app opens from notification)
export function handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;
    const type = data?.type as NotificationType;
    const customScreen = data?.screen as string | undefined;

    // Navigate to appropriate screen
    const targetRoute = customScreen || NOTIFICATION_ROUTES[type] || '/';

    // Small delay to ensure router is ready
    setTimeout(() => {
        router.push(targetRoute as any);
    }, 100);
}

// Handle notification received while app is foregrounded
export function handleNotificationReceived(notification: Notifications.Notification): void {
    const data = notification.request.content.data;
    const type = data?.type as NotificationType;

    console.log('Notification received:', type);

    // You can trigger in-app toast/overlay here for certain types
    // For example, show a brief "Partner sent you a surprise!" banner
}

// Custom hook to handle notifications
export function useNotificationHandler() {
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);
    const appState = useRef<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        // Skip on web - notifications are mobile-only
        if (Platform.OS === 'web') {
            console.log('Notifications not available on web');
            return;
        }

        // Initialize notifications
        notificationService.initialize();

        // Listener for notifications received while app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification: Notifications.Notification) => {
                handleNotificationReceived(notification);
            }
        );

        // Listener for when user taps a notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response: Notifications.NotificationResponse) => {
                handleNotificationResponse(response);
            }
        );

        // Clear badge when app comes to foreground
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                notificationService.setBadgeCount(0);
            }
            appState.current = nextAppState;
        });

        // Check if app was opened by notification
        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (response) {
                handleNotificationResponse(response);
            }
        }).catch(() => {
            // Silently ignore - not available on web
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
            subscription.remove();
        };
    }, []);
}

export default useNotificationHandler;
