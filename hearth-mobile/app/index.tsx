import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useCreature } from "../context/CreatureContext";
import { View, ActivityIndicator, Text, Pressable } from "react-native";

export default function Index() {
    const { session, profile, loading: authLoading, signOut } = useAuth();
    const { couple, loading: creatureLoading } = useCreature();

    if (authLoading || creatureLoading) {
        return (
            <View className="flex-1 bg-cream items-center justify-center p-10">
                <ActivityIndicator size="large" color="#FFB7B2" />
                <Text className="mt-4 font-dmsans text-charcoal/40 text-center">Loading your Hearth...</Text>

                {/* Emergency Recovery Path */}
                <Pressable
                    onPress={() => signOut()}
                    className="mt-20 opacity-30 active:opacity-100"
                >
                    <Text className="text-xs text-charcoal underline">Stuck? tap here to reset session</Text>
                </Pressable>
            </View>
        );
    }

    // Step 1: No session -> Login
    if (!session) {
        return <Redirect href="/auth" />;
    }

    // Step 2: No couple record -> Start pairing
    if (!couple) {
        return <Redirect href="/onboarding/pairing" />;
    }

    // Step 3: No partner joined yet -> Wait in pairing screen
    if (!couple.partner2_id) {
        return <Redirect href="/onboarding/pairing" />;
    }

    // Step 4: No display name -> Get name
    if (!profile || !profile.display_name) {
        return <Redirect href="/onboarding/name" />;
    }

    // Step 5: No creature selected -> Select creature together
    if (!couple.creature_type) {
        return <Redirect href="/onboarding/select-creature" />;
    }

    // All onboarding complete -> Go to main app
    return <Redirect href="/(tabs)" />;
}

