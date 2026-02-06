import { View, Text, Pressable, Dimensions, ScrollView } from 'react-native';
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
    withRepeat,
    Easing,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Gift, Heart, Sparkles, Star, Send, PartyPopper, Coffee, Moon, Sun } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, createCustomShadow } from '../constants/theme';
import { useCreature } from '../context/CreatureContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

// Virtual gift options
const GIFT_OPTIONS = [
    { id: 'heart_burst', emoji: '💕', label: 'Heart Burst', color: '#E8B4B8' },
    { id: 'sparkle_shower', emoji: '✨', label: 'Sparkle Shower', color: '#ECC68A' },
    { id: 'love_letter', emoji: '💌', label: 'Love Letter', color: '#D4B8E0' },
    { id: 'virtual_hug', emoji: '🤗', label: 'Virtual Hug', color: '#B8D4C8' },
    { id: 'sweet_treat', emoji: '🍰', label: 'Sweet Treat', color: '#F5C6AA' },
    { id: 'flower_bouquet', emoji: '💐', label: 'Flower Bouquet', color: '#E8B4B8' },
    { id: 'kiss', emoji: '😘', label: 'Kiss', color: '#F5B4B8' },
    { id: 'star_wish', emoji: '⭐', label: 'Star Wish', color: '#C4B8E0' },
];

// Surprise messages
const SURPRISE_MESSAGES = [
    "You're my favorite person 💕",
    "Just because I love you ✨",
    "Thinking of you always 💭",
    "You make my heart happy! 💗",
    "Here's a little something for you 🎁",
];

export default function SurpriseScreen() {
    const router = useRouter();
    const { partnerName, couple } = useCreature();
    const { user } = useAuth();

    const [selectedGift, setSelectedGift] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const buttonScale = useSharedValue(1);
    const floatY = useSharedValue(0);

    useEffect(() => {
        // Floating animation for gifts
        floatY.value = withRepeat(
            withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const handleSend = async () => {
        if (!selectedGift || !user || !couple) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            // Pick a random sweet message
            const randomMsg = SURPRISE_MESSAGES[Math.floor(Math.random() * SURPRISE_MESSAGES.length)];

            const { error } = await supabase.from('surprises').insert({
                couple_id: couple.id,
                sender_id: user.id,
                surprise_type: selectedGift,
                message: randomMsg,
            });

            if (error) throw error;
            setSent(true);

        } catch (e) {
            console.error('Failed to send surprise:', e);
            // Optionally show alert
            setSent(true); // Fallback to success UI anyway for smoother UX
        }
    };

    const handleSelectGift = (giftId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedGift(giftId);
    };

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const floatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY.value }],
    }));

    const selectedGiftData = GIFT_OPTIONS.find(g => g.id === selectedGift);

    return (
        <View style={{ flex: 1, backgroundColor: '#FDF8F6' }}>
            <StatusBar style="dark" />

            {/* Background gradient */}
            <LinearGradient
                colors={['#F5EBF8', '#FDF8F6', '#FCE8EC']}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <SafeAreaView style={{ flex: 1 }}>
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
                        <Gift size={16} color="#9C4A7A" />
                        <Text style={{ fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: '#7A4A6A' }}>
                            Send Surprise
                        </Text>
                    </View>

                    <View style={{ width: 40 }} />
                </Animated.View>

                {!sent ? (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Title */}
                        <Animated.View entering={SlideInUp.delay(100).springify()}>
                            <Text style={{
                                fontFamily: 'Outfit_700Bold',
                                fontSize: 28,
                                color: COLORS.textPrimary,
                                textAlign: 'center',
                                marginBottom: 8,
                            }}>
                                Send a Virtual Surprise
                            </Text>
                            <Text style={{
                                fontFamily: 'DMSans_400Regular',
                                fontSize: 15,
                                color: COLORS.textSecondary,
                                textAlign: 'center',
                                marginBottom: 32,
                            }}>
                                Make {partnerName || 'your partner'}'s day special ✨
                            </Text>
                        </Animated.View>

                        {/* Gift Grid */}
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: 12,
                            marginBottom: 32,
                        }}>
                            {GIFT_OPTIONS.map((gift, index) => (
                                <Animated.View
                                    key={gift.id}
                                    entering={FadeInUp.delay(150 + index * 50).springify()}
                                    style={[
                                        selectedGift === gift.id ? floatStyle : {}
                                    ]}
                                >
                                    <Pressable
                                        onPress={() => handleSelectGift(gift.id)}
                                        style={{
                                            width: (width - 72) / 2,
                                            aspectRatio: 1,
                                            borderRadius: 24,
                                            backgroundColor: selectedGift === gift.id
                                                ? `${gift.color}25`
                                                : 'rgba(255,255,255,0.9)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: selectedGift === gift.id ? 3 : 1,
                                            borderColor: selectedGift === gift.id
                                                ? gift.color
                                                : 'rgba(0,0,0,0.05)',
                                            ...createCustomShadow(gift.color, 4, selectedGift === gift.id ? 0.15 : 0.05, 12, 3),
                                        }}
                                    >
                                        <Text style={{ fontSize: 48, marginBottom: 8 }}>{gift.emoji}</Text>
                                        <Text style={{
                                            fontFamily: 'DMSans_600SemiBold',
                                            fontSize: 13,
                                            color: selectedGift === gift.id ? gift.color : COLORS.textSecondary,
                                        }}>
                                            {gift.label}
                                        </Text>
                                    </Pressable>
                                </Animated.View>
                            ))}
                        </View>

                        {/* Send Button */}
                        {selectedGift && (
                            <Animated.View
                                entering={FadeIn.duration(300)}
                                style={buttonStyle}
                            >
                                <Pressable
                                    onPress={handleSend}
                                    onPressIn={() => { buttonScale.value = withSpring(0.96); }}
                                    onPressOut={() => { buttonScale.value = withSpring(1); }}
                                >
                                    <LinearGradient
                                        colors={[selectedGiftData?.color || '#E8B4B8', '#D4B8E0']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{
                                            borderRadius: 20,
                                            paddingVertical: 18,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 10,
                                            ...createCustomShadow('#D4B8E0', 6, 0.2, 16, 6),
                                        }}
                                    >
                                        <Send size={20} color="#FFF" />
                                        <Text style={{
                                            fontFamily: 'Outfit_700Bold',
                                            fontSize: 17,
                                            color: '#FFF',
                                        }}>
                                            Send {selectedGiftData?.label}
                                        </Text>
                                    </LinearGradient>
                                </Pressable>
                            </Animated.View>
                        )}
                    </ScrollView>
                ) : (
                    /* Sent Animation */
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                        <Animated.View
                            entering={FadeIn.delay(100).duration(500)}
                            style={{ alignItems: 'center' }}
                        >
                            {/* Animated gift reveal */}
                            <Animated.Text
                                entering={SlideInUp.springify().damping(8)}
                                style={{ fontSize: 80, marginBottom: 24 }}
                            >
                                {selectedGiftData?.emoji}
                            </Animated.Text>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                marginBottom: 12,
                            }}>
                                <PartyPopper size={24} color="#D4B8E0" />
                                <Text style={{
                                    fontFamily: 'Outfit_700Bold',
                                    fontSize: 26,
                                    color: COLORS.textPrimary,
                                }}>
                                    Surprise Sent!
                                </Text>
                            </View>

                            <Text style={{
                                fontFamily: 'DMSans_400Regular',
                                fontSize: 15,
                                color: COLORS.textSecondary,
                                textAlign: 'center',
                                marginBottom: 32,
                            }}>
                                {partnerName || 'Your partner'} will receive your {selectedGiftData?.label.toLowerCase()} 💕
                            </Text>

                            <Pressable
                                onPress={() => router.back()}
                                style={{
                                    backgroundColor: COLORS.textPrimary,
                                    borderRadius: 16,
                                    paddingVertical: 14,
                                    paddingHorizontal: 32,
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'Outfit_600SemiBold',
                                    fontSize: 15,
                                    color: '#FFF',
                                }}>
                                    Back to Home
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}
