import "../global.css";
import "../widget-register"; // Register Android widget handlers
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from "../context/AuthContext";
import { CreatureProvider } from "../context/CreatureContext";
import { ActionQueueProvider } from "../context/ActionQueueContext";
import { useNotificationHandler } from "../notifications";
import { OfflineBanner } from "../components/OfflineBanner";

// Notification wrapper component
function NotificationWrapper({ children }: { children: React.ReactNode }) {
    useNotificationHandler();
    return (
        <>
            <OfflineBanner />
            {children}
        </>
    );
}

const linking = {
    prefixes: ['hearth://', 'com.baragu.hearthmobile://'],
    config: {
        screens: {
            '(tabs)': {
                screens: {
                    index: 'home',
                    journal: 'memories',
                    studio: 'style',
                    settings: 'us',
                },
            },
            'surprise': 'surprise',
            'onboarding/select-creature': 'onboarding/select-creature',
            'auth': 'auth',
        },
    },
};

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_700Bold,
        DMSans_400Regular,
        DMSans_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AuthProvider>
            <ActionQueueProvider>
                <CreatureProvider>
                    <NotificationWrapper>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="onboarding/select-creature" />
                            <Stack.Screen name="auth" />
                        </Stack>
                    </NotificationWrapper>
                </CreatureProvider>
            </ActionQueueProvider>
        </AuthProvider>
    );
}

