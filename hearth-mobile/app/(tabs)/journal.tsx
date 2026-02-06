import { View, Text, ScrollView, RefreshControl, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect, useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useCreature } from '../../context/CreatureContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, GRADIENTS, RADIUS } from '../../constants/theme';

// Types
type MemoryType = 'Daily' | 'Growth' | 'Milestone' | 'Decision';

interface Memory {
    id: string;
    created_at: string;
    type: MemoryType;
    title: string;
    description: string;
    image_emoji?: string;
    color_theme: 'mint' | 'coral' | 'lavender';
    reactions?: Record<string, number>;
}

// --- MEMORY CARD ---
const MemoryCard = ({ memory, index }: { memory: Memory; index: number }) => {
    const [localReactions, setLocalReactions] = useState(memory.reactions || {});
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleReaction = (emoji: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scale.value = withSpring(0.98, { damping: 15 });
        setTimeout(() => scale.value = withSpring(1, { damping: 15 }), 100);
        setLocalReactions((prev: Record<string, number>) => ({
            ...prev,
            [emoji]: (prev[emoji] || 0) + 1,
        }));
    };

    const getTypeStyle = () => {
        switch (memory.type) {
            case 'Growth':
                return { bg: COLORS.sageLight, text: COLORS.sageDark, accent: COLORS.sage };
            case 'Milestone':
                return { bg: COLORS.accentLight, text: COLORS.accentDark, accent: COLORS.accent };
            case 'Decision':
                return { bg: COLORS.lavenderLight, text: COLORS.lavenderDark, accent: COLORS.lavender };
            default:
                return { bg: COLORS.beige, text: COLORS.textSecondary, accent: COLORS.warmGray };
        }
    };

    const typeStyle = getTypeStyle();

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 60).duration(350)}
            style={[animatedStyle, styles.memoryCard]}
        >
            {/* Left Accent */}
            <View style={[styles.cardAccent, { backgroundColor: typeStyle.accent }]} />

            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={[styles.dateBadge, { backgroundColor: COLORS.accentLight }]}>
                    <Text style={[styles.dateText, { color: COLORS.accent }]}>
                        {new Date(memory.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                    <Text style={[styles.typeText, { color: typeStyle.text }]}>
                        {memory.type}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <Text style={styles.cardTitle}>{memory.title}</Text>
            <Text style={styles.cardDescription}>{memory.description}</Text>

            {/* Emoji Image */}
            {memory.image_emoji && (
                <View style={[styles.emojiContainer, { backgroundColor: typeStyle.bg }]}>
                    <Text style={styles.emoji}>{memory.image_emoji}</Text>
                </View>
            )}

            {/* Reactions */}
            <View style={styles.reactionBar}>
                {['❤️', '😊', '🔥', '🎉'].map(emoji => (
                    <Pressable
                        key={emoji}
                        onPress={() => handleReaction(emoji)}
                        style={[
                            styles.reactionButton,
                            localReactions[emoji] > 0 && styles.reactionButtonActive,
                        ]}
                    >
                        <Text style={styles.reactionEmoji}>{emoji}</Text>
                        {localReactions[emoji] > 0 && (
                            <Animated.Text entering={FadeInUp.duration(150)} style={styles.reactionCount}>
                                {localReactions[emoji]}
                            </Animated.Text>
                        )}
                    </Pressable>
                ))}
            </View>
        </Animated.View>
    );
};

// --- EMPTY STATE ---
const EmptyState = () => (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.emptyState}>
        <View style={styles.emptyIcon}>
            <Text style={{ fontSize: 48 }}>📝</Text>
        </View>
        <Text style={styles.emptyTitle}>No memories yet</Text>
        <Text style={styles.emptyText}>
            Check in with your partner to start creating beautiful memories together!
        </Text>
    </Animated.View>
);

// --- MAIN SCREEN ---
export default function JournalScreen() {
    const { couple, daysTogether } = useCreature();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    const fetchMemories = async () => {
        if (!couple?.id) return;
        try {
            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .eq('couple_id', couple.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMemories(data as Memory[]);
        } catch (error) {
            console.log('Error fetching memories:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMemories();
        setRefreshing(false);
    }, [couple?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchMemories();
        }, [couple?.id])
    );

    useEffect(() => {
        if (!couple?.id) return;

        const subscription = supabase
            .channel(`memories_${couple.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'memories',
                    filter: `couple_id=eq.${couple.id}`,
                },
                (payload) => {
                    setMemories(prev => [payload.new as Memory, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [couple?.id]);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Background */}
            <LinearGradient
                colors={GRADIENTS.warmBg as any}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.accent}
                    />
                }
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
                    <Animated.Text entering={FadeInDown.duration(400)} style={styles.headerTitle}>
                        Our Memories
                    </Animated.Text>
                    <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>
                            {daysTogether} days together ✨
                        </Text>
                    </Animated.View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {memories.length === 0 ? (
                        <EmptyState />
                    ) : (
                        memories.map((memory, index) => (
                            <MemoryCard key={memory.id} memory={memory} index={index} />
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    headerBadge: {
        backgroundColor: COLORS.accentLight,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    headerBadgeText: {
        fontSize: 13,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.accent,
    },
    content: {
        paddingHorizontal: SPACING.lg,
    },
    memoryCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        ...SHADOWS.md,
    },
    cardAccent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: RADIUS.lg,
        borderBottomLeftRadius: RADIUS.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    dateBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'DMSans_600SemiBold',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    typeText: {
        fontSize: 10,
        fontFamily: 'DMSans_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    cardTitle: {
        fontSize: 17,
        fontFamily: 'Outfit_600SemiBold',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.textSecondary,
        lineHeight: 20,
        marginBottom: SPACING.sm,
    },
    emojiContainer: {
        height: 100,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    emoji: {
        fontSize: 44,
    },
    reactionBar: {
        flexDirection: 'row',
        gap: 8,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.warmGray,
    },
    reactionButton: {
        backgroundColor: COLORS.beige,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reactionButtonActive: {
        backgroundColor: COLORS.accentLight,
    },
    reactionEmoji: {
        fontSize: 16,
    },
    reactionCount: {
        fontSize: 11,
        fontFamily: 'DMSans_600SemiBold',
        color: COLORS.textSecondary,
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.beige,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'Outfit_600SemiBold',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.textSecondary,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 20,
    },
});
