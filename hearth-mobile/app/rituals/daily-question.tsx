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
import { X, Send, Heart, Sparkles, CheckCircle2, Clock, Bell } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, createCustomShadow } from '../../constants/theme';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { getQuestionForDay, getQuestionNumber } from '../../constants/questions';

const { width, height } = Dimensions.get('window');

interface RitualData {
    id: string;
    partner1_response: { text: string; user_id: string; timestamp: string } | null;
    partner2_response: { text: string; user_id: string; timestamp: string } | null;
    completed_at: string | null;
}

export default function DailyQuestionScreen() {
    const router = useRouter();
    const { couple, partnerName, daysTogether, userName } = useCreature();
    const { user } = useAuth();

    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [ritual, setRitual] = useState<RitualData | null>(null);

    // Derived states
    const question = getQuestionForDay(daysTogether || 1);
    const questionNumber = getQuestionNumber(daysTogether || 1);

    const isPartner1 = couple?.partner1_id === user?.id;
    const myResponse = isPartner1 ? ritual?.partner1_response : ritual?.partner2_response;
    const partnerResponse = isPartner1 ? ritual?.partner2_response : ritual?.partner1_response;

    const hasSubmitted = !!myResponse;
    const partnerHasSubmitted = !!partnerResponse;
    const bothAnswered = hasSubmitted && partnerHasSubmitted;

    const [showAnswers, setShowAnswers] = useState(false);

    const buttonScale = useSharedValue(1);
    const cardGlow = useSharedValue(0);

    useEffect(() => {
        cardGlow.value = withSequence(
            withTiming(0.3, { duration: 1500 }),
            withTiming(0.15, { duration: 1500 })
        );
    }, []);

    // Load/Create today's ritual
    useEffect(() => {
        if (!couple?.id) return;
        loadOrCreateRitual();
    }, [couple?.id, daysTogether]);

    const loadOrCreateRitual = async () => {
        if (!couple?.id) return;

        setIsLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Try to load existing ritual for today
            const { data: existing, error: loadError } = await supabase
                .from('daily_rituals')
                .select('id, partner1_response, partner2_response, completed_at')
                .eq('couple_id', couple.id)
                .eq('date', today)
                .eq('ritual_type', 'daily_question')
                .maybeSingle();

            if (loadError) throw loadError;

            if (existing) {
                setRitual(existing);
            } else {
                // Create new ritual for today
                const { data: newRitual, error: createError } = await supabase
                    .from('daily_rituals')
                    .insert({
                        couple_id: couple.id,
                        date: today,
                        ritual_type: 'daily_question',
                        prompt: question
                    })
                    .select('id, partner1_response, partner2_response, completed_at')
                    .single();

                if (createError) throw createError;
                setRitual(newRitual);
            }
        } catch (err) {
            console.error('Error loading ritual:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Real-time subscription for partner's answer
    useEffect(() => {
        if (!ritual?.id) return;

        const subscription = supabase
            .channel(`ritual-${ritual.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'daily_rituals',
                    filter: `id=eq.${ritual.id}`
                },
                (payload) => {
                    console.log('Real-time update:', payload.new);
                    setRitual(payload.new as RitualData);

                    // If partner just answered, show notification-style feedback
                    const newData = payload.new as RitualData;
                    const newPartnerResponse = isPartner1 ? newData.partner2_response : newData.partner1_response;
                    if (newPartnerResponse && !partnerResponse) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [ritual?.id, isPartner1, partnerResponse]);

    const handleSubmit = async () => {
        if (!answer.trim() || !ritual?.id || !user?.id) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsSaving(true);

        try {
            const responseData = {
                text: answer.trim(),
                user_id: user.id,
                timestamp: new Date().toISOString()
            };

            const updateField = isPartner1 ? 'partner1_response' : 'partner2_response';

            // Check if partner already answered
            const partnerAlreadyAnswered = isPartner1 ? ritual.partner2_response : ritual.partner1_response;

            const updateData: any = {
                [updateField]: responseData
            };

            // If both answered, mark as completed
            if (partnerAlreadyAnswered) {
                updateData.completed_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('daily_rituals')
                .update(updateData)
                .eq('id', ritual.id);

            if (error) throw error;

            // Update local state
            setRitual(prev => prev ? {
                ...prev,
                [updateField]: responseData,
                completed_at: partnerAlreadyAnswered ? new Date().toISOString() : null
            } : null);

            // Send notification to partner (via edge function or local trigger)
            // This would be handled by a Supabase Edge Function in production
            console.log(`[NOTIFICATION] Partner answered daily question!`);

        } catch (err) {
            console.error('Error saving answer:', err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReveal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowAnswers(true);
    };

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const cardGlowStyle = useAnimatedStyle(() => ({
        opacity: cardGlow.value,
    }));

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#FDF8F6', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'DMSans_400Regular', color: COLORS.textMuted }}>Loading today's question...</Text>
            </View>
        );
    }

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

                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Sparkles size={16} color="#6BA3B2" />
                                <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: '#4A8A99' }}>
                                    Day {daysTogether || 1}
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 11, color: COLORS.textMuted }}>
                                Question {questionNumber} of 100
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
                                        fontSize: 22,
                                        color: '#2A6574',
                                        textAlign: 'center',
                                        lineHeight: 30,
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
                        {!hasSubmitted ? (
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
                                        disabled={!answer.trim() || isSaving}
                                        style={{ marginTop: 16 }}
                                    >
                                        <LinearGradient
                                            colors={answer.trim() && !isSaving ? ['#6BA3B2', '#4A8A99'] : ['#D0D0D0', '#C0C0C0']}
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
                                                {isSaving ? 'Saving...' : 'Share Answer'}
                                            </Text>
                                        </LinearGradient>
                                    </Pressable>
                                </Animated.View>
                            </Animated.View>
                        ) : !showAnswers ? (
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

                                {bothAnswered ? (
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
                                            width: 60,
                                            height: 60,
                                            borderRadius: 30,
                                            backgroundColor: 'rgba(232, 180, 184, 0.15)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 16,
                                        }}>
                                            <Clock size={28} color="#E8B4B8" />
                                        </View>
                                        <Text style={{
                                            fontFamily: 'Outfit_600SemiBold',
                                            fontSize: 16,
                                            color: COLORS.textPrimary,
                                            marginBottom: 4,
                                        }}>
                                            Waiting for {partnerName || 'partner'}...
                                        </Text>
                                        <Text style={{
                                            fontFamily: 'DMSans_400Regular',
                                            fontSize: 13,
                                            color: COLORS.textMuted,
                                            textAlign: 'center',
                                        }}>
                                            You'll both see answers once they respond
                                        </Text>

                                        {/* Notification hint */}
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 6,
                                            marginTop: 20,
                                            backgroundColor: 'rgba(107, 163, 178, 0.1)',
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            borderRadius: 16,
                                        }}>
                                            <Bell size={14} color="#6BA3B2" />
                                            <Text style={{
                                                fontFamily: 'DMSans_400Regular',
                                                fontSize: 12,
                                                color: '#4A8A99',
                                            }}>
                                                You'll be notified when they answer
                                            </Text>
                                        </View>
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
                                        {userName || 'You'} said
                                    </Text>
                                    <Text style={{
                                        fontFamily: 'DMSans_400Regular',
                                        fontSize: 16,
                                        color: COLORS.textPrimary,
                                        lineHeight: 24,
                                    }}>
                                        {myResponse?.text}
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
                                        {partnerResponse?.text}
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
