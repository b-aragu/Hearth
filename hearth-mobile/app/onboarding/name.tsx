import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function NameScreen() {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!user || !name.trim()) return;
        setLoading(true);

        try {
            // Upsert profile
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                display_name: name.trim(),
            });

            if (error) throw error;

            await refreshProfile();
            // Redirect will be handled by index.tsx or we can force it here
            router.replace('/onboarding/select-creature');

        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-cream items-center justify-center p-6">
            <StatusBar style="dark" />

            <Animated.View entering={FadeInDown.delay(100)} className="w-full max-w-sm">
                <Text className="font-outfit font-bold text-4xl text-charcoal text-center mb-2">
                    What should we call you?
                </Text>
                <Text className="font-dmsans text-charcoal/60 text-center text-lg mb-10">
                    Your partner will see this name.
                </Text>

                <TextInput
                    className="bg-white p-5 rounded-2xl border border-charcoal/10 font-outfit text-xl text-charcoal mb-6 text-center shadow-sm"
                    placeholder="e.g. Alex"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                    maxLength={20}
                />

                <Pressable
                    onPress={handleSubmit}
                    disabled={loading || !name.trim()}
                    className={`w-full bg-charcoal py-5 rounded-full shadow-lg active:scale-95 transition-transform ${loading || !name.trim() ? 'opacity-50' : ''}`}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF9F0" />
                    ) : (
                        <Text className="text-cream text-center font-outfit font-bold text-lg">
                            Continue
                        </Text>
                    )}
                </Pressable>
            </Animated.View>
        </View>
    );
}
