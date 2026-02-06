import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useCreature } from '../../context/CreatureContext';
import { DynamicCreature } from '../../components/creatures/DynamicCreature';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, GRADIENTS, RADIUS } from '../../constants/theme';
import { RoomBackground, ROOM_THEMES } from '../../components/RoomBackground';

// --- ACCESSORY OPTIONS ---
const ACCESSORY_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'head', label: 'Head' },
    { id: 'face', label: 'Face' },
    { id: 'neck', label: 'Neck' },
    { id: 'body', label: 'Body' },
];

const ACCESSORY_OPTIONS = [
    // Head
    { id: 'hat_beanie', label: 'Beanie', icon: '🧢', category: 'head', unlockDay: 0 },
    { id: 'crown', label: 'Crown', icon: '👑', category: 'head', unlockDay: 30 },
    { id: 'flower', label: 'Flower', icon: '🌸', category: 'head', unlockDay: 0 },
    { id: 'hearts_headband', label: 'Love Band', icon: '💕', category: 'head', unlockDay: 7 },
    { id: 'top_hat', label: 'Top Hat', icon: '🎩', category: 'head', unlockDay: 14 },

    // Face
    { id: 'glasses', label: 'Glasses', icon: '👓', category: 'face', unlockDay: 0 },
    { id: 'sunglasses', label: 'Shades', icon: '🕶️', category: 'face', unlockDay: 3 },
    { id: 'monocle', label: 'Monocle', icon: '🧐', category: 'face', unlockDay: 21 },

    // Neck
    { id: 'scarf', label: 'Scarf', icon: '🧣', category: 'neck', unlockDay: 0 },
    { id: 'bowtie', label: 'Bow Tie', icon: '🎀', category: 'neck', unlockDay: 5 },
    { id: 'necklace', label: 'Pearl', icon: '📿', category: 'neck', unlockDay: 10 },

    // Body
    { id: 'cape', label: 'Hero Cape', icon: '🦸', category: 'body', unlockDay: 14 },
    { id: 'backpack', label: 'Pack', icon: '🎒', category: 'body', unlockDay: 0 },
];

// --- COLOR OPTIONS ---
const COLOR_OPTIONS = [
    { id: 'rose', color: '#E8B4B8', label: 'Rose' },
    { id: 'sage', color: '#B8D4C8', label: 'Sage' },
    { id: 'lavender', color: '#D4B8E0', label: 'Lavender' },
    { id: 'sky', color: '#B4D8E8', label: 'Sky' },
    { id: 'gold', color: '#ECC68A', label: 'Gold' },
    { id: 'coral', color: '#E0A0A0', label: 'Coral' },
    { id: 'cream', color: '#F5F0ED', label: 'Cream' },
    { id: 'charcoal', color: '#3D3A3A', label: 'Dark' },
    { id: 'mint', color: '#A0E0A0', label: 'Mint' },
    { id: 'peach', color: '#FFDAB9', label: 'Peach' },
];

// --- ACCESSORY ITEM ---
const AccessoryItem = ({
    item,
    isWorn,
    isSelected,
    isLocked,
    onPress,
    delay,
}: {
    item: typeof ACCESSORY_OPTIONS[0];
    isWorn: boolean;
    isSelected: boolean;
    isLocked: boolean;
    onPress: () => void;
    delay: number;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: isLocked ? 0.5 : 1,
    }));

    const handlePress = () => {
        if (isLocked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                "Locked Item",
                `This item unlocks after ${item.unlockDay} days together. Keep your streak going!`,
                [{ text: "Okay" }]
            );
            return;
        }
        scale.value = withSpring(0.95, { damping: 15 });
        setTimeout(() => {
            scale.value = withSpring(1, { damping: 15 });
        }, 100);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Animated.View entering={FadeInUp.delay(delay).duration(300)} style={[animatedStyle, styles.accessoryItemWrapper]}>
            <Pressable onPress={handlePress} style={[
                styles.accessoryItem,
                isWorn && styles.accessoryItemWorn,
                isSelected && styles.accessoryItemSelected,
            ]}>
                <Text style={styles.accessoryIcon}>{item.icon}</Text>
                <Text style={[
                    styles.accessoryLabel,
                    isWorn && styles.accessoryLabelWorn,
                ]}>
                    {item.label}
                </Text>
                {isLocked && (
                    <View style={styles.wornBadge}>
                        <Text style={styles.wornBadgeText}>🔒</Text>
                    </View>
                )}
                {isWorn && !isLocked && (
                    <View style={styles.wornBadge}>
                        <Text style={styles.wornBadgeText}>✓</Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
};

// --- COLOR SWATCH ---
const ColorSwatch = ({
    color,
    isSelected,
    onPress,
}: {
    color: string;
    isSelected: boolean;
    onPress: () => void;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        scale.value = withSpring(0.85, { damping: 12 });
        setTimeout(() => scale.value = withSpring(1, { damping: 12 }), 80);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handlePress}
                style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    isSelected && styles.colorSwatchSelected,
                ]}
            />
        </Animated.View>
    );
};

// --- MAIN SCREEN ---
export default function StudioScreen() {
    const { selectedCreature, couple, saveAccessories, updateRoom, daysTogether } = useCreature();

    const [currentAccessories, setCurrentAccessories] = useState<string[]>([]);
    const [accessoryColors, setAccessoryColors] = useState<Record<string, string>>({});
    const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all'); // Restored category state
    const [studioTab, setStudioTab] = useState<'accessories' | 'decor'>('accessories'); // Tab state
    const [currentRoom, setCurrentRoom] = useState('cozy'); // Room state
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false); // Collapsible panel state

    // Panel Animation
    const panelTranslateY = useSharedValue(0);
    const panelAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: panelTranslateY.value }],
        };
    });

    useEffect(() => {
        panelTranslateY.value = withSpring(isPanelCollapsed ? 300 : 0, { damping: 15 });
    }, [isPanelCollapsed]);



    // Initialize from couple data
    useEffect(() => {
        if (couple) {
            if (couple.accessories) setCurrentAccessories(couple.accessories);
            if (couple.accessory_colors) setAccessoryColors(couple.accessory_colors);
            if (couple.room_theme) setCurrentRoom(couple.room_theme);
        }
    }, [couple]);

    const toggleAccessory = (id: string, unlockDay: number) => {
        // Check Unlock
        if ((daysTogether || 1) < unlockDay) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        setHasChanges(true);
        if (currentAccessories.includes(id)) {
            // If already worn, select it for color picking
            if (selectedAccessory === id) {
                // If already selected, remove it
                setCurrentAccessories(prev => prev.filter(item => item !== id));
                setSelectedAccessory(null);
            } else {
                setSelectedAccessory(id);
            }
        } else {
            // Add accessory and select for coloring
            setCurrentAccessories(prev => [...prev, id]);
            setSelectedAccessory(id);
        }
    };

    const updateColor = (color: string) => {
        if (!selectedAccessory) return;
        setHasChanges(true);
        setAccessoryColors(prev => ({ ...prev, [selectedAccessory]: color }));
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        setIsSaving(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try {
            if (saveAccessories) {
                await saveAccessories(currentAccessories, accessoryColors);
            }
            if (updateRoom) {
                await updateRoom(currentRoom);
            }
            setHasChanges(false);
        } catch (err) {
            console.error('Failed to save:', err);
        }
        setIsSaving(false);
    };

    const creatureName = couple?.creature_name || 'Your Pet';

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Background */}
            <RoomBackground roomId={currentRoom} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
                    <Text style={styles.headerTitle}>Style Studio</Text>
                    <Text style={styles.headerSubtitle}>Dress up {creatureName}</Text>
                </Animated.View>



                {/* Creature Preview */}
                <Pressable
                    style={styles.previewContainer}
                    onPress={() => {
                        Haptics.selectionAsync();
                        setIsPanelCollapsed(!isPanelCollapsed);
                    }}
                >
                    {/* Glow removed for cleaner look */}

                    <Animated.View pointerEvents="none">
                        <DynamicCreature
                            creatureId={selectedCreature}
                            mood="happy"
                            accessories={currentAccessories}
                            accessoryColors={accessoryColors}
                            daysTogether={daysTogether || 1}
                        />
                    </Animated.View>
                </Pressable>
            </SafeAreaView >

            {/* Control Panel */}
            <Animated.View style={[styles.panel, panelAnimatedStyle]}>
                {/* Visual Handle with large touch target */}
                <Pressable
                    onPress={() => setIsPanelCollapsed(!isPanelCollapsed)}
                    style={{
                        width: '100%',
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View style={styles.panelHandle} />
                </Pressable>

                <ScrollView
                    style={styles.panelScroll}
                    contentContainerStyle={styles.panelContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Category Tabs */}
                    {/* Top Tab Switcher */}
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                        <Pressable
                            onPress={() => { setStudioTab('accessories'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: studioTab === 'accessories' ? COLORS.accent : 'transparent' }}
                        >
                            <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 16, color: studioTab === 'accessories' ? COLORS.textPrimary : COLORS.textMuted }}>Accessories</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => { setStudioTab('decor'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: studioTab === 'decor' ? COLORS.accent : 'transparent' }}
                        >
                            <Text style={{ fontFamily: 'DMSans_700Bold', fontSize: 16, color: studioTab === 'decor' ? COLORS.textPrimary : COLORS.textMuted }}>Room Decor</Text>
                        </Pressable>
                    </View>

                    {studioTab === 'accessories' ? (
                        <>
                            {/* Category Tabs */}
                            <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 }}>
                                {ACCESSORY_CATEGORIES.map(cat => (
                                    <Pressable
                                        key={cat.id}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setSelectedCategory(cat.id);
                                        }}
                                        style={{
                                            paddingVertical: 8,
                                            paddingHorizontal: 16,
                                            backgroundColor: selectedCategory === cat.id ? COLORS.accent : 'rgba(0,0,0,0.05)',
                                            borderRadius: 20,
                                        }}
                                    >
                                        <Text style={{
                                            color: selectedCategory === cat.id ? '#fff' : COLORS.textSecondary,
                                            fontFamily: 'DMSans_600SemiBold',
                                            fontSize: 14
                                        }}>
                                            {cat.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* Accessories Grid */}
                            <View style={styles.accessoriesGrid}>
                                {ACCESSORY_OPTIONS
                                    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                                    .map((item, index) => {
                                        const isLocked = false; // Testing Mode: All unlocked
                                        return (
                                            <AccessoryItem
                                                key={item.id}
                                                item={item}
                                                isWorn={currentAccessories.includes(item.id)}
                                                isSelected={selectedAccessory === item.id}
                                                isLocked={isLocked}
                                                onPress={() => toggleAccessory(item.id, item.unlockDay || 0)}
                                                delay={50 * index}
                                            />
                                        );
                                    })}
                            </View>

                            {/* Color Picker (when accessory selected) */}
                            {selectedAccessory && (
                                <Animated.View entering={FadeInDown.duration(200)} style={styles.colorSection}>
                                    <Text style={styles.sectionLabel}>
                                        Color for {ACCESSORY_OPTIONS.find(a => a.id === selectedAccessory)?.label}
                                    </Text>
                                    <View style={styles.colorGrid}>
                                        {COLOR_OPTIONS.map((option) => (
                                            <ColorSwatch
                                                key={option.id}
                                                color={option.color}
                                                isSelected={accessoryColors[selectedAccessory] === option.color}
                                                onPress={() => updateColor(option.color)}
                                            />
                                        ))}
                                    </View>
                                </Animated.View>
                            )}
                        </>
                    ) : (
                        <View style={{ paddingHorizontal: 20, gap: 15 }}>
                            <Text style={styles.sectionHint}>Select a theme for your home</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                                {Object.entries(ROOM_THEMES).map(([id, theme]) => (
                                    <Pressable
                                        key={id}
                                        onPress={() => {
                                            setCurrentRoom(id);
                                            setHasChanges(true);
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }}
                                        style={{
                                            width: '48%',
                                            minHeight: 100,
                                            aspectRatio: 1.5,
                                            borderRadius: 16,
                                            overflow: 'hidden',
                                            borderWidth: 2,
                                            borderColor: currentRoom === id ? COLORS.accent : 'transparent',
                                            position: 'relative',
                                            backgroundColor: theme.colors[0] || '#E8E8E8',
                                        }}
                                    >
                                        <LinearGradient
                                            colors={theme.colors as any}
                                            style={StyleSheet.absoluteFill}
                                            start={{ x: 0.5, y: 0 }}
                                            end={{ x: 0.5, y: 1 }}
                                        />
                                        <View style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            backgroundColor: 'rgba(0,0,0,0.3)', padding: 8
                                        }}>
                                            <Text style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold', fontSize: 13, textAlign: 'center' }}>
                                                {theme.label}
                                            </Text>
                                        </View>
                                        {currentRoom === id && (
                                            <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 10, padding: 2 }}>
                                                <Text style={{ fontSize: 12 }}>✅</Text>
                                            </View>
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Save Button */}
                    {hasChanges && (
                        <Animated.View entering={FadeInUp.duration(200)}>
                            <Pressable
                                onPress={handleSave}
                                disabled={isSaving}
                                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                            >
                                <LinearGradient
                                    colors={GRADIENTS.primary as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.saveButtonGradient}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {isSaving ? 'Saving...' : 'Save Look'}
                                    </Text>
                                </LinearGradient>
                            </Pressable>
                        </Animated.View>
                    )}
                </ScrollView>
            </Animated.View >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 15,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    previewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end', // Aligns creature to the bottom (floor)
        // Ground level is at ~38% from top in room backgrounds
        // This positions bunny feet on the rug/floor area
        marginBottom: 200,
        paddingBottom: 20,
    },
    previewGlow: {
        // Kept for potential future use but not rendered
        position: 'absolute',
        width: 0,
        height: 0,
    },
    panel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        height: '48%',
        ...SHADOWS.lg,
    },
    panelHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.warmGray,
        borderRadius: 2,
        // Removed alignSelf and marginTop as they are handled by wrapper
    },
    panelScroll: {
        flex: 1,
    },
    panelContent: {
        padding: SPACING.lg,
        paddingBottom: 120,
    },
    sectionLabel: {
        fontSize: 13,
        fontFamily: 'DMSans_600SemiBold',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    sectionHint: {
        fontSize: 12,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
    },
    accessoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: SPACING.lg,
    },
    accessoryItemWrapper: {
        width: '48%',
    },
    accessoryItem: {
        backgroundColor: COLORS.beige,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    accessoryItemWorn: {
        backgroundColor: COLORS.accentLight,
        borderColor: COLORS.accent,
    },
    accessoryItemSelected: {
        borderColor: COLORS.lavender,
        ...SHADOWS.lavenderGlow,
    },
    accessoryIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    accessoryLabel: {
        fontSize: 14,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.textSecondary,
        flex: 1,
    },
    accessoryLabelWorn: {
        color: COLORS.textPrimary,
    },
    wornBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.sage,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wornBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    colorSection: {
        marginBottom: SPACING.lg,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: SPACING.sm,
    },
    colorSwatch: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    colorSwatchSelected: {
        borderWidth: 3,
        borderColor: COLORS.textPrimary,
        ...SHADOWS.sm,
    },
    saveButton: {
        marginTop: SPACING.md,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: COLORS.white,
    },
});
