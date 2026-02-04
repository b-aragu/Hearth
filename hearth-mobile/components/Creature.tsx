import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';
const StyledView = View;
const StyledText = Text;

interface CreatureProps {
    emoji?: string;
    size?: "sm" | "md" | "lg" | "xl";
    animated?: boolean;
    className?: string; // For additional styling
}

export function Creature({ emoji = "🐧", size = "md", animated = true, className }: CreatureProps) {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    const sizeClasses = {
        sm: "text-4xl",
        md: "text-6xl",
        lg: "text-8xl",
        xl: "text-[120px]", // Native sizing
    };

    useEffect(() => {
        if (animated) {
            // Breathing animation (Scale)
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );

            // Floating animation (TranslateY)
            translateY.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                true
            );
        } else {
            cancelAnimation(scale);
            cancelAnimation(translateY);
            scale.value = 1;
            translateY.value = 0;
        }
    }, [animated]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }));

    // Interactive Bounce on Press
    const handlePress = () => {
        scale.value = withSequence(
            withTiming(1.2, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
    };

    return (
        <Pressable onPress={handlePress}>
            <Animated.View style={[animatedStyle]} className="items-center justify-center">
                <StyledText className={`${sizeClasses[size]} ${className}`}>
                    {emoji}
                </StyledText>
                {/* Shadow/Blur effect (simulated with standard view for now) */}
                {animated && (
                    <StyledView className="w-20 h-4 bg-black/10 rounded-full mt-2 opacity-20 blur-sm" />
                )}
            </Animated.View>
        </Pressable>
    );
}
