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

    if (!session) {
        return <Redirect href="/auth" />;
    }

    if (!couple) {
        // User has no couple data at all -> Go pair
        return <Redirect href="/onboarding/pairing" />;
    }

    if (!couple.partner2_id) {
        // User started a couple but no partner has joined -> Go wait in pairing screen
        return <Redirect href="/onboarding/pairing" />;
    }

    if (!profile || !profile.display_name) {
        // Pair exists, but we don't know who this user is -> Get Name
        return <Redirect href="/onboarding/name" />;
    }

    // Checking if they completed onboarding (Assuming if they are here they have paired)
    // We can check if they have a "valid" creature selected or if they've finished the flow.
    // For now, if paired, we assume they need to pick a creature (or they already did).
    // The select-creature screen should handle the case where a creature is already picked 
    // (maybe by redirecting to tabs, or allowing re-selection). 
    // BUT the prompt said "cannot adopt a pet... waiting for second one".
    // So once paired => Creature Selection.

    // Ideally we need a flag 'onboarding_complete' or simply check if they are in tabs.
    // Let's assume if they have a couple and partner, they go to creature select.
    // Creature Selection will handle redirecting to Tabs if already Done.

    // Quick fix: Check if we are already in the App (Tabs) via context or just let the flow naturally happen.
    // If I put Redirect to (tabs) here, they skip creature selection.
    // If I put Redirect to select-creature, they go there.

    // If matched and named, go to Main App (Home)
    return <Redirect href="/(tabs)" />;
}
