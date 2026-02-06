import { View, Text, ScrollView, Pressable, Dimensions, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Smartphone, ExternalLink, Info } from 'lucide-react-native';
import { useCreature } from '../../context/CreatureContext';
import { CREATURES } from '../../constants/creatures';
import { COLORS, SHADOWS, SPACING, RADIUS, GRADIENTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const WidgetPreview = ({
    title,
    size = 'small',
    children
}: {
    title: string;
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
}) => {
    const widthMap = { small: (width - 72) / 2, medium: width - 48, large: width - 48 };

    return (
        <View style={{ marginBottom: 20, width: widthMap[size] }}>
            <Text style={styles.widgetLabel}>{title}</Text>
            <View style={styles.widgetShadow}>
                {children}
            </View>
        </View>
    );
};

export default function WidgetShowcase() {
    const router = useRouter();
    const { selectedCreature, streak, partnerName, isPartnerOnline, couple } = useCreature();
    const creature = CREATURES[selectedCreature];

    const displayStreak = streak || 0;
    const displayPartnerName = partnerName || 'Partner';
    const partnerStatus = isPartnerOnline ? 'Online' : 'Offline';
    const creatureName = couple?.creature_name || creature?.name || 'Companion';

    const handleAddWidget = () => {
        if (Platform.OS === 'android') {
            Linking.openSettings();
        } else {
            // iOS - show instructions
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <LinearGradient
                colors={GRADIENTS.warmBg as any}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={20} color={COLORS.textPrimary} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Smartphone size={18} color={COLORS.textSecondary} />
                        <Text style={styles.headerTitle}>Home Screen Widgets</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </Animated.View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Instructions Card */}
                    <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.instructionCard}>
                        <View style={styles.instructionIcon}>
                            <Info size={20} color={COLORS.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.instructionTitle}>
                                {Platform.OS === 'ios' ? 'Add iOS Widget' : 'Add Android Widget'}
                            </Text>
                            <Text style={styles.instructionText}>
                                {Platform.OS === 'ios'
                                    ? 'Long press your home screen → Tap + → Search "Hearth"'
                                    : 'Long press home screen → Widgets → Find "Hearth"'
                                }
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Widget Previews */}
                    <Text style={styles.sectionLabel}>Available Widgets</Text>

                    {/* Small Widgets Row */}
                    <View style={styles.widgetRow}>
                        {/* Day Streak Widget */}
                        <WidgetPreview title="Day Streak" size="small">
                            <View style={styles.smallWidget}>
                                <View style={styles.creatureCircle}>
                                    <Text style={{ fontSize: 24 }}>{creature?.emoji || '🐻'}</Text>
                                </View>
                                <Text style={styles.streakNumber}>{displayStreak}</Text>
                                <Text style={styles.streakLabel}>STREAK</Text>
                            </View>
                        </WidgetPreview>

                        {/* Partner Status Widget */}
                        <WidgetPreview title="Partner Status" size="small">
                            <View style={styles.smallWidget}>
                                <View style={[
                                    styles.statusCircle,
                                    { borderColor: isPartnerOnline ? '#4CAF50' : COLORS.warmGray }
                                ]}>
                                    <Text style={styles.partnerInitial}>
                                        {displayPartnerName.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <Text style={styles.partnerNameWidget}>{displayPartnerName}</Text>
                                <Text style={[
                                    styles.statusLabel,
                                    { color: isPartnerOnline ? '#4CAF50' : COLORS.textMuted }
                                ]}>
                                    {partnerStatus.toUpperCase()}
                                </Text>
                            </View>
                        </WidgetPreview>
                    </View>

                    {/* Medium Widget */}
                    <WidgetPreview title="Quick Check-in" size="medium">
                        <View style={styles.mediumWidget}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mediumTitle}>Morning Check-in</Text>
                                <View style={styles.checkInRow}>
                                    <View style={styles.checkInPill}>
                                        <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                                        <Text style={styles.checkInText}>You</Text>
                                    </View>
                                    <View style={[styles.checkInPill, styles.checkInPillPending]}>
                                        <View style={[styles.statusDot, { backgroundColor: COLORS.warmGray }]} />
                                        <Text style={[styles.checkInText, { color: COLORS.textMuted }]}>
                                            {displayPartnerName}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.mediumCreature}>
                                <Text style={{ fontSize: 36 }}>{creature?.emoji || '🐻'}</Text>
                            </View>
                        </View>
                    </WidgetPreview>

                    {/* Lock Screen Widget */}
                    <WidgetPreview title="Lock Screen" size="medium">
                        <LinearGradient
                            colors={['rgba(45,45,58,0.95)', 'rgba(45,45,58,0.8)']}
                            style={styles.lockScreenWidget}
                        >
                            <View style={styles.lockScreenCreature}>
                                <Text style={{ fontSize: 24 }}>{creature?.emoji || '🐻'}</Text>
                            </View>
                            <View>
                                <Text style={styles.lockScreenLabel}>HEARTH STREAK</Text>
                                <Text style={styles.lockScreenValue}>{displayStreak} days 🔥</Text>
                            </View>
                        </LinearGradient>
                    </WidgetPreview>

                    {/* Creature Mood Widget */}
                    <WidgetPreview title="Companion Mood" size="medium">
                        <LinearGradient
                            colors={['#FFF9F0', '#FFF5EC']}
                            style={styles.moodWidget}
                        >
                            <View style={styles.moodCreatureContainer}>
                                <Text style={{ fontSize: 48 }}>{creature?.emoji || '🐻'}</Text>
                            </View>
                            <View style={styles.moodInfo}>
                                <Text style={styles.moodName}>{creatureName}</Text>
                                <Text style={styles.moodStatus}>Feeling loved 💕</Text>
                                <View style={styles.moodBadge}>
                                    <Text style={styles.moodBadgeText}>
                                        {displayStreak} day streak!
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </WidgetPreview>

                    {/* Platform Info */}
                    <View style={styles.platformNote}>
                        <Text style={styles.platformNoteText}>
                            {Platform.OS === 'ios'
                                ? '✨ iOS widgets require building with EAS Build'
                                : '✨ Android widgets sync automatically with app data'
                            }
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.cardBg,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.xs,
    },
    headerTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: COLORS.textPrimary,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    instructionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.accentLight,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        gap: 12,
    },
    instructionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    instructionTitle: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    instructionText: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    sectionLabel: {
        fontSize: 11,
        fontFamily: 'DMSans_600SemiBold',
        color: COLORS.textMuted,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
        marginLeft: 4,
    },
    widgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    widgetLabel: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 11,
        color: COLORS.textMuted,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    widgetShadow: {
        borderRadius: 24,
        ...SHADOWS.md,
    },
    smallWidget: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: COLORS.cardBg,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    creatureCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 183, 178, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    streakNumber: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 36,
        color: '#FFB7B2',
    },
    streakLabel: {
        fontFamily: 'DMSans_700Bold',
        fontSize: 10,
        color: COLORS.textMuted,
        letterSpacing: 2,
    },
    statusCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: COLORS.lavenderLight,
    },
    partnerInitial: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        color: COLORS.white,
    },
    partnerNameWidget: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    statusLabel: {
        fontFamily: 'DMSans_700Bold',
        fontSize: 10,
        letterSpacing: 1,
    },
    mediumWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 28,
        padding: 20,
        height: 140,
    },
    mediumTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 17,
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    checkInRow: {
        flexDirection: 'row',
        gap: 8,
    },
    checkInPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    checkInPillPending: {
        borderWidth: 1,
        borderColor: COLORS.warmGray,
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    checkInText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 12,
        color: COLORS.textPrimary,
    },
    mediumCreature: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 183, 178, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockScreenWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        padding: 16,
        gap: 16,
    },
    lockScreenCreature: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFB7B2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockScreenLabel: {
        fontFamily: 'DMSans_700Bold',
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    lockScreenValue: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        color: '#FFF',
    },
    moodWidget: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 28,
        padding: 20,
        height: 140,
    },
    moodCreatureContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 183, 178, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    moodInfo: {
        flex: 1,
    },
    moodName: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: COLORS.textPrimary,
    },
    moodStatus: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    moodBadge: {
        backgroundColor: 'rgba(255, 183, 178, 0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    moodBadgeText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 11,
        color: '#C97066',
    },
    platformNote: {
        backgroundColor: COLORS.beige,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginTop: SPACING.md,
    },
    platformNoteText: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
