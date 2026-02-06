import { View, Text, TextInput, Pressable, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    SlideInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, Heart, Sparkles, CheckCircle2, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, GRADIENTS, createCustomShadow } from '../../constants/theme';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

// Daily question pool - rotate based on day
const DAILY_QUESTIONS = [
    "What made you smile today?",
    "What's one thing you're grateful for about us?",
    "If we could go anywhere tomorrow, where would it be?",
    "What's your favorite memory of us this week?",
    "What song reminds you of me?",
    "What's something new you'd like to try together?",
    "What moment today made you think of me?",
    "If you could relive one of our dates, which would it be?",
    "What's one thing I do that makes you feel loved?",
    "What dreamy adventure should we plan next?",
    "What's the funniest thing that happened today?",
    "What's a small thing I could do to make your day better?",
    "What's one goal we should work towards together?",
    "What made you fall in love with me?",
    "What's something you've never told me but want to?",
];

// Get today's question based on date
const getTodaysQuestion = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
};

export default function DailyQuestionScreen() {
    const router = useRouter();
    const { couple, partnerName } = useCreature();
    const { profile, user } = useAuth();

    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [partnerAnswered, setPartnerAnswered] = useState(false);
    const [partnerAnswer, setPartnerAnswer] = useState('');
    const [bothRevealed, setBothRevealed] = useState(false);

    const question = getTodaysQuestion();
    const buttonScale = useSharedValue(1);
    const cardGlow = useSharedValue(0);

    useEffect(() => {
        // Animate card glow
        cardGlow.value = withSequence(
            withTiming(0.3, { duration: 1500 }),
            withTiming(0.15, { duration: 1500 })
        );
    }, []);

    const handleSubmit = async () => {
        if (!answer.trim()) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSubmitted(true);

        // TODO: Save to Supabase daily_rituals table
        // For now, simulate partner response for demo
        setTimeout(() => {
            setPartnerAnswered(true);
            setPartnerAnswer("I thought about our morning coffee together ☕💕");
        }, 2000);
    };

    const handleReveal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setBothRevealed(true);
    };

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const cardGlowStyle = useAnimatedStyle(() => ({
        opacity: cardGlow.value,
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#FDF8F6' }}>
            <StatusBar style="dark" />

            {/* Background gradient */}
            <LinearGradient
                colors={['#E8F4F8', '#FDF8F6', '#FCE8EC']}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.duration(400)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                        }}
                    >
                        <Pressable
                            onPress={() => router.back()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <X size={20} color={COLORS.textSecondary} />
                        </Pressable>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Sparkles size={16} color="#6BA3B2" />
                            <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: '#4A8A99' }}>
                                Daily Question
                            </Text>
                        </View>

                        <View style={{ width: 40 }} />
                    </Animated.View>

                    {/* Main Content */}
                    <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>

                        {/* Question Card */}
                        <Animated.View entering={SlideInUp.delay(100).springify()}>
                            <View style={{ position: 'relative' }}>
                                {/* Glow effect */}
                                <Animated.View
                                    style={[
                                        {
                                            position: 'absolute',
                                            top: -10,
                                            left: -10,
                                            right: -10,
                                            bottom: -10,
                                            borderRadius: 32,
                                            backgroundColor: '#6BA3B2',
                                        },
                                        cardGlowStyle
                                    ]}
                                />

                                <LinearGradient
                                    colors={['#FFFFFF', '#F8FCFD']}
                                    style={{
                                        borderRadius: 24,
                                        padding: 28,
                                        ...createCustomShadow('#6BA3B2', 8, 0.12, 20, 8),
                                    }}
                                >
                                    <Text style={{
                                        fontFamily: 'Outfit_700Bold',
                                        fontSize: 24,
                                        color: '#2A6574',
                                        textAlign: 'center',
                                        lineHeight: 32,
                                        marginBottom: 8,
                                    }}>
                                        {question}
                                    </Text>

                                    <Text style={{
                                        fontFamily: 'DMSans_400Regular',
                                        fontSize: 13,
                                        color: COLORS.textMuted,
                                        textAlign: 'center',
                                    }}>
                                        Share your thoughts with {partnerName || 'your partner'}
                                    </Text>
                                </LinearGradient>
                            </View>
                        </Animated.View>

                        {/* Answer Section */}
                        {!submitted ? (
                            <Animated.View
                                entering={FadeInUp.delay(300).duration(400)}
                                style={{ marginTop: 24 }}
                            >
                                <TextInput
                                    value={answer}
                                    onChangeText={setAnswer}
                                    placeholder="Type your answer..."
                                    placeholderTextColor={COLORS.textMuted}
                                    multiline
                                    maxLength={300}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        borderRadius: 20,
                                        padding: 20,
                                        paddingTop: 20,
                                        minHeight: 120,
                                        fontFamily: 'DMSans_400Regular',
                                        fontSize: 16,
                                        color: COLORS.textPrimary,
                                        textAlignVertical: 'top',
                                        ...createCustomShadow('#000', 2, 0.05, 8, 2),
                                    }}
                                />

                                <Text style={{
                                    fontFamily: 'DMSans_400Regular',
                                    fontSize: 12,
                                    color: COLORS.textMuted,
                                    textAlign: 'right',
                                    marginTop: 8,
                                    marginRight: 4,
                                }}>
                                    {answer.length}/300
                                </Text>

                                {/* Submit Button */}
                                <Animated.View style={buttonStyle}>
                                    <Pressable
                                        onPress={handleSubmit}
                                        onPressIn={() => { buttonScale.value = withSpring(0.96); }}
                                        onPressOut={() => { buttonScale.value = withSpring(1); }}
                                        disabled={!answer.trim()}
                                        style={{ marginTop: 16 }}
                                    >
                                        <LinearGradient
                                            colors={answer.trim() ? ['#6BA3B2', '#4A8A99'] : ['#D0D0D0', '#C0C0C0']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{
                                                borderRadius: 16,
                                                paddingVertical: 16,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 8,
                                                ...createCustomShadow('#6BA3B2', 4, 0.15, 12, 4),
                                            }}
                                        >
                                            <Send size={18} color="#FFF" />
                                            <Text style={{
                                                fontFamily: 'Outfit_600SemiBold',
                                                fontSize: 16,
                                                color: '#FFF',
                                            }}>
                                                Share Answer
                                            </Text>
                                        </LinearGradient>
                                    </Pressable>
                                </Animated.View>
                            </Animated.View>
                        ) : !bothRevealed ? (
                            /* Waiting for partner / Ready to reveal */
                            <Animated.View
                                entering={FadeIn.duration(500)}
                                style={{ marginTop: 32, alignItems: 'center' }}
                            >
                                {/* Your answer confirmed */}
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                    backgroundColor: 'rgba(107, 163, 178, 0.15)',
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    marginBottom: 24,
                                }}>
                                    <CheckCircle2 size={16} color="#4A8A99" />
                                    <Text style={{ fontFamily: 'DMSans_500Medium', fontSize: 14, color: '#4A8A99' }}>
                                        Your answer saved!
                                    </Text>
                                </View>

                                {partnerAnswered ? (
                                    /* Both answered - reveal button */
                                    <Pressable
                                        onPress={handleReveal}
                                        onPressIn={() => { buttonScale.value = withSpring(0.96); }}
                                        onPressOut={() => { buttonScale.value = withSpring(1); }}
                                    >
                                        <Animated.View style={buttonStyle}>
                                            <LinearGradient
                                                colors={['#E8B4B8', '#D4B8E0']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={{
                                                    borderRadius: 20,
                                                    paddingVertical: 18,
                                                    paddingHorizontal: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    ...createCustomShadow('#E8B4B8', 6, 0.2, 16, 6),
                                                }}
                                            >
                                                <Heart size={20} color="#FFF" fill="#FFF" />
                                                <Text style={{
                                                    fontFamily: 'Outfit_700Bold',
                                                    fontSize: 18,
                                                    color: '#FFF',
                                                }}>
                                                    Reveal Answers ✨
                                                </Text>
                                            </LinearGradient>
                                        </Animated.View>
                                    </Pressable>
                                ) : (
                                    /* Waiting for partner */
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginBottom: 8,
                                        }}>
                                            <Clock size={16} color={COLORS.textMuted} />
                                            <Text style={{
                                                fontFamily: 'DMSans_500Medium',
                                                fontSize: 14,
                                                color: COLORS.textSecondary,
                                            }}>
                                                Waiting for {partnerName || 'partner'}...
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontFamily: 'DMSans_400Regular',
                                            fontSize: 12,
                                            color: COLORS.textMuted,
                                        }}>
                                            You'll both see answers once they respond
                                        </Text>
                                    </View>
                                )}
                            </Animated.View>
                        ) : (
                            /* Both revealed - show answers */
                            <Animated.View
                                entering={FadeInUp.duration(600)}
                                style={{ marginTop: 24, gap: 16 }}
                            >
                                {/* Your answer */}
                                <View style={{
                                    backgroundColor: 'rgba(107, 163, 178, 0.1)',
                                    borderRadius: 20,
                                    padding: 20,
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#6BA3B2',
                                }}>
                                    <Text style={{
                                        fontFamily: 'DMSans_600SemiBold',
                                        fontSize: 12,
                                        color: '#4A8A99',
                                        marginBottom: 8,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}>
                                        You said
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'DMSans_400Regular',
                                        fontSize: 16,
                                        color: COLORS.textPrimary,
                                        lineHeight: 24,
                                    }}>
                                        {answer}
                                    </Text>
                                </View>

                                {/* Partner's answer */}
                                <View style={{
                                    backgroundColor: 'rgba(232, 180, 184, 0.15)',
                                    borderRadius: 20,
                                    padding: 20,
                                    borderLeftWidth: 4,
                                    borderLeftColor: '#E8B4B8',
                                }}>
                                    <Text style={{
                                        fontFamily: 'DMSans_600SemiBold',
                                        fontSize: 12,
                                        color: '#C77D7D',
                                        marginBottom: 8,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}>
                                        {partnerName || 'Partner'} said
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'DMSans_400Regular',
                                        fontSize: 16,
                                        color: COLORS.textPrimary,
                                        lineHeight: 24,
                                    }}>
                                        {partnerAnswer}
                                    </Text>
                                </View>

                                {/* Done button */}
                                <Pressable
                                    onPress={() => router.back()}
                                    style={{ marginTop: 8 }}
                                >
                                    <View style={{
                                        backgroundColor: COLORS.textPrimary,
                                        borderRadius: 16,
                                        paddingVertical: 14,
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{
                                            fontFamily: 'Outfit_600SemiBold',
                                            fontSize: 15,
                                            color: '#FFF',
                                        }}>
                                            Done 💕
                                        </Text>
                                    </View>
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
