import "../global.css";
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from "../context/AuthContext";
import { CreatureProvider } from "../context/CreatureContext";

SplashScreen.preventAutoHideAsync();

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
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="onboarding/select-creature" />
                    <Stack.Screen name="auth" />
                </Stack>
            </CreatureProvider>
        </AuthProvider>
    );
}
