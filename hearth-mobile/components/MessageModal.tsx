import { View, Text, TextInput, Pressable, Modal, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { X, Send, Heart, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, createCustomShadow } from '../constants/theme';

const { width } = Dimensions.get('window');

interface MessageModalProps {
    visible: boolean;
    onClose: () => void;
    partnerName?: string;
}

// Quick reaction options
const QUICK_REACTIONS = [
    { emoji: '❤️', label: 'Love' },
    { emoji: '🥰', label: 'Adore' },
    { emoji: '😘', label: 'Kiss' },
    { emoji: '💕', label: 'Hearts' },
    { emoji: '🤗', label: 'Hug' },
    { emoji: '✨', label: 'Sparkle' },
];

// Quick message templates
const QUICK_MESSAGES = [
    "Thinking of you 💭",
    "Miss you! 💕",
    "You make me smile 😊",
    "Can't wait to see you!",
];

export const MessageModal = ({ visible, onClose, partnerName = 'Partner' }: MessageModalProps) => {
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const buttonScale = useSharedValue(1);
    const heartScale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            setMessage('');
            setSent(false);
        }
    }, [visible]);

    const handleSend = async () => {
        if (!message.trim()) return;

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Animate heart burst
        heartScale.value = withSequence(
            withSpring(1.5, { damping: 8 }),
            withTiming(0, { duration: 300 })
        );

        setSent(true);

        // TODO: Save message to Supabase

        // Close after animation
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const handleQuickReaction = (emoji: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMessage(prev => prev + emoji);
    };

    const handleQuickMessage = (msg: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMessage(msg);
    };

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
        opacity: heartScale.value,
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'flex-end',
                }}
            >
                <Pressable
                    style={{ flex: 1 }}
                    onPress={onClose}
                />

                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ width: '100%' }}
                >
                    <Animated.View
                        entering={SlideInDown.springify().damping(30).stiffness(300)}
                        exiting={SlideOutDown.duration(200)}
                    >
                        <LinearGradient
                            colors={['#FFFFFF', '#FFF0F3']}
                            style={{
                                borderTopLeftRadius: 36,
                                borderTopRightRadius: 36,
                                paddingTop: 16,
                                paddingBottom: Platform.OS === 'ios' ? 40 : 24,
                                paddingHorizontal: 28,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: -4,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            {/* Handle bar */}
                            <View style={{
                                width: 40,
                                height: 4,
                                backgroundColor: COLORS.warmGray,
                                borderRadius: 2,
                                alignSelf: 'center',
                                marginBottom: 20,
                            }} />

                            {!sent ? (
                                <>
                                    {/* Header */}
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 20,
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <Heart size={18} color="#E8B4B8" fill="#E8B4B8" />
                                            <Text style={{
                                                fontFamily: 'Outfit_700Bold',
                                                fontSize: 18,
                                                color: COLORS.textPrimary,
                                            }}>
                                                Send to {partnerName}
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={onClose}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 16,
                                                backgroundColor: COLORS.warmGray,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <X size={16} color={COLORS.textSecondary} />
                                        </Pressable>
                                    </View>

                                    {/* Quick Reactions */}
                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{
                                            fontFamily: 'DMSans_500Medium',
                                            fontSize: 12,
                                            color: COLORS.textMuted,
                                            marginBottom: 10,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}>
                                            Quick React
                                        </Text>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            {QUICK_REACTIONS.map((reaction) => (
                                                <Pressable
                                                    key={reaction.emoji}
                                                    onPress={() => handleQuickReaction(reaction.emoji)}
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 16,
                                                        backgroundColor: 'rgba(232, 180, 184, 0.15)',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 22 }}>{reaction.emoji}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Quick Messages */}
                                    <View style={{ marginBottom: 16 }}>
                                        <Text style={{
                                            fontFamily: 'DMSans_500Medium',
                                            fontSize: 12,
                                            color: COLORS.textMuted,
                                            marginBottom: 10,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}>
                                            Quick Message
                                        </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                            {QUICK_MESSAGES.map((msg) => (
                                                <Pressable
                                                    key={msg}
                                                    onPress={() => handleQuickMessage(msg)}
                                                    style={{
                                                        backgroundColor: 'rgba(107, 163, 178, 0.12)',
                                                        paddingHorizontal: 14,
                                                        paddingVertical: 10,
                                                        borderRadius: 14,
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontFamily: 'DMSans_500Medium',
                                                        fontSize: 13,
                                                        color: '#4A8A99',
                                                    }}>
                                                        {msg}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Message Input */}
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-end',
                                        gap: 12,
                                        marginBottom: 8,
                                    }}>
                                        <TextInput
                                            value={message}
                                            onChangeText={setMessage}
                                            placeholder="Write something sweet..."
                                            placeholderTextColor={COLORS.textMuted}
                                            multiline
                                            maxLength={200}
                                            style={{
                                                flex: 1,
                                                backgroundColor: '#FFFFFF',
                                                borderWidth: 1,
                                                borderColor: 'rgba(232, 180, 184, 0.3)',
                                                borderRadius: 24,
                                                paddingHorizontal: 20,
                                                paddingVertical: 16,
                                                fontFamily: 'DMSans_400Regular',
                                                fontSize: 16,
                                                color: COLORS.textPrimary,
                                                maxHeight: 120,
                                                shadowColor: "#E8B4B8",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 4,
                                                elevation: 2,
                                            }}
                                        />

                                        <Animated.View style={buttonStyle}>
                                            <Pressable
                                                onPress={handleSend}
                                                onPressIn={() => { buttonScale.value = withSpring(0.92); }}
                                                onPressOut={() => { buttonScale.value = withSpring(1); }}
                                                disabled={!message.trim()}
                                            >
                                                <LinearGradient
                                                    colors={message.trim() ? ['#E8B4B8', '#D4A0A4'] : ['#D0D0D0', '#C0C0C0']}
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 24,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        ...createCustomShadow('#E8B4B8', 4, 0.2, 8, 4),
                                                    }}
                                                >
                                                    <Send size={20} color="#FFF" />
                                                </LinearGradient>
                                            </Pressable>
                                        </Animated.View>
                                    </View>
                                </>
                            ) : (
                                /* Sent confirmation */
                                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                                    <Animated.View style={heartStyle}>
                                        <Text style={{ fontSize: 60, position: 'absolute', top: -80 }}>💕</Text>
                                    </Animated.View>

                                    <View style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        backgroundColor: 'rgba(232, 180, 184, 0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 16,
                                    }}>
                                        <Sparkles size={40} color="#E8B4B8" />
                                    </View>

                                    <Text style={{
                                        fontFamily: 'Outfit_700Bold',
                                        fontSize: 22,
                                        color: COLORS.textPrimary,
                                        marginBottom: 8,
                                    }}>
                                        Sent! 💕
                                    </Text>

                                    <Text style={{
                                        fontFamily: 'DMSans_400Regular',
                                        fontSize: 14,
                                        color: COLORS.textSecondary,
                                    }}>
                                        {partnerName} will see your message
                                    </Text>
                                </View>
                            )}
                        </LinearGradient>
                    </Animated.View>
                </KeyboardAvoidingView>
            </Animated.View>
        </Modal>
    );
};

export default MessageModal;
