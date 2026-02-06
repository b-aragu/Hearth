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
import { useNotificationHandler } from "../notifications";

SplashScreen.preventAutoHideAsync();

// Notification wrapper component
function NotificationWrapper({ children }: { children: React.ReactNode }) {
    useNotificationHandler();
    return <>{children}</>;
}

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
            <CreatureProvider>
                <NotificationWrapper>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="onboarding/select-creature" />
                        <Stack.Screen name="auth" />
                    </Stack>
                </NotificationWrapper>
            </CreatureProvider>
        </AuthProvider>
    );
}

