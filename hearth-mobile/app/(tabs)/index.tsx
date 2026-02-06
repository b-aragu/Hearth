import { View, Text, Pressable, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    withSequence,
    withRepeat,
    withDelay,
    Easing,
    withSpring,
} from 'react-native-reanimated';
import { useState, useCallback, useEffect, useRef } from 'react';
import { DynamicCreature } from '../../components/creatures/DynamicCreature';
import { RoomBackground } from '../../components/RoomBackground';
import { MessageCircle, Heart, Calendar, Gift, Flame, Send, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, GRADIENTS, createCustomShadow, createCustomGlow } from '../../constants/theme';
import { MessageModal } from '../../components/MessageModal';

const { width, height } = Dimensions.get('window');

// --- FLOATING SPARKLE ---
const FloatingSparkle = ({ delay, x, size }: { delay: number; x: number; size: number }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.15);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(-25, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(0.4, { duration: 2000 }),
                    withTiming(0.1, { duration: 2000 })
                ),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.Text
            style={[
                {
                    position: 'absolute',
                    left: x,
                    top: '35%',
                    fontSize: size,
                    color: COLORS.textMuted,
                },
                animatedStyle,
            ]}
        >
            +
        </Animated.Text>
    );
};

// --- FLOATING HEART PARTICLE ---
const HeartParticle = ({
    emoji,
    size,
    startX,
    delay,
    onComplete,
}: {
    emoji: string;
    size: number;
    startX: number;
    delay: number;
    onComplete: () => void;
}) => {
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.3);

    useEffect(() => {
        // Float upward with easing
        translateY.value = withDelay(
            delay,
            withTiming(-120, { duration: 1800, easing: Easing.out(Easing.cubic) })
        );

        // Gentle horizontal sway
        translateX.value = withDelay(
            delay,
            withRepeat(
                withTiming(startX > 0 ? 15 : -15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
                3,
                true
            )
        );

        // Fade in quickly, hold, then fade out
        opacity.value = withDelay(
            delay,
            withSequence(
                withTiming(1, { duration: 150 }),
                withDelay(1000, withTiming(0, { duration: 650 }))
            )
        );

        // Scale up as it rises
        scale.value = withDelay(
            delay,
            withSpring(1.1, { damping: 12, stiffness: 100 })
        );

        // Cleanup after animation
        const timer = setTimeout(() => onComplete(), 1800 + delay);
        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.Text
            style={[
                {
                    position: 'absolute',
                    fontSize: size,
                    textAlign: 'center',
                },
                animatedStyle,
            ]}
        >
            {emoji}
        </Animated.Text>
    );
};

// --- KAWAII UNIFIED HEADER CARD ---
const HeaderCard = ({
    userName,
    partnerName,
    streak,
}: {
    userName: string;
    partnerName: string;
    streak: number;
}) => {
    // Floating hearts animation
    const heart1 = useSharedValue(0);
    const heart2 = useSharedValue(0);
    const heart3 = useSharedValue(0);

    useEffect(() => {
        // Staggered floating hearts
        heart1.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1, false
        );
        heart2.value = withDelay(400, withRepeat(
            withSequence(
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1, false
        ));
        heart3.value = withDelay(800, withRepeat(
            withSequence(
                withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
            ),
            -1, false
        ));
    }, []);

    const heart1Style = useAnimatedStyle(() => ({
        opacity: 0.4 + heart1.value * 0.6,
        transform: [{ translateY: -heart1.value * 4 }, { scale: 0.8 + heart1.value * 0.2 }],
    }));
    const heart2Style = useAnimatedStyle(() => ({
        opacity: 0.4 + heart2.value * 0.6,
        transform: [{ translateY: -heart2.value * 4 }, { scale: 0.8 + heart2.value * 0.2 }],
    }));
    const heart3Style = useAnimatedStyle(() => ({
        opacity: 0.4 + heart3.value * 0.6,
        transform: [{ translateY: -heart3.value * 4 }, { scale: 0.8 + heart3.value * 0.2 }],
    }));

    // Progress dots (7 days to milestone)
    const progressDots = 7;
    const filledDots = Math.min(streak, progressDots);

    return (
        <Animated.View entering={FadeInDown.duration(400).springify()}>
            <LinearGradient
                colors={['#FFF8F5', '#FFEFE8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderRadius: 18,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    marginHorizontal: 4,
                    ...createCustomShadow('#E8B4A0', 4, 0.1, 10, 4),
                }}
            >
                {/* Compact Partners Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {/* User Avatar */}
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#7C9A92',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: '#fff',
                            }}
                        >
                            <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 17, color: '#fff' }}>
                                {userName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 11, color: COLORS.textPrimary, marginTop: 3 }}>
                            {userName}
                        </Text>
                    </View>

                    {/* Hearts + Streak Inline */}
                    <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <Animated.View style={heart1Style}>
                                <Heart size={12} color="#E88A8A" fill="#E88A8A" />
                            </Animated.View>
                            <Animated.View style={heart2Style}>
                                <Heart size={10} color="#F0A8A8" fill="#F0A8A8" />
                            </Animated.View>
                            <Animated.View style={heart3Style}>
                                <Heart size={12} color="#E88A8A" fill="#E88A8A" />
                            </Animated.View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, backgroundColor: 'rgba(255, 154, 86, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                            <Flame size={12} color="#E8734A" fill="#FF9A56" />
                            <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 11, color: '#E8734A', marginLeft: 4 }}>
                                {streak} days
                            </Text>
                        </View>
                    </View>

                    {/* Partner Avatar */}
                    <View style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#D4A5C9',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: '#fff',
                            }}
                        >
                            <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 17, color: '#fff' }}>
                                {partnerName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 11, color: COLORS.textPrimary, marginTop: 3 }}>
                            {partnerName}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

// --- PREMIUM ACTION CARD ---
const ActionButton = ({
    icon,
    label,
    sublabel,
    variant = 'primary',
    onPress,
    delay = 0,
}: {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    variant?: 'primary' | 'secondary';
    onPress: () => void;
    delay?: number;
}) => {
    const scale = useSharedValue(1);
    const shadowOpacity = useSharedValue(0.2);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const shadowAnimStyle = useAnimatedStyle(() => ({
        shadowOpacity: shadowOpacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 12, stiffness: 300 });
        shadowOpacity.value = withTiming(0.08, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
        shadowOpacity.value = withTiming(0.2, { duration: 200 });
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    // Premium gradient colors
    const gradientColors = variant === 'primary'
        ? ['#F8E8E0', '#FAF0EC', '#FFFFFF'] as const
        : ['#F5F0ED', '#FAF8F6', '#FFFFFF'] as const;

    const iconGradient = variant === 'primary'
        ? ['#D4847C', '#C9706A', '#BE5C56'] as const
        : ['#A89B94', '#9B8E87', '#8E817A'] as const;

    return (
        <Animated.View
            entering={FadeInUp.delay(delay).duration(500).springify()}
            style={[animatedStyle, { flex: 1 }]}
        >
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View
                    style={[
                        {
                            borderRadius: 24,
                            // Multi-layer shadow for depth (cross-platform)
                            ...createCustomShadow(variant === 'primary' ? '#D4847C' : '#8E817A', 8, 0.15, 20, 8),
                        },
                        shadowAnimStyle,
                    ]}
                >
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 24,
                            paddingVertical: 18,
                            paddingHorizontal: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            minHeight: 78,
                            // Subtle border
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                    >
                        {/* Premium Gradient Icon */}
                        <LinearGradient
                            colors={iconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14,
                                // Inner glow (cross-platform)
                                ...createCustomShadow(variant === 'primary' ? '#D4847C' : '#8E817A', 2, 0.3, 6, 3),
                            }}
                        >
                            {icon}
                        </LinearGradient>

                        {/* Text */}
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontFamily: 'DMSans_700Bold',
                                    fontSize: 15,
                                    color: COLORS.textPrimary,
                                    letterSpacing: 0.3,
                                }}
                                numberOfLines={1}
                            >
                                {label}
                            </Text>
                            {sublabel && (
                                <Text
                                    style={{
                                        fontFamily: 'DMSans_500Medium',
                                        fontSize: 12,
                                        color: COLORS.textSecondary,
                                        marginTop: 3,
                                        letterSpacing: 0.1,
                                    }}
                                    numberOfLines={1}
                                >
                                    {sublabel}
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

// --- KAWAII HIERARCHICAL ACTIONS ---
const QuickActionsGrid = ({
    partnerName,
    creatureName,
    onDailyQuestion,
    onMessage,
    onSurprise,
}: {
    partnerName: string;
    creatureName?: string;
    onDailyQuestion: () => void;
    onMessage: () => void;
    onSurprise: () => void;
}) => {
    const scale1 = useSharedValue(1);
    const scale2 = useSharedValue(1);
    const scale3 = useSharedValue(1);
    const scale4 = useSharedValue(1);

    const style1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
    const style2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
    const style3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));
    const style4 = useAnimatedStyle(() => ({ transform: [{ scale: scale4.value }] }));

    const pressIn = (s: any) => { s.value = withSpring(0.97, { damping: 12 }); };
    const pressOut = (s: any) => { s.value = withSpring(1, { damping: 12 }); };

    return (
        <View style={{ gap: 8, paddingHorizontal: 16 }}>
            {/* PRIMARY: Daily Question - Aligned with secondary cards */}
            <View style={{ paddingHorizontal: 20 }}>
                <Animated.View entering={FadeInUp.delay(50).duration(400).springify()} style={style1}>
                    <Pressable
                        onPressIn={() => pressIn(scale1)}
                        onPressOut={() => pressOut(scale1)}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onDailyQuestion(); }}
                    >
                        <LinearGradient
                            colors={['#E8F4F8', '#D4EEF5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 14,
                                paddingVertical: 12,
                                paddingHorizontal: 14,
                                flexDirection: 'row',
                                alignItems: 'center',
                                ...createCustomShadow('#6BA3B2', 4, 0.1, 8, 3),
                            }}
                        >
                            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(42, 101, 116, 0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                <MessageCircle size={18} color="#2A6574" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#2A6574' }}>
                                    Daily Question
                                </Text>
                                <Text style={{ fontFamily: 'DMSans_500Medium', fontSize: 11, color: '#4A8A99' }}>
                                    What made you smile today?
                                </Text>
                            </View>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
            </View>

            {/* SECONDARY: 2 Column - Message & Surprise */}
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20 }}>
                <Animated.View entering={FadeInUp.delay(100).duration(400).springify()} style={[{ flex: 1 }, style2]}>
                    <Pressable
                        onPressIn={() => pressIn(scale2)}
                        onPressOut={() => pressOut(scale2)}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onMessage(); }}
                    >
                        <LinearGradient
                            colors={['#FCE8EC', '#FAD4DC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 14,
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                alignItems: 'center',
                                ...createCustomShadow('#D4847C', 3, 0.08, 6, 2),
                            }}
                        >
                            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(156, 74, 90, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                                <Send size={16} color="#9C4A5A" />
                            </View>
                            <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: '#9C4A5A' }}>
                                Message
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(150).duration(400).springify()} style={[{ flex: 1 }, style3]}>
                    <Pressable
                        onPressIn={() => pressIn(scale3)}
                        onPressOut={() => pressOut(scale3)}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSurprise(); }}
                    >
                        <LinearGradient
                            colors={['#F5EBF8', '#EDD8F2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: 14,
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                alignItems: 'center',
                                ...createCustomShadow('#A878B8', 3, 0.08, 6, 2),
                            }}
                        >
                            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(106, 72, 120, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                                <Gift size={16} color="#6A4878" />
                            </View>
                            <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: '#6A4878' }}>
                                Surprise
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
};

// --- MAIN SCREEN ---
export default function HomeScreen() {

    const { selectedCreature, couple, daysTogether, streak, partnerName, isPartnerOnline, recordTap } = useCreature();
    const { profile } = useAuth();
    const router = useRouter();
    const [showMessageModal, setShowMessageModal] = useState(false);

    const lastPetRef = useRef<string | null>(null);
    const [hearts, setHearts] = useState<{ id: number; x: number; emoji: string; size: number; delay: number }[]>([]);
    const [tapCount, setTapCount] = useState(0);
    const [temporaryMood, setTemporaryMood] = useState<'happy' | null>(null);
    const creatureScale = useSharedValue(1);
    const creatureRotate = useSharedValue(0);
    const creatureGlow = useSharedValue(0.2);
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');

    useEffect(() => {
        const updateTime = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 11) setTimeOfDay('morning');
            else if (hour >= 11 && hour < 17) setTimeOfDay('day');
            else if (hour >= 17 && hour < 22) setTimeOfDay('evening');
            else setTimeOfDay('night');
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Gentle breathing animation for glow
    useEffect(() => {
        creatureGlow.value = withRepeat(
            withSequence(
                withTiming(0.35, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.2, { duration: 2500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    const getMood = () => {
        // Temporary mood override from recent pet
        if (temporaryMood) return temporaryMood;
        if (timeOfDay === 'night') return 'sleepy';
        if (couple?.last_petted_at) {
            const lastPet = new Date(couple.last_petted_at);
            const now = new Date();
            if ((now.getTime() - lastPet.getTime()) / (1000 * 60 * 60) > 24) return 'sad';
        }
        if (isPartnerOnline || streak > 3) return 'happy';
        if (timeOfDay === 'morning') return 'happy';
        return 'neutral';
    };
    const mood = getMood();

    const HEART_EMOJIS = ['💗', '💕', '💖', '✨', '🥰', '💓'];

    const triggerPetAnimation = useCallback(() => {
        const newTap = tapCount + 1;
        setTapCount(newTap);

        // Haptics: Medium for smooth feel
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // PREMIUM SPRING ANIMATION
        // Squish down with spring physics
        creatureScale.value = withSpring(0.88, { damping: 8, stiffness: 500 });

        // Then bounce up higher
        setTimeout(() => {
            creatureScale.value = withSpring(1.08, { damping: 6, stiffness: 300 });
        }, 80);

        // Settle back to normal
        setTimeout(() => {
            creatureScale.value = withSpring(1, { damping: 12, stiffness: 200 });
        }, 200);

        // Subtle soft tilt (not jerky rotation)
        creatureRotate.value = withSpring(-0.03, { damping: 10, stiffness: 200 });
        setTimeout(() => {
            creatureRotate.value = withSpring(0.02, { damping: 10, stiffness: 200 });
        }, 100);
        setTimeout(() => {
            creatureRotate.value = withSpring(0, { damping: 15, stiffness: 150 });
        }, 250);

        // Temporary happy mood for 3 seconds
        setTemporaryMood('happy');
        setTimeout(() => setTemporaryMood(null), 3000);

        // Spawn 3-4 floating heart particles with staggered delays
        const numHearts = Math.floor(Math.random() * 2) + 3;
        const newHearts = Array.from({ length: numHearts }, (_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 80,
            emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
            size: 22 + Math.random() * 12,
            delay: i * 80, // Staggered entrance
        }));
        setHearts(prev => [...prev, ...newHearts]);
    }, [tapCount]);

    const handlePet = () => {
        lastPetRef.current = new Date().toISOString();
        triggerPetAnimation();
        recordTap();
    };

    const animatedCreatureStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: creatureScale.value },
            { rotate: `${creatureRotate.value}rad` }
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: creatureGlow.value,
    }));

    // Creature shadow that responds to bounce
    const shadowStyle = useAnimatedStyle(() => ({
        transform: [{ scaleX: creatureScale.value * 1.2 }, { scaleY: 0.5 }],
        opacity: 0.6 + (1 - creatureScale.value) * 0.4,
    }));

    const userName = profile?.display_name || 'You';
    const creatureName = couple?.creature_name || 'Bunny';

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar style="dark" />

            {/* Subtle gradient overlay */}
            {/* Customizable Room Background */}
            <RoomBackground roomId={couple?.room_theme} />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 24 }}>

                    {/* Header Card */}
                    <View style={{ marginBottom: 16 }}>
                        <HeaderCard
                            userName={userName}
                            partnerName={partnerName}
                            streak={streak}
                        />
                    </View>

                    {/* Creature Area - Positioned at bottom of flex area, on ground level */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20, position: 'relative' }}>
                        {/* Floating Sparkles */}
                        <FloatingSparkle delay={0} x={width * 0.12} size={20} />
                        <FloatingSparkle delay={800} x={width * 0.85} size={18} />
                        <FloatingSparkle delay={400} x={width * 0.25} size={16} />
                        <FloatingSparkle delay={1200} x={width * 0.72} size={22} />

                        {/* Glow Removed for cleaner look */}

                        {/* Premium Floating Hearts */}
                        <View style={{ position: 'absolute', top: '30%', left: 0, right: 0, alignItems: 'center' }}>
                            {hearts.map(h => (
                                <HeartParticle
                                    key={h.id}
                                    emoji={h.emoji}
                                    size={h.size}
                                    startX={h.x}
                                    delay={h.delay || 0}
                                    onComplete={() => setHearts(prev => prev.filter(heart => heart.id !== h.id))}
                                />
                            ))}
                        </View>

                        {/* Creature Shadow */}
                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    bottom: -15,
                                    width: 100,
                                    height: 20,
                                    borderRadius: 50,
                                    backgroundColor: 'rgba(0,0,0,0.08)',
                                },
                                shadowStyle,
                            ]}
                        />

                        {/* Creature */}
                        <Pressable onPress={handlePet}>
                            <Animated.View style={animatedCreatureStyle}>
                                <DynamicCreature
                                    creatureId={selectedCreature}
                                    mood={mood}
                                    scale={1.3}
                                    daysTogether={daysTogether}
                                    accessories={couple?.accessories}
                                    accessoryColors={couple?.accessory_colors}
                                />
                            </Animated.View>
                        </Pressable>
                    </View>

                    {/* Action Buttons - Fixed zone above nav bar */}
                    <View style={{ paddingBottom: 110 }}>
                        <QuickActionsGrid
                            partnerName={partnerName}
                            creatureName={creatureName}
                            onDailyQuestion={() => router.push('/rituals/daily-question')}
                            onMessage={() => setShowMessageModal(true)}
                            onSurprise={() => router.push('/surprise')}
                        />
                    </View>
                </View>
            </SafeAreaView>

            {/* Message Modal */}
            <MessageModal
                visible={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                partnerName={partnerName}
            />
        </View>
    );
}
