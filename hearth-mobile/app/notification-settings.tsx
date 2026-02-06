import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Bell, Heart, Gift, MessageCircle, Flame, Calendar, Sparkles } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING, GRADIENTS, RADIUS } from '../constants/theme';
import {
    notificationService,
    checkNotificationPermission,
    requestNotificationPermission,
    getPermissionDescription,
    NotificationType,
    PermissionStatus,
} from '../notifications';

interface NotificationToggle {
    type: NotificationType;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const NOTIFICATION_OPTIONS: NotificationToggle[] = [
    {
        type: 'partner_message',
        icon: <MessageCircle size={20} color="#E8B4B8" />,
        title: 'Partner Messages',
        description: 'When your partner sends you a message',
    },
    {
        type: 'partner_surprise',
        icon: <Gift size={20} color="#D4B8E0" />,
        title: 'Surprises',
        description: 'When you receive a virtual gift',
    },
    {
        type: 'partner_answered_question',
        icon: <Heart size={20} color="#F5B4B8" />,
        title: 'Daily Question Answers',
        description: 'When your partner answers the daily question',
    },
    {
        type: 'daily_question_available',
        icon: <Calendar size={20} color="#6BA3B2" />,
        title: 'Morning Reminder',
        description: "Today's question is ready (9 AM)",
    },
    {
        type: 'streak_at_risk',
        icon: <Flame size={20} color="#F5A623" />,
        title: 'Streak Reminder',
        description: 'Keep your streak alive (8 PM)',
    },
    {
        type: 'partner_checked_in',
        icon: <Sparkles size={20} color="#ECC68A" />,
        title: 'Partner Activity',
        description: 'When your partner checks in',
    },
];

export default function NotificationSettingsScreen() {
    const router = useRouter();
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
    const [preferences, setPreferences] = useState<Record<NotificationType, boolean>>({} as any);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const status = await checkNotificationPermission();
        setPermissionStatus(status);

        const prefs = await notificationService.getNotificationPreferences();
        setPreferences(prefs);
        setLoading(false);
    };

    const handleRequestPermission = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const granted = await requestNotificationPermission();
        if (granted) {
            setPermissionStatus('granted');
            // Initialize notification schedules
            await notificationService.scheduleDailyQuestionReminder(9);
            await notificationService.scheduleStreakReminder(20);
        }
    };

    const handleToggle = async (type: NotificationType, value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setPreferences(prev => ({ ...prev, [type]: value }));
        await notificationService.setNotificationPreference(type, value);

        // Update scheduled notifications based on toggle
        if (type === 'daily_question_available') {
            if (value) {
                await notificationService.scheduleDailyQuestionReminder(9);
            } else {
                await notificationService.cancelScheduledNotifications('daily_question_available');
            }
        }
        if (type === 'streak_at_risk') {
            if (value) {
                await notificationService.scheduleStreakReminder(20);
            } else {
                await notificationService.cancelScheduledNotifications('streak_at_risk');
            }
        }
    };

    const handleTestNotification = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await notificationService.sendTestNotification();
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
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={{ width: 40 }} />
                </Animated.View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Permission Card */}
                    <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.permissionCard}>
                        <View style={styles.permissionIcon}>
                            <Bell size={28} color={permissionStatus === 'granted' ? '#4CAF50' : COLORS.textMuted} />
                        </View>

                        <Text style={styles.permissionTitle}>
                            {permissionStatus === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
                        </Text>

                        <Text style={styles.permissionDesc}>
                            {permissionStatus === 'granted'
                                ? "You'll receive updates from your partner"
                                : "Get notified when your partner sends you love"
                            }
                        </Text>

                        {permissionStatus !== 'granted' && (
                            <Pressable onPress={handleRequestPermission}>
                                <LinearGradient
                                    colors={GRADIENTS.primary as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.enableButton}
                                >
                                    <Text style={styles.enableButtonText}>Enable Now</Text>
                                </LinearGradient>
                            </Pressable>
                        )}
                    </Animated.View>

                    {/* Notification Toggles */}
                    {permissionStatus === 'granted' && (
                        <>
                            <Text style={styles.sectionLabel}>Notification Types</Text>

                            {NOTIFICATION_OPTIONS.map((option, index) => (
                                <Animated.View
                                    key={option.type}
                                    entering={FadeInUp.delay(150 + index * 50).duration(300)}
                                    style={styles.toggleItem}
                                >
                                    <View style={styles.toggleIcon}>
                                        {option.icon}
                                    </View>
                                    <View style={styles.toggleText}>
                                        <Text style={styles.toggleTitle}>{option.title}</Text>
                                        <Text style={styles.toggleDesc}>{option.description}</Text>
                                    </View>
                                    <Switch
                                        value={preferences[option.type] ?? true}
                                        onValueChange={(val) => handleToggle(option.type, val)}
                                        trackColor={{ false: COLORS.warmGray, true: COLORS.accentLight }}
                                        thumbColor={preferences[option.type] ? COLORS.accent : '#f4f3f4'}
                                        ios_backgroundColor={COLORS.warmGray}
                                    />
                                </Animated.View>
                            ))}

                            {/* Test Notification */}
                            <Animated.View entering={FadeInUp.delay(500).duration(300)}>
                                <Pressable onPress={handleTestNotification} style={styles.testButton}>
                                    <Text style={styles.testButtonText}>Send Test Notification</Text>
                                </Pressable>
                            </Animated.View>
                        </>
                    )}
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
    scrollView: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    scrollContent: {
        paddingTop: SPACING.md,
        paddingBottom: 100,
    },
    permissionCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    permissionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.beige,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    permissionTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    permissionDesc: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    enableButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.sm + 2,
        borderRadius: RADIUS.md,
    },
    enableButtonText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 14,
        color: COLORS.white,
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
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        ...SHADOWS.xs,
    },
    toggleIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.beige,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    toggleText: {
        flex: 1,
    },
    toggleTitle: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    toggleDesc: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
        color: COLORS.textMuted,
    },
    testButton: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: COLORS.beige,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    testButtonText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
