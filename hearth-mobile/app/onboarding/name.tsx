import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, GRADIENTS } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NameScreen() {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const buttonScale = useSharedValue(1);

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleButtonPressIn = () => {
        buttonScale.value = withTiming(0.96, { duration: 100 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
    };

    const handleSubmit = async () => {
        if (!user || !name.trim()) return;
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                display_name: name.trim(),
            });

            if (error) throw error;

            await refreshProfile();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/onboarding/select-creature');
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const charCount = name.length;
    const maxChars = 20;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg }}>
            <StatusBar style="dark" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['rgba(255,183,178,0.2)', 'rgba(255,218,193,0.1)', 'transparent']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%' }}
            />

            {/* Decorative Stars */}
            <Animated.Text
                entering={FadeInDown.delay(600).duration(500)}
                style={{ position: 'absolute', top: 100, right: 50, fontSize: 28, opacity: 0.15 }}
            >
                ✦
            </Animated.Text>
            <Animated.Text
                entering={FadeInDown.delay(800).duration(500)}
                style={{ position: 'absolute', top: 180, left: 40, fontSize: 20, opacity: 0.12 }}
            >
                ✦
            </Animated.Text>

            <View style={{ width: '100%', maxWidth: 360 }}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 36, color: COLORS.charcoal, textAlign: 'center', marginBottom: 12 }}>
                        What should we{'\n'}call you?
                    </Text>
                    <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 17, color: 'rgba(45,45,45,0.6)', textAlign: 'center', marginBottom: SPACING.xxl }}>
                        Your partner will see this name.
                    </Text>
                </Animated.View>

                {/* Input Card */}
                <Animated.View
                    entering={FadeInUp.delay(200).duration(500)}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        padding: SPACING.lg,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.9)',
                        ...SHADOWS.md,
                    }}
                >
                    <TextInput
                        style={{
                            backgroundColor: COLORS.white,
                            padding: SPACING.lg,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: focused ? COLORS.coral : 'rgba(45,45,45,0.08)',
                            fontFamily: 'Outfit_600SemiBold',
                            fontSize: 22,
                            color: COLORS.charcoal,
                            textAlign: 'center',
                            marginBottom: SPACING.sm,
                        }}
                        placeholder="e.g. Alex"
                        placeholderTextColor="rgba(45,45,45,0.35)"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        maxLength={maxChars}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />

                    {/* Character Counter */}
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: SPACING.lg }}>
                        <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 13, color: charCount > 15 ? COLORS.coral : 'rgba(45,45,45,0.4)' }}>
                            {charCount}/{maxChars}
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <AnimatedPressable
                        onPress={handleSubmit}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        disabled={loading || !name.trim()}
                        style={buttonAnimatedStyle}
                    >
                        <LinearGradient
                            colors={name.trim() ? [COLORS.charcoal, '#1a1a1a'] : ['rgba(45,45,45,0.3)', 'rgba(45,45,45,0.4)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: '100%',
                                paddingVertical: 18,
                                borderRadius: 24,
                                alignItems: 'center',
                                ...SHADOWS.md,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.cream} />
                            ) : (
                                <Text style={{ color: COLORS.cream, fontFamily: 'Outfit_700Bold', fontSize: 18 }}>
                                    Continue
                                </Text>
                            )}
                        </LinearGradient>
                    </AnimatedPressable>
                </Animated.View>
            </View>
        </View>
    );
}
