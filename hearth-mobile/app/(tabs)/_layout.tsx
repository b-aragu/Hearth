import { Tabs } from 'expo-router';
import { View, Text, Platform, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, BookOpen, Palette, Settings } from 'lucide-react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { COLORS, SHADOWS, TAB_BAR, createCustomShadow, createCustomGlow } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

// --- PREMIUM FLOATING TAB ICON ---
interface TabIconProps {
    icon: React.ReactNode;
    iconFilled?: React.ReactNode;
    focused: boolean;
    label: string;
}

const TabIcon = ({ icon, iconFilled, focused, label }: TabIconProps) => {
    const scale = useSharedValue(1);
    const bgOpacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(focused ? 1.1 : 1, { damping: 12, stiffness: 200 });
        bgOpacity.value = withTiming(focused ? 1 : 0, { duration: 250 });
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const bgStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
    }));

    return (
        <View style={styles.tabItem}>
            <Animated.View style={[styles.iconContainer, animatedStyle]}>
                {/* Gradient pill background when active */}
                <Animated.View style={[styles.activePill, bgStyle]}>
                    <LinearGradient
                        colors={['#D4847C', '#C9706A', '#BE5C56']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.pillGradient}
                    />
                </Animated.View>
                <View style={styles.iconWrapper}>
                    {focused ? (iconFilled || icon) : icon}
                </View>
            </Animated.View>
            <Text
                style={[
                    styles.label,
                    {
                        color: focused ? COLORS.accent : COLORS.textMuted,
                        fontFamily: focused ? 'DMSans_700Bold' : 'DMSans_500Medium',
                    }
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.floatingTabBar,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={80}
                            style={[StyleSheet.absoluteFill, { borderRadius: 32 }]}
                            tint="light"
                        />
                    ) : (
                        <View style={[StyleSheet.absoluteFill, styles.androidBg, { borderRadius: 32 }]} />
                    )
                ),
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={<Home size={22} color={focused ? '#fff' : COLORS.textMuted} strokeWidth={1.8} />}
                            iconFilled={<Home size={22} color="#fff" strokeWidth={2.5} fill="rgba(255,255,255,0.2)" />}
                            focused={focused}
                            label="Home"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: "Memories",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={<BookOpen size={22} color={focused ? '#fff' : COLORS.textMuted} strokeWidth={1.8} />}
                            iconFilled={<BookOpen size={22} color="#fff" strokeWidth={2.5} />}
                            focused={focused}
                            label="Memories"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="studio"
                options={{
                    title: "Style",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={<Palette size={22} color={focused ? '#fff' : COLORS.textMuted} strokeWidth={1.8} />}
                            iconFilled={<Palette size={22} color="#fff" strokeWidth={2.5} />}
                            focused={focused}
                            label="Style"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Us",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={<Settings size={22} color={focused ? '#fff' : COLORS.textMuted} strokeWidth={1.8} />}
                            iconFilled={<Settings size={22} color="#fff" strokeWidth={2.5} />}
                            focused={focused}
                            label="Us"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    floatingTabBar: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
        height: 72,
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        borderTopWidth: 0,
        borderRadius: 32,
        // Premium multi-layer shadow (cross-platform)
        ...createCustomShadow('#2C2C2C', 16, 0.12, 32, 20),
        // Subtle border
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    androidBg: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
        paddingBottom: 4,
    },
    iconContainer: {
        width: 52,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activePill: {
        position: 'absolute',
        width: 52,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden',
        // Glow effect (cross-platform)
        ...createCustomShadow('#D4847C', 4, 0.4, 12, 6),
    },
    pillGradient: {
        flex: 1,
        borderRadius: 18,
    },
    iconWrapper: {
        zIndex: 1,
    },
    label: {
        fontSize: 11,
        marginTop: 4,
        letterSpacing: 0.3,
    },
});

