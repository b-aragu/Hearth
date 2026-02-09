import "../global.css";
import "../widget-register"; // Register Android widget handlers
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold, Outfit_600SemiBold } from '@expo-google-fonts/outfit';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from "../context/AuthContext";
import { CreatureProvider } from "../context/CreatureContext";
import { ActionQueueProvider } from "../context/ActionQueueContext";
// import { useNotificationHandler } from "../notifications";
import { OfflineBanner } from "../components/OfflineBanner";

// Notification wrapper component
// function NotificationWrapper({ children }: { children: React.ReactNode }) {
//     useNotificationHandler();
//     return (
//         <>
//             <OfflineBanner />
//             {children}
//         </>
//     );
// }

import * as Sentry from '@sentry/react-native';

import { PostHogProvider } from 'posthog-react-native';

// Initialize Sentry (User must add DSN)
Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
    debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function RootLayout() {
    const [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
        Outfit_600SemiBold,
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_700Bold,
    });

    // useNotificationHandler();

    // Prevent auto-hide until fonts are loaded
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <PostHogProvider
            apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY || ''}
            options={{
                host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
            }}
        >
            <AuthProvider>
                <ActionQueueProvider>
                    <CreatureProvider>
                        {/* <NotificationWrapper> */}
                        <OfflineBanner />
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="onboarding/select-creature" />
                            <Stack.Screen name="auth" />
                        </Stack>
                        {/* </NotificationWrapper> */}
                    </CreatureProvider>
                </ActionQueueProvider>
            </AuthProvider>
        </PostHogProvider>
    );
}

export default RootLayout;
