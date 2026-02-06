import { View, Text, Pressable, TextInput, ActivityIndicator, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useCreature } from '../../context/CreatureContext';
import { supabase } from '../../lib/supabase';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, GRADIENTS } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PairingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { refreshCouple, couple } = useCreature();
    const [mode, setMode] = useState<'initial' | 'creating' | 'joining'>('initial');
    const [inviteCode, setInviteCode] = useState('');
    const [joinInput, setJoinInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [joinFocused, setJoinFocused] = useState(false);

    const buttonScale = useSharedValue(1);
    const pulseScale = useSharedValue(1);

    // Pulse animation for waiting indicator
    useEffect(() => {
        if (mode === 'creating') {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                false
            );
        }
    }, [mode]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    // If we land here and already have a couple with a code but no partner, show "Waiting" mode
    useEffect(() => {
        if (couple && couple.invite_code && !couple.partner2_id) {
            setMode('creating');
            setInviteCode(couple.invite_code);
        }
    }, [couple]);

    // Poll for partner connection if waiting
    useEffect(() => {
        if (mode === 'creating' && inviteCode) {
            const interval = setInterval(async () => {
                await refreshCouple();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [mode, inviteCode]);

    // AUTO-REDIRECT: When partner is found
    useEffect(() => {
        if (couple && couple.partner2_id) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/');
        }
    }, [couple]);

    const handleButtonPressIn = () => {
        buttonScale.value = withTiming(0.96, { duration: 100 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
    };

    const handleCreateHome = async () => {
        if (!user) return;
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        try {
            const { error } = await supabase.from('couples').insert({
                partner1_id: user.id,
                invite_code: code,
                creature_type: 'bear',
            });

            if (error) throw error;

            setInviteCode(code);
            setMode('creating');
            await refreshCouple();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinHome = async () => {
        if (!user || !joinInput || joinInput.length < 6) return;
        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('[Pairing] Attempting to join with code:', joinInput);
        try {
            const { data: foundCouple, error: findError } = await supabase
                .from('couples')
                .select('*')
                .eq('invite_code', joinInput.toUpperCase())
                .maybeSingle();

            if (findError) console.error('[Pairing] Find Error:', findError);
            if (!foundCouple) {
                throw new Error('Invalid Invite Code');
            }

            if (foundCouple.partner2_id) throw new Error('This home is full!');
            if (foundCouple.partner1_id === user.id) throw new Error("You can't join your own home!");

            const { error: updateError } = await supabase
                .from('couples')
                .update({ partner2_id: user.id })
                .eq('id', foundCouple.id);

            if (updateError) throw updateError;

            await refreshCouple();
        } catch (e: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(inviteCode);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const shareCode = async () => {
        try {
            await Share.share({
                message: `Join me on Hearth! Here is our invite code: ${inviteCode} 💕`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg }}>
            <StatusBar style="dark" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['rgba(255,154,162,0.18)', 'rgba(255,218,193,0.1)', 'transparent']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
            />

            {/* Decorative Stars */}
            <Animated.Text
                entering={FadeInDown.delay(500).duration(500)}
                style={{ position: 'absolute', top: 80, right: 40, fontSize: 32, opacity: 0.15 }}
            >
                ✦
            </Animated.Text>
            <Animated.Text
                entering={FadeInDown.delay(700).duration(500)}
                style={{ position: 'absolute', top: 160, left: 35, fontSize: 22, opacity: 0.12 }}
            >
                ✦
            </Animated.Text>

            <View style={{ width: '100%', maxWidth: 360 }}>
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ marginBottom: SPACING.xl }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 34, color: COLORS.charcoal, textAlign: 'center', marginBottom: 12 }}>
                        {mode === 'creating' ? 'Waiting for Partner' : 'Start Your Journey'}
                    </Text>
                    <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 16, color: 'rgba(45,45,45,0.6)', textAlign: 'center', lineHeight: 24 }}>
                        {mode === 'creating'
                            ? 'Share this code with your partner to link your accounts.'
                            : 'Hearth is designed for two.\nInvite your partner or join them!'}
                    </Text>
                </Animated.View>

                {/* Initial Mode */}
                {mode === 'initial' && (
                    <Animated.View entering={FadeInUp.delay(200).duration(500)} style={{ gap: 16 }}>
                        {/* Create Home Button */}
                        <AnimatedPressable
                            onPress={handleCreateHome}
                            onPressIn={handleButtonPressIn}
                            onPressOut={handleButtonPressOut}
                            disabled={loading}
                            style={buttonAnimatedStyle}
                        >
                            <LinearGradient
                                colors={GRADIENTS.coralPeach}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    paddingVertical: 20,
                                    borderRadius: 24,
                                    alignItems: 'center',
                                    ...SHADOWS.md,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={{ color: COLORS.white, fontFamily: 'Outfit_700Bold', fontSize: 19 }}>
                                        🏠 Create New Home
                                    </Text>
                                )}
                            </LinearGradient>
                        </AnimatedPressable>

                        {/* Divider */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(45,45,45,0.1)' }} />
                            <Text style={{ marginHorizontal: 16, color: 'rgba(45,45,45,0.4)', fontFamily: 'DMSans_400Regular' }}>OR</Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(45,45,45,0.1)' }} />
                        </View>

                        {/* Join Button */}
                        <Pressable
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setMode('joining');
                            }}
                            style={{
                                backgroundColor: COLORS.white,
                                borderWidth: 2,
                                borderColor: 'rgba(45,45,45,0.1)',
                                paddingVertical: 18,
                                borderRadius: 24,
                                alignItems: 'center',
                                ...SHADOWS.sm,
                            }}
                        >
                            <Text style={{ color: COLORS.charcoal, fontFamily: 'Outfit_700Bold', fontSize: 18 }}>
                                💌 I Have a Code
                            </Text>
                        </Pressable>
                    </Animated.View>
                )}

                {/* Creating Mode - Waiting for Partner */}
                {mode === 'creating' && (
                    <Animated.View
                        entering={FadeInUp.duration(500).springify()}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            padding: SPACING.xl,
                            borderRadius: 32,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.9)',
                            ...SHADOWS.lg,
                        }}
                    >
                        <Text style={{ fontFamily: 'DMSans_700Bold', color: 'rgba(45,45,45,0.5)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: SPACING.sm }}>
                            Your Invite Code
                        </Text>

                        <Pressable onPress={copyToClipboard}>
                            <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 48, color: COLORS.charcoal, letterSpacing: 6, marginBottom: SPACING.sm }}>
                                {inviteCode}
                            </Text>
                        </Pressable>

                        <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg }}>
                            <Pressable
                                onPress={copyToClipboard}
                                style={{
                                    backgroundColor: copyFeedback ? 'rgba(168,220,192,0.3)' : 'rgba(45,45,45,0.06)',
                                    paddingHorizontal: SPACING.md,
                                    paddingVertical: 10,
                                    borderRadius: 16,
                                }}
                            >
                                <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 14, color: copyFeedback ? COLORS.mint : 'rgba(45,45,45,0.6)' }}>
                                    {copyFeedback ? 'Copied! ✓' : 'Copy'}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={shareCode}
                                style={{
                                    backgroundColor: 'rgba(255,154,162,0.15)',
                                    paddingHorizontal: SPACING.md,
                                    paddingVertical: 10,
                                    borderRadius: 16,
                                }}
                            >
                                <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 14, color: COLORS.coral }}>Share</Text>
                            </Pressable>
                        </View>

                        <Animated.View
                            style={[
                                pulseStyle,
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: SPACING.sm,
                                    backgroundColor: 'rgba(255,249,240,0.8)',
                                    paddingHorizontal: SPACING.md,
                                    paddingVertical: 12,
                                    borderRadius: 20,
                                },
                            ]}
                        >
                            <ActivityIndicator color={COLORS.coral} size="small" />
                            <Text style={{ fontFamily: 'DMSans_400Regular', color: 'rgba(45,45,45,0.5)', fontSize: 14, fontStyle: 'italic' }}>
                                Waiting for connection...
                            </Text>
                        </Animated.View>
                    </Animated.View>
                )}

                {/* Joining Mode */}
                {mode === 'joining' && (
                    <Animated.View
                        entering={FadeInUp.duration(500).springify()}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            padding: SPACING.lg,
                            borderRadius: 32,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.9)',
                            ...SHADOWS.lg,
                        }}
                    >
                        <Pressable
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setMode('initial');
                            }}
                            style={{ alignSelf: 'flex-start', marginBottom: SPACING.md }}
                        >
                            <Text style={{ color: 'rgba(45,45,45,0.5)', fontFamily: 'DMSans_400Regular', fontSize: 14 }}>← Back</Text>
                        </Pressable>

                        <Text style={{ fontFamily: 'DMSans_400Regular', color: 'rgba(45,45,45,0.6)', marginBottom: SPACING.md, textAlign: 'center', fontSize: 15 }}>
                            Enter the code from your partner
                        </Text>

                        <TextInput
                            style={{
                                backgroundColor: 'rgba(255,249,240,0.8)',
                                padding: SPACING.lg,
                                borderRadius: 20,
                                borderWidth: 2,
                                borderColor: joinFocused ? COLORS.coral : 'rgba(45,45,45,0.08)',
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 28,
                                color: COLORS.charcoal,
                                textAlign: 'center',
                                letterSpacing: 6,
                                marginBottom: SPACING.lg,
                            }}
                            placeholder="CODE"
                            placeholderTextColor="rgba(45,45,45,0.3)"
                            autoCapitalize="characters"
                            maxLength={6}
                            value={joinInput}
                            onChangeText={setJoinInput}
                            autoFocus
                            onFocus={() => setJoinFocused(true)}
                            onBlur={() => setJoinFocused(false)}
                        />

                        <AnimatedPressable
                            onPress={handleJoinHome}
                            onPressIn={handleButtonPressIn}
                            onPressOut={handleButtonPressOut}
                            disabled={loading || joinInput.length < 6}
                            style={buttonAnimatedStyle}
                        >
                            <LinearGradient
                                colors={joinInput.length >= 6 ? GRADIENTS.coralPeach : ['rgba(45,45,45,0.2)', 'rgba(45,45,45,0.3)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    width: '100%',
                                    paddingVertical: 16,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    ...SHADOWS.sm,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={{ color: COLORS.white, fontFamily: 'Outfit_700Bold', fontSize: 17 }}>
                                        Join Partner
                                    </Text>
                                )}
                            </LinearGradient>
                        </AnimatedPressable>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}
