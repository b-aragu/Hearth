import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, withSequence, Easing, useDerivedValue, runOnJS } from 'react-native-reanimated';
import { BearModel } from './models/BearModel';
import { BunnyModel } from './models/BunnyModel';
import { CatModel } from './models/CatModel';
import { DogModel } from './models/DogModel';
import { PenguinModel } from './models/PenguinModel';

interface DynamicCreatureProps {
    creatureId: string;
    mood?: 'happy' | 'sad' | 'sleepy' | 'neutral';
    scale?: number;
    accessories?: string[];
    daysTogether?: number; // New prop for growth
    accessoryColors?: Record<string, string>; // Updated: Map of accessory ID -> Color
}

export const DynamicCreature = ({
    creatureId,
    mood = 'neutral',
    scale = 1,
    accessories = [],
    daysTogether = 1,
    accessoryColors,
}: DynamicCreatureProps) => {
    const breathing = useSharedValue(0);
    const blink = useSharedValue(0);

    // 1. GROWTH LOGIC
    // Baby (0.6) -> Adult (1.2) over ~60 days (0.01 growth per day)
    const growthScale = Math.min(0.6 + (daysTogether * 0.01), 1.2);
    const finalScale = scale * growthScale;

    // Neoteny Factor (0.0 = Newborn, 1.0 = Adult)
    // Used for morphing proportions internally
    const growthFactor = Math.min(Math.max((daysTogether - 1) / 60, 0), 1);

    useEffect(() => {
        // Continuous gentle breathing loop
        breathing.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1, // Infinite
            true // Reverse
        );

        // Random Blinking Loop
        const blinkLoop = () => {
            const nextBlinkIn = Math.random() * 4000 + 2000; // Random 2s - 6s
            setTimeout(() => {
                blink.value = withSequence(
                    withTiming(1, { duration: 100 }), // Close
                    withTiming(0, { duration: 100 })  // Open
                );
                blinkLoop(); // Recurse
            }, nextBlinkIn);
        };
        blinkLoop();
    }, []);

    // Select the correct model
    const renderModel = () => {
        switch (creatureId) {
            case 'bear': return <BearModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} />;
            case 'bunny': return <BunnyModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} />;
            case 'cat': return <CatModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} />;
            case 'dog': return <DogModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} />;
            case 'penguin': return <PenguinModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} />;
            case 'fox': return <CatModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} color="#D97C50" />; // Re-use Cat for Fox temporarily
            default: return <BearModel mood={mood} breathing={breathing} blink={blink} accessories={accessories} growthFactor={growthFactor} accessoryColors={accessoryColors} />;
        }
    };

    return (
        <View style={{ width: 250, height: 250, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ scale: finalScale }] }}>
                {renderModel()}
            </Animated.View>
        </View>
    );
};
