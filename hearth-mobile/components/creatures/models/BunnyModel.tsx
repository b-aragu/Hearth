import React from 'react';
import Svg, { Circle, Path, G, Rect, Line, Ellipse } from 'react-native-svg';
import Animated, { useAnimatedProps, useAnimatedStyle, SharedValue } from 'react-native-reanimated';

import { Platform } from 'react-native';
import { GlassesRound, HatBeanie, ScarfRed, BowTie } from '../parts/Accessories';

// Animated components
const AnimatedG = Platform.OS === 'android' ? G : Animated.createAnimatedComponent(G);

interface BunnyProps {
    mood: 'happy' | 'sad' | 'sleepy' | 'neutral';
    breathing: SharedValue<number>;
    blink: SharedValue<number>;
    color?: string;
    accessories?: string[];
    growthFactor?: number; // 0.0 (Baby) -> 1.0 (Adult)
    accessoryColors?: Record<string, string>;
}

// Linear Interpolation Helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const isWeb = Platform.OS === 'web';

export const BunnyModel = ({ mood, breathing, blink, color = '#E3D7C5', accessories = [], growthFactor = 0, accessoryColors = {} }: BunnyProps) => {

    // --- NEOTENY CALCULATIONS ---
    const headScale = lerp(1.10, 1.0, growthFactor);
    const bodyScale = lerp(0.85, 1.0, growthFactor);
    const headYOffset = lerp(4, 0, growthFactor);

    // EARS: Huge for baby bunny!
    const earScale = lerp(1.3, 1.0, growthFactor);

    // FACE
    const eyeScale = lerp(1.3, 1.0, growthFactor); // Huge eyes
    const eyeSpacing = lerp(0.9, 1.0, growthFactor);
    const faceYOffset = 15; // Low face

    // Derived Eye X positions
    const leftEyeX = 100 - (18 * eyeSpacing);
    const rightEyeX = 100 + (18 * eyeSpacing);

    // ACCESSORIES
    const accessoryScale = lerp(0.74, 1.0, growthFactor);

    // Animation Props
    const creatureProps = useAnimatedProps(() => {
        const transY = breathing.value * -5;
        if (isWeb) {
            return { transform: `translate(0, ${transY})` } as any;
        }
        return {
            transform: [
                { translateY: transY }
            ]
        } as any;
    });

    const blinkProps = useAnimatedProps(() => {
        const scaleY = 1 - blink.value;
        if (isWeb) {
            return { transform: `scale(1, ${scaleY})` } as any;
        }
        return {
            transform: [
                { scaleY: scaleY }
            ]
        } as any;
    });

    // Ear Twitch
    const earLeftProps = useAnimatedProps(() => {
        const rot = breathing.value * 5 - 5;
        if (isWeb) {
            return { transform: `rotate(${rot}, 100, 100)` } as any;
        }
        return {
            transform: [
                { rotate: `${rot}deg` } // Slight sway
            ]
        } as any;
    });
    const earRightProps = useAnimatedProps(() => {
        const rot = breathing.value * -5 + 5;
        if (isWeb) {
            return { transform: `rotate(${rot}, 100, 100)` } as any;
        }
        return {
            transform: [
                { rotate: `${rot}deg` }
            ]
        } as any;
    });

    // On Android, skip animated props entirely to avoid rendering issues
    const isAndroid = Platform.OS === 'android';

    return (
        <Svg viewBox="0 0 200 300" width={200} height={300}>
            {/* DIAGNOSTIC RED BOX - Using RGBA fill instead of opacity */}
            <Rect x="0" y="0" width="200" height="300" fill="rgba(255, 0, 0, 0.2)" />

            {/* SHADOW */}
            <Circle cx="100" cy="175" r={40 * bodyScale} fill="rgba(69, 58, 43, 0.1)" />

            {/* Main creature group */}
            <G {...(isAndroid ? {} : { animatedProps: creatureProps })}>

                {/* BLUE DEBUG CIRCLE - Test if simple Circle inside G works */}
                <Circle cx="50" cy="50" r="30" fill="blue" />

                {/* TAIL (Behind Body) */}
                <Circle cx="135" cy="180" r="14" fill="white" />

                {/* BODY */}
                <G transform={`translate(0, -15) translate(100, 160) scale(${bodyScale}) translate(-100, -160)`}>
                    {/* GREEN DEBUG CIRCLE - Test if Transforms work */}
                    <Circle cx="100" cy="160" r="30" fill="green" />
                    {/* Main Body - Slightly more pear shaped for bunny */}
                    <Ellipse cx="100" cy="165" rx="40" ry="45" fill={color} />
                    <Ellipse cx="100" cy="165" rx="25" ry="32" fill="#FFF8F0" opacity={0.7} />

                    {/* FEET */}
                    <Ellipse cx="75" cy="205" rx="14" ry="10" fill={color} />
                    <Ellipse cx="125" cy="205" rx="14" ry="10" fill={color} />

                    {/* ARMS */}
                    <Circle cx="62" cy="155" r="10" fill={color} />
                    <Circle cx="138" cy="155" r={10} fill={color} />
                </G>

                {/* HEAD GROUP */}
                <G transform={`translate(0, ${-25 + headYOffset}) translate(100, 130) scale(${headScale}) translate(-100, -130)`}>

                    {/* EARS - Tall & Soft */}
                    {/* Left Ear */}
                    <G {...(isAndroid ? {} : { animatedProps: earLeftProps })}>
                        <G transform={`translate(100, 100) scale(${earScale}) translate(-100, -100)`}>
                            <G transform="rotate(-15, 75, 70)">
                                <Ellipse cx="75" cy="50" rx="14" ry="40" fill={color} />
                                <Ellipse cx="75" cy="50" rx="7" ry="30" fill="rgba(255,255,255,0.3)" />
                            </G>
                        </G>
                    </G>

                    {/* Right Ear */}
                    <G {...(isAndroid ? {} : { animatedProps: earRightProps })}>
                        <G transform={`translate(100, 100) scale(${earScale}) translate(-100, -100)`}>
                            <G transform="rotate(15, 125, 70)">
                                <Ellipse cx="125" cy="50" rx="14" ry="40" fill={color} />
                                <Ellipse cx="125" cy="50" rx="7" ry="30" fill="rgba(255,255,255,0.3)" />
                            </G>
                        </G>
                    </G>

                    {/* FACE BASE - Round */}
                    <Circle cx="100" cy="100" r="52" fill={color} />

                    {/* MUZZLE */}
                    <G transform={`translate(0, ${faceYOffset})`}>
                        {/* Bunny Nose is smaller/pinker */}
                        <Circle cx="100" cy="108" r="4" fill="#E8B4B8" />

                        {/* MOOD EYEBROWS */}
                        {mood === 'sad' && (
                            <G transform={`translate(0, -5)`}>
                                <Path d={`M ${leftEyeX - 5} ${95 + faceYOffset - 8} L ${leftEyeX + 4} ${95 + faceYOffset - 12}`} stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
                                <Path d={`M ${rightEyeX + 5} ${95 + faceYOffset - 8} L ${rightEyeX - 4} ${95 + faceYOffset - 12}`} stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
                            </G>
                        )}

                        {/* Mouth */}
                        {mood === 'happy' && (
                            <Path d="M 95 116 Q 100 120 105 116" stroke="#8A6A5C" strokeWidth="2" strokeLinecap="round" fill="none" />
                        )}
                        {(mood === 'neutral' || mood === 'sleepy') && (
                            <Path d="M 100 112 L 100 116 M 96 116 Q 100 116 104 116" stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" />
                        )}
                        {mood === 'sad' && (
                            // Deeper frown
                            <Path d="M 96 118 Q 100 112 104 118" stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        )}
                    </G>

                    {/* EYES - Low & Big */}
                    <G transform={`translate(0, ${100 + faceYOffset}) translate(100, ${100 + faceYOffset}) scale(${eyeScale}) translate(-100, -${100 + faceYOffset})`}>
                        <G {...(isAndroid ? {} : { animatedProps: blinkProps })}>
                            <G transform={`translate(0, -${100 + faceYOffset})`}>
                                {/* Standard Eyes */}
                                <Circle cx={leftEyeX} cy={95 + faceYOffset} r="6" fill="#4A3B32" />
                                <Circle cx={rightEyeX} cy={95 + faceYOffset} r="6" fill="#4A3B32" />

                                {/* Highlights */}
                                <Circle cx={leftEyeX + 1.5} cy={95 + faceYOffset - 1.5} r="2" fill="white" opacity={0.8} />
                                <Circle cx={rightEyeX + 1.5} cy={95 + faceYOffset - 1.5} r="2" fill="white" opacity={0.8} />

                                {/* Mood Specifics */}
                                {mood === 'happy' && (
                                    <>
                                        {/* Happy Cheeks */}
                                        <Circle cx={leftEyeX - 10} cy={105 + faceYOffset} r="5" fill="#E8B4B8" opacity={0.5} />
                                        <Circle cx={rightEyeX + 10} cy={105 + faceYOffset} r="5" fill="#E8B4B8" opacity={0.5} />
                                    </>
                                )}
                                {mood === 'sleepy' && (
                                    <>
                                        {/* Eyelids */}
                                        <Rect x={leftEyeX - 7} y={95 + faceYOffset - 7} width="14" height="8" fill={color} />
                                        <Rect x={rightEyeX - 7} y={95 + faceYOffset - 7} width="14" height="8" fill={color} />
                                    </>
                                )}
                            </G>
                        </G>
                    </G>

                    {/* ACCESSORIES */}
                    <G transform={`translate(0, ${lerp(-15, -20, growthFactor)})`}>
                        <G transform={`translate(100, 50) scale(${accessoryScale}) translate(-100, -50)`}>
                            {accessories.includes('hat_beanie') && (
                                // Adjust beanie to sit between ears
                                <G transform="translate(0, 5)">
                                    <HatBeanie color={accessoryColors['hat_beanie']} />
                                </G>
                            )}
                        </G>
                    </G>

                    <G transform={`translate(0, ${lerp(faceYOffset - 10, faceYOffset + 7, growthFactor)})`}>
                        <G transform={`translate(100, 100) scale(${accessoryScale}) translate(-100, -100)`}>
                            {accessories.includes('glasses') && <GlassesRound color={accessoryColors['glasses']} />}
                        </G>
                    </G>

                    <G transform={`translate(0, ${lerp(25, 33, growthFactor)})`}>
                        <G transform={`translate(100, 130) scale(${accessoryScale}) translate(-100, -130)`}>
                            {accessories.includes('scarf') && <ScarfRed color={accessoryColors['scarf']} />}
                            {accessories.includes('bowtie') && <BowTie color={accessoryColors['bowtie']} />}
                        </G>
                    </G>

                </G>

            </G>
        </Svg>
    );
};
