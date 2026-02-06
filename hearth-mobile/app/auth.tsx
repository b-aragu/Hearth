import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, GRADIENTS } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AuthScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Animated icon
    const iconScale = useSharedValue(1);
    const iconRotate = useSharedValue(0);
    const buttonScale = useSharedValue(1);

    useEffect(() => {
        // Gentle breathing animation for icon
        iconScale.value = withRepeat(
            withSequence(
                withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    async function handleAuth() {
        if (!email || !password) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            console.log('[Auth] Starting authentication process...');
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();

            if (isLogin) {
                console.log('[Auth] Attempting Login with:', trimmedEmail);
                const { error } = await supabase.auth.signInWithPassword({
                    email: trimmedEmail,
                    password: trimmedPassword,
                });

                if (error) {
                    console.error('[Auth] Login Error:', error);
                    throw error;
                }

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                console.log('[Auth] Login Success! Redirecting to /');
                router.replace('/');
            } else {
                console.log('[Auth] Attempting Signup with:', trimmedEmail);
                const { data, error } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password: trimmedPassword,
                });

                if (error) {
                    console.error('[Auth] Signup Error:', error);
                    throw error;
                }

                if (data.session) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    console.log('[Auth] Auto-Signup Session Active. Redirecting to /');
                    router.replace('/');
                } else {
                    console.log('[Auth] Signup Success. Waiting for Email Confirmation.');
                    Alert.alert('Check your email', 'We sent you a confirmation link! Click it to log in.');
                    setIsLogin(true);
                }
            }
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.error(error);
            let message = error.message;
            if (error.message.includes('User already registered')) {
                message = 'This email is already taken. Try logging in.';
            } else if (error.message.includes('Invalid login credentials')) {
                message = 'Wrong email or password.';
            } else if (error.message.includes('rate limit') || error.status === 429) {
                message = 'Too many attempts! Please wait a moment.';
            }
            Alert.alert('Authentication Failed', message);
        } finally {
            setLoading(false);
        }
    }

    const handleButtonPressIn = () => {
        buttonScale.value = withTiming(0.96, { duration: 100 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar style="dark" />

            {/* Background Gradient */}
            <LinearGradient
                colors={[COLORS.accentLight, 'transparent'] as any}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%' }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            {/* Decorative Elements */}
            <Animated.Text
                entering={FadeInDown.delay(500).duration(600)}
                style={{
                    position: 'absolute',
                    top: 80,
                    right: 40,
                    fontSize: 32,
                    opacity: 0.15,
                }}
            >
                ✦
            </Animated.Text>
            <Animated.Text
                entering={FadeInDown.delay(700).duration(600)}
                style={{
                    position: 'absolute',
                    top: 140,
                    left: 30,
                    fontSize: 24,
                    opacity: 0.12,
                }}
            >
                ✦
            </Animated.Text>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, justifyContent: 'center', paddingHorizontal: SPACING.lg }}
            >
                {/* Hero Section */}
                <Animated.View
                    entering={FadeInDown.duration(600)}
                    style={{ alignItems: 'center', marginBottom: SPACING.xxl }}
                >
                    <Animated.Text style={[iconAnimatedStyle, { fontSize: 96, marginBottom: SPACING.md }]}>
                        🏠
                    </Animated.Text>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 36, color: COLORS.textPrimary, marginBottom: 8 }}>
                        Hearth
                    </Text>
                    <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 16, color: COLORS.textSecondary, textAlign: 'center' }}>
                        Your shared digital home.
                    </Text>
                </Animated.View>

                {/* Form Card */}
                <Animated.View
                    entering={FadeInUp.delay(200).duration(500)}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        padding: SPACING.lg,
                        borderRadius: 32,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.9)',
                        ...SHADOWS.lg,
                    }}
                >
                    {/* Email Input */}
                    <View style={{ marginBottom: SPACING.md }}>
                        <Text
                            style={{
                                fontFamily: 'DMSans_700Bold',
                                color: emailFocused ? COLORS.accent : COLORS.textMuted,
                                fontSize: 11,
                                letterSpacing: 1.2,
                                textTransform: 'uppercase',
                                marginBottom: 8,
                                marginLeft: 4,
                            }}
                        >
                            Email
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: COLORS.white,
                                padding: SPACING.md,
                                paddingVertical: 18,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: emailFocused ? COLORS.accent : COLORS.warmGray,
                                fontFamily: 'DMSans_400Regular',
                                fontSize: 17,
                                color: COLORS.textPrimary,
                            }}
                            placeholder="love@hearth.app"
                            placeholderTextColor="rgba(45,45,45,0.35)"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={{ marginBottom: SPACING.xl }}>
                        <Text
                            style={{
                                fontFamily: 'DMSans_700Bold',
                                color: passwordFocused ? COLORS.accent : COLORS.textMuted,
                                fontSize: 11,
                                letterSpacing: 1.2,
                                textTransform: 'uppercase',
                                marginBottom: 8,
                                marginLeft: 4,
                            }}
                        >
                            Password
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: COLORS.white,
                                padding: SPACING.md,
                                paddingVertical: 18,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: passwordFocused ? COLORS.accent : COLORS.warmGray,
                                fontFamily: 'DMSans_400Regular',
                                fontSize: 17,
                                color: COLORS.textPrimary,
                            }}
                            placeholder="••••••••"
                            placeholderTextColor="rgba(45,45,45,0.35)"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                        />
                    </View>

                    {/* Submit Button */}
                    <AnimatedPressable
                        onPress={handleAuth}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        disabled={loading}
                        style={buttonAnimatedStyle}
                    >
                        <LinearGradient
                            colors={GRADIENTS.primary as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                width: '100%',
                                paddingVertical: 18,
                                borderRadius: 24,
                                alignItems: 'center',
                                opacity: loading ? 0.8 : 1,
                                ...SHADOWS.glow,
                            }}
                        >
                            {loading ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <ActivityIndicator color="white" size="small" />
                                    <Text style={{ color: COLORS.white, fontFamily: 'Outfit_600SemiBold', fontSize: 17 }}>
                                        {isLogin ? 'Signing in...' : 'Creating...'}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={{ color: COLORS.white, fontFamily: 'Outfit_700Bold', fontSize: 18 }}>
                                    {isLogin ? 'Welcome Home' : 'Create Account'}
                                </Text>
                            )}
                        </LinearGradient>
                    </AnimatedPressable>
                </Animated.View>

                {/* Toggle Section */}
                <Animated.View entering={FadeInUp.delay(400).duration(400)}>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setIsLogin(!isLogin);
                        }}
                        style={{ marginTop: SPACING.lg, alignItems: 'center', padding: SPACING.md }}
                    >
                        <Text style={{ color: COLORS.textSecondary, fontFamily: 'DMSans_400Regular', fontSize: 15 }}>
                            {isLogin ? "Don't have a key? " : 'Already have a key? '}
                            <Text style={{ fontFamily: 'DMSans_600SemiBold', color: COLORS.accent }}>
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </Text>
                        </Text>
                    </Pressable>

                    {/* DEBUG: Show loaded API URL */}
                    <Text style={{ textAlign: 'center', fontSize: 9, color: '#AAA', marginTop: 24, opacity: 0.5 }}>
                        API: {process.env.EXPO_PUBLIC_SUPABASE_URL || 'UNDEFINED'}
                    </Text>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}