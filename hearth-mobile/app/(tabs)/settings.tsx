import { View, Text, ScrollView, Pressable, TextInput, Modal, Alert, Share, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, withSpring } from 'react-native-reanimated';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { CREATURES } from '../../constants/creatures';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { COLORS, SHADOWS, SPACING, GRADIENTS, RADIUS } from '../../constants/theme';

// --- SETTING ITEM ---
const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    isLink,
    delay = 0,
}: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    isLink?: boolean;
    delay?: number;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        if (onPress) {
            scale.value = withSpring(0.97, { damping: 15 });
            setTimeout(() => scale.value = withSpring(1, { damping: 15 }), 100);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    return (
        <Animated.View entering={FadeInUp.delay(delay).duration(300)} style={animatedStyle}>
            <Pressable onPress={handlePress} disabled={!onPress} style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                    <View style={styles.settingIconBg}>
                        <Text style={styles.settingIcon}>{icon}</Text>
                    </View>
                    <Text style={styles.settingLabel}>{label}</Text>
                </View>

                <View style={styles.settingItemRight}>
                    {value && <Text style={styles.settingValue}>{value}</Text>}
                    {isLink && <Text style={styles.settingArrow}>›</Text>}
                </View>
            </Pressable>
        </Animated.View>
    );
};

// --- MAIN SCREEN ---
export default function SettingsScreen() {
    const router = useRouter();
    const { selectedCreature, couple, partnerName } = useCreature();
    const { user, profile, signOut, refreshProfile } = useAuth();
    const creature = CREATURES[selectedCreature];

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(profile?.display_name || '');
    const [saving, setSaving] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    // Animated pulse for heart
    const heartScale = useSharedValue(1);

    useEffect(() => {
        heartScale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            false
        );
    }, []);

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const handleSaveName = async () => {
        if (!newName.trim() || !user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ display_name: newName.trim() })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            setIsEditingName(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCopyCode = async () => {
        if (couple?.invite_code) {
            await Clipboard.setStringAsync(couple.invite_code);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2000);
        }
    };

    const handleShareCode = async () => {
        if (couple?.invite_code) {
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await Share.share({
                    message: `Join me on Hearth! Use my invite code: ${couple.invite_code} 💕`,
                });
            } catch (error) {
                console.log('Share error:', error);
            }
        }
    };

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        signOut();
                    },
                },
            ]
        );
    };

    const userName = profile?.display_name || 'You';

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

            {/* Edit Name Modal */}
            <Modal transparent visible={isEditingName} animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setIsEditingName(false)}>
                    <Pressable onPress={() => { }}>
                        <Animated.View entering={FadeInUp.duration(250)} style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Update Your Name</Text>
                            <TextInput
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Your Name"
                                placeholderTextColor={COLORS.textMuted}
                                style={styles.modalInput}
                                autoFocus
                            />
                            <View style={styles.modalButtons}>
                                <Pressable
                                    onPress={() => setIsEditingName(false)}
                                    style={styles.modalButtonSecondary}
                                >
                                    <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleSaveName}
                                    disabled={saving}
                                    style={styles.modalButtonPrimary}
                                >
                                    <LinearGradient
                                        colors={GRADIENTS.primary as any}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.modalButtonGradient}
                                    >
                                        <Text style={styles.modalButtonPrimaryText}>
                                            {saving ? 'Saving...' : 'Save'}
                                        </Text>
                                    </LinearGradient>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </Pressable>
                </Pressable>
            </Modal>

            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Animated.Text entering={FadeInDown.duration(400)} style={styles.headerTitle}>
                        Us
                    </Animated.Text>

                    {/* Profile Card */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.profileCard}>
                        {/* Partners Row */}
                        <View style={styles.partnersRow}>
                            {/* You */}
                            <Pressable
                                onPress={() => {
                                    setNewName(profile?.display_name || '');
                                    setIsEditingName(true);
                                }}
                                style={styles.partnerColumn}
                            >
                                <View style={[styles.avatar, { backgroundColor: COLORS.lavenderLight }]}>
                                    <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
                                    <View style={styles.editBadge}>
                                        <Text style={{ fontSize: 8 }}>✏️</Text>
                                    </View>
                                </View>
                                <Text style={styles.partnerName}>{userName}</Text>
                            </Pressable>

                            {/* Connection */}
                            <View style={styles.connectionLine}>
                                <View style={styles.line} />
                                <Animated.View style={[styles.heartBadge, heartStyle]}>
                                    <Text style={{ fontSize: 12 }}>💕</Text>
                                </Animated.View>
                            </View>

                            {/* Partner */}
                            <View style={styles.partnerColumn}>
                                <View style={[styles.avatar, { backgroundColor: COLORS.sageLight }]}>
                                    <Text style={styles.avatarInitial}>{partnerName.charAt(0).toUpperCase()}</Text>
                                </View>
                                <Text style={styles.partnerName}>{partnerName}</Text>
                            </View>
                        </View>

                        {/* Since Badge */}
                        <View style={styles.sinceBadge}>
                            <Text style={styles.sinceText}>
                                Together since {couple?.matched_at
                                    ? new Date(couple.matched_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Forever'
                                }
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Invite Code Card */}
                    <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.inviteCard}>
                        <Text style={styles.inviteLabel}>Your Invite Code</Text>
                        <Text style={styles.inviteCode}>{couple?.invite_code || '---'}</Text>
                        <View style={styles.inviteButtons}>
                            <Pressable onPress={handleCopyCode} style={[styles.inviteButton, codeCopied && styles.inviteButtonCopied]}>
                                <Text style={[styles.inviteButtonText, codeCopied && { color: COLORS.sage }]}>
                                    {codeCopied ? 'Copied! ✓' : 'Copy'}
                                </Text>
                            </Pressable>
                            <Pressable onPress={handleShareCode} style={[styles.inviteButton, styles.inviteButtonShare]}>
                                <Text style={[styles.inviteButtonText, { color: COLORS.accent }]}>Share</Text>
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Settings Groups */}
                    <Text style={styles.sectionLabel}>Preferences</Text>

                    <SettingItem icon="🔔" label="Notifications" isLink onPress={() => router.push('/notification-settings')} delay={200} />
                    <SettingItem
                        icon={creature.emoji}
                        label="Companion"
                        value={couple?.creature_name || creature.name}
                        onPress={() => router.push('/onboarding/select-creature')}
                        isLink
                        delay={250}
                    />

                    <Text style={[styles.sectionLabel, { marginTop: SPACING.md }]}>Extras</Text>

                    <SettingItem icon="📱" label="Home Screen Widgets" onPress={() => router.push('/widgets')} isLink delay={300} />
                    <SettingItem icon="🔒" label="Lock Screen Widgets" onPress={() => router.push('/widgets')} isLink delay={350} />
                    <SettingItem icon="🧪" label="Growth Simulator" onPress={() => router.push('/dev/gallery')} isLink delay={400} />

                    {/* Sign Out */}
                    <Animated.View entering={FadeInUp.delay(450).duration(300)} style={styles.signOutContainer}>
                        <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </Pressable>
                    </Animated.View>
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
    scrollView: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    scrollContent: {
        paddingTop: SPACING.md,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    profileCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.md,
    },
    partnersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    partnerColumn: {
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    avatarInitial: {
        fontSize: 22,
        fontFamily: 'Outfit_600SemiBold',
        color: COLORS.white,
    },
    editBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.textPrimary,
        borderRadius: 10,
        padding: 4,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    partnerName: {
        fontSize: 14,
        fontFamily: 'DMSans_600SemiBold',
        color: COLORS.textPrimary,
    },
    connectionLine: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    line: {
        height: 2,
        backgroundColor: COLORS.warmGray,
        width: '60%',
    },
    heartBadge: {
        position: 'absolute',
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 6,
        ...SHADOWS.xs,
    },
    sinceBadge: {
        backgroundColor: COLORS.beige,
        paddingVertical: 10,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    sinceText: {
        fontSize: 12,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.textSecondary,
        letterSpacing: 0.5,
    },
    inviteCard: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
    },
    inviteLabel: {
        fontSize: 11,
        color: COLORS.textMuted,
        fontFamily: 'DMSans_600SemiBold',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    inviteCode: {
        fontSize: 28,
        fontFamily: 'Outfit_700Bold',
        color: COLORS.accent,
        letterSpacing: 3,
        marginBottom: SPACING.md,
    },
    inviteButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    inviteButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        backgroundColor: COLORS.beige,
        borderRadius: RADIUS.sm,
    },
    inviteButtonCopied: {
        backgroundColor: COLORS.sageLight,
    },
    inviteButtonShare: {
        backgroundColor: COLORS.accentLight,
    },
    inviteButtonText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 13,
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
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        backgroundColor: COLORS.cardBg,
        marginBottom: SPACING.sm,
        borderRadius: RADIUS.md,
        minHeight: 60,
        ...SHADOWS.xs,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    settingIconBg: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: COLORS.beige,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingIcon: {
        fontSize: 18,
    },
    settingLabel: {
        fontSize: 15,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.textPrimary,
    },
    settingItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    settingValue: {
        fontSize: 13,
        fontFamily: 'DMSans_400Regular',
        color: COLORS.textMuted,
    },
    settingArrow: {
        fontSize: 20,
        color: COLORS.textMuted,
    },
    signOutContainer: {
        marginTop: SPACING.lg,
    },
    signOutButton: {
        padding: SPACING.md,
        backgroundColor: 'rgba(224, 160, 160, 0.15)',
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(224, 160, 160, 0.3)',
    },
    signOutText: {
        color: COLORS.error,
        fontFamily: 'DMSans_600SemiBold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        width: '100%',
        padding: SPACING.lg,
        borderRadius: RADIUS.xl,
        ...SHADOWS.lg,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Outfit_600SemiBold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    modalInput: {
        backgroundColor: COLORS.beige,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        fontSize: 16,
        fontFamily: 'DMSans_500Medium',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    modalButtonSecondary: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: COLORS.beige,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    modalButtonSecondaryText: {
        fontFamily: 'DMSans_600SemiBold',
        color: COLORS.textSecondary,
    },
    modalButtonPrimary: {
        flex: 1,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
    },
    modalButtonGradient: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalButtonPrimaryText: {
        fontFamily: 'DMSans_600SemiBold',
        color: COLORS.white,
    },
});
