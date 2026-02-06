import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SHADOWS, RADIUS, SPACING, COLORS, GRADIENTS } from '../../constants/theme';

interface PremiumCardProps {
    children: React.ReactNode;
    variant?: 'solid' | 'glass' | 'gradient';
    gradientColors?: readonly [string, string, ...string[]];
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    shadow?: 'sm' | 'md' | 'lg' | 'glow';
    radius?: 'md' | 'lg' | 'xl';
    style?: ViewStyle;
    animated?: boolean;
    animationDelay?: number;
}

const PADDING_MAP = {
    sm: SPACING.md,
    md: SPACING.lg,
    lg: SPACING.xl,
    xl: SPACING.xxl,
};

export const PremiumCard: React.FC<PremiumCardProps> = ({
    children,
    variant = 'glass',
    gradientColors,
    padding = 'md',
    shadow = 'md',
    radius = 'xl',
    style,
    animated = true,
    animationDelay = 0,
}) => {
    const paddingValue = PADDING_MAP[padding];
    const radiusValue = RADIUS[radius];
    const shadowStyle = SHADOWS[shadow];

    const containerStyle: ViewStyle = {
        borderRadius: radiusValue,
        overflow: 'hidden',
        ...shadowStyle,
        ...style,
    };

    const innerStyle: ViewStyle = {
        padding: paddingValue,
    };

    const renderContent = () => {
        switch (variant) {
            case 'gradient':
                return (
                    <LinearGradient
                        colors={gradientColors || GRADIENTS.coralPeach}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.fill, innerStyle]}
                    >
                        {children}
                    </LinearGradient>
                );

            case 'glass':
                return (
                    <View style={[styles.glassContainer, innerStyle, { borderRadius: radiusValue }]}>
                        {Platform.OS === 'ios' && (
                            <BlurView
                                intensity={60}
                                tint="light"
                                style={StyleSheet.absoluteFill}
                            />
                        )}
                        <View style={styles.glassOverlay} />
                        <View style={styles.contentWrapper}>
                            {children}
                        </View>
                    </View>
                );

            case 'solid':
            default:
                return (
                    <View style={[styles.solidContainer, innerStyle, { borderRadius: radiusValue }]}>
                        {children}
                    </View>
                );
        }
    };

    if (animated) {
        return (
            <Animated.View
                entering={FadeIn.delay(animationDelay).duration(400)}
                style={containerStyle}
            >
                {renderContent()}
            </Animated.View>
        );
    }

    return (
        <View style={containerStyle}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    glassContainer: {
        backgroundColor: Platform.OS === 'android' ? COLORS.glassWhite : 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    glassOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    contentWrapper: {
        position: 'relative',
        zIndex: 1,
    },
    solidContainer: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
    },
});

export default PremiumCard;
