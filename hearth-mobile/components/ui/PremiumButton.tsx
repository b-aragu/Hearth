import React from 'react';
import { Pressable, Text, View, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SHADOWS, RADIUS, SPACING, COLORS, GRADIENTS, ANIMATION } from '../../constants/theme';

interface PremiumButtonProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
    gradientColors?: readonly [string, string, ...string[]];
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    haptic?: boolean;
    style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SIZE_CONFIG = {
    sm: { height: 44, paddingH: 16, fontSize: 14 },
    md: { height: 52, paddingH: 20, fontSize: 16 },
    lg: { height: 60, paddingH: 24, fontSize: 17 },
};

export const PremiumButton: React.FC<PremiumButtonProps> = ({
    title,
    subtitle,
    icon,
    onPress,
    variant = 'primary',
    gradientColors,
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    haptic = true,
    style,
}) => {
    const scale = useSharedValue(1);
    const sizeConfig = SIZE_CONFIG[size];

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withTiming(0.96, { duration: ANIMATION.quick });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, ANIMATION.spring);
    };

    const handlePress = () => {
        if (haptic) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    const getContainerStyle = (): ViewStyle => {
        const base: ViewStyle = {
            height: sizeConfig.height,
            paddingHorizontal: sizeConfig.paddingH,
            borderRadius: RADIUS.lg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING.sm,
            opacity: disabled ? 0.5 : 1,
            ...(fullWidth && { width: '100%' }),
        };

        switch (variant) {
            case 'secondary':
                return {
                    ...base,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: COLORS.charcoal,
                };
            case 'ghost':
                return {
                    ...base,
                    backgroundColor: 'rgba(45,45,45,0.05)',
                };
            default:
                return base;
        }
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontSize: sizeConfig.fontSize,
            fontFamily: 'Outfit_600SemiBold',
        };

        switch (variant) {
            case 'secondary':
            case 'ghost':
                return { ...base, color: COLORS.charcoal };
            default:
                return { ...base, color: COLORS.white };
        }
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' || variant === 'gradient' ? COLORS.white : COLORS.charcoal}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View>{icon}</View>}
                    <View style={subtitle ? { alignItems: 'flex-start' } : undefined}>
                        <Text style={getTextStyle()}>{title}</Text>
                        {subtitle && (
                            <Text style={[getTextStyle(), { fontSize: 13, opacity: 0.8 }]}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </>
            )}
        </>
    );

    const containerStyle = getContainerStyle();

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle, style]}
        >
            {variant === 'primary' || variant === 'gradient' ? (
                <LinearGradient
                    colors={gradientColors || (variant === 'gradient' ? GRADIENTS.coralPeach : [COLORS.charcoal, '#1a1a1a'])}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[containerStyle, SHADOWS.md]}
                >
                    {renderContent()}
                </LinearGradient>
            ) : (
                <View style={containerStyle}>
                    {renderContent()}
                </View>
            )}
        </AnimatedPressable>
    );
};

export default PremiumButton;
