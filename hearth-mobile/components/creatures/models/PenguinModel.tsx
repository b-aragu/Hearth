import React from 'react';
import Svg, { Circle, Path, G, Rect, Ellipse, Line } from 'react-native-svg';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';
import { Platform } from 'react-native';

import { GlassesRound, HatBeanie, ScarfRed, BowTie } from '../parts/Accessories';

const AnimatedG = Animated.createAnimatedComponent(G);

interface PenguinProps {
    mood: 'happy' | 'sad' | 'sleepy' | 'neutral' | 'loved' | 'excited';
    breathing: SharedValue<number>;
    blink: SharedValue<number>;
    color?: string; // Default to black
    accessories?: string[];
    growthFactor?: number; // 0.0 (Chick) -> 1.0 (Adult)
    accessoryColors?: Record<string, string>;
}

// Linear Interpolation Helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const isWeb = Platform.OS === 'web';

export const PenguinModel = ({ mood, breathing, blink, color = '#2C3E50', accessories = [], growthFactor = 0, accessoryColors = {} }: PenguinProps) => {
    const isAndroid = Platform.OS === 'android';

    // --- NEOTENY CALCULATIONS ---
    const bodyScale = lerp(0.85, 1.0, growthFactor);
    const bodyHeightBias = lerp(0, 20, growthFactor);

    // EYES & FACE - Lowered for cuteness
    const eyeScale = lerp(1.2, 1.0, growthFactor);
    const eyeSpacing = lerp(0.9, 1.0, growthFactor);
    const faceYOffset = 15; // Shift face down

    const leftEyeX = 100 - (18 * eyeSpacing);
    const rightEyeX = 100 + (18 * eyeSpacing);

    // ACCESSORIES
    const accessoryScale = lerp(0.74, 1.0, growthFactor);

    // Animation Props
    const creatureProps = useAnimatedProps(() => {
        const transY = breathing.value * -5;
        // Waddle: Rotate side to side slightly with breathing
        const waddleRot = Math.sin(breathing.value * Math.PI) * 2;

        if (isWeb) {
            return { transform: `translate(0, ${transY}) rotate(${waddleRot}, 100, 180)` } as any;
        }
        return {
            transform: [
                { translateY: transY },
                { rotate: `${waddleRot}deg` },
                { translateX: 0 }, { translateY: 0 }
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

    // Flipper Flap
    const flipperLeftProps = useAnimatedProps(() => {
        const rot = Math.sin(breathing.value * Math.PI) * 15;
        if (isWeb) return { transform: `rotate(${rot}, 60, 160)` } as any;
        return { transform: [{ rotate: `${rot}deg` }, { translateX: 60 }, { translateY: 160 }, { translateX: -60 }, { translateY: -160 }] } as any;
    });

    const flipperRightProps = useAnimatedProps(() => {
        const rot = Math.sin(breathing.value * Math.PI) * -15;
        if (isWeb) return { transform: `rotate(${rot}, 140, 160)` } as any;
        return { transform: [{ rotate: `${rot}deg` }, { translateX: 140 }, { translateY: 160 }, { translateX: -140 }, { translateY: -160 }] } as any;
    });


    return (
        <Svg viewBox="0 0 200 300" width={200} height={300}>
            {/* Wrapper offset */}
            <G transform="translate(0, 50)">
                {/* SHADOW */}
                <Circle cx="100" cy="210" r={40 * bodyScale} fill="rgba(69, 58, 43, 0.1)" transform={`translate(100, 210) scale(${1 + (1 - growthFactor) * 0.2}) translate(-100, -210)`} />

                <G {...(isAndroid ? {} : { animatedProps: creatureProps })}>

                    {/* FLIPPERS - Behind body */}
                    <G {...(isAndroid ? {} : { animatedProps: flipperLeftProps })}>
                        <Ellipse cx="50" cy="180" rx="15" ry="35" transform="rotate(20, 50, 180)" fill={lerp(0, 1, growthFactor) > 0.5 ? '#94A3B8' : color} />
                    </G>
                    <G {...(isAndroid ? {} : { animatedProps: flipperRightProps })}>
                        <Ellipse cx="150" cy="180" rx="15" ry="35" transform="rotate(-20, 150, 180)" fill={lerp(0, 1, growthFactor) > 0.5 ? '#94A3B8' : color} />
                    </G>

                    {/* BODY - Oval / Egg Shape */}
                    <G transform={`translate(0, -20) translate(100, 150) scale(${bodyScale}) translate(-100, -150)`}>
                        {/* Main Color Body */}
                        <Ellipse cx="100" cy="150" rx="55" ry={75 + bodyHeightBias} fill={color} />

                        {/* Belly Patch (White) - Wider and Rounds out the bottom */}
                        <Ellipse cx="100" cy="168" rx="42" ry={52 + bodyHeightBias} fill="#FFFFFF" />
                    </G>

                    {/* FEET - Pointed out more */}
                    <G transform={`translate(0, ${bodyHeightBias})`}>
                        <Path d="M 65 210 Q 55 205, 55 220 Q 70 230, 80 220 Z" fill="#FFA726" />
                        <Path d="M 135 210 Q 145 205, 145 220 Q 130 230, 120 220 Z" fill="#FFA726" />
                    </G>

                    {/* HEAD DETAILS - Low & Cute */}

                    {/* BEAK - Small & Cute */}
                    <G transform={`translate(0, ${118 + faceYOffset})`}>
                        <Path d="M 94 0 L 106 0 L 100 8 Z" fill="#FFB74D" stroke="#EF6C00" strokeWidth="1" strokeLinejoin="round" />
                        <Path d="M 96 1 L 104 1 L 100 4 Z" fill="#FFFFFF" opacity={0.4} />
                    </G>

                    {/* EYES - Wide set & Low */}
                    <G transform={`translate(100, ${108 + faceYOffset}) scale(${eyeScale}) translate(-100, -${108 + faceYOffset})`}>
                        <G {...(isAndroid ? {} : { animatedProps: blinkProps })}>
                            <G>
                                {mood === 'loved' ? (
                                    <>
                                        {/* Heart Eyes 😍 (Adjusted for Penguin) */}
                                        <Path d={`M ${leftEyeX} ${108 + faceYOffset + 3} l -4 -4 q -2 -2 0 -4 q 2 -2 4 0 q 2 -2 4 0 q 2 2 0 4 z`} fill="#E05263" transform={`scale(1.1) translate(${leftEyeX * -0.1 + 6}, ${-(108 + faceYOffset) * 0.1})`} />
                                        <Path d={`M ${rightEyeX} ${108 + faceYOffset + 3} l -4 -4 q -2 -2 0 -4 q 2 -2 4 0 q 2 -2 4 0 q 2 2 0 4 z`} fill="#E05263" transform={`scale(1.1) translate(${rightEyeX * -0.1 - 6}, ${-(108 + faceYOffset) * 0.1})`} />
                                    </>
                                ) : mood === 'excited' ? (
                                    <>
                                        {/* Star Eyes 🤩 */}
                                        <Path d={`M ${leftEyeX} ${108 + faceYOffset - 8} L ${leftEyeX + 2} ${108 + faceYOffset - 2} L ${leftEyeX + 8} ${108 + faceYOffset} L ${leftEyeX + 2} ${108 + faceYOffset + 2} L ${leftEyeX} ${108 + faceYOffset + 8} L ${leftEyeX - 2} ${108 + faceYOffset + 2} L ${leftEyeX - 8} ${108 + faceYOffset} L ${leftEyeX - 2} ${108 + faceYOffset - 2} Z`} fill="#F4D35E" />
                                        <Path d={`M ${rightEyeX} ${108 + faceYOffset - 8} L ${rightEyeX + 2} ${108 + faceYOffset - 2} L ${rightEyeX + 8} ${108 + faceYOffset} L ${rightEyeX + 2} ${108 + faceYOffset + 2} L ${rightEyeX} ${108 + faceYOffset + 8} L ${rightEyeX - 2} ${108 + faceYOffset + 2} L ${rightEyeX - 8} ${108 + faceYOffset} L ${rightEyeX - 2} ${108 + faceYOffset - 2} Z`} fill="#F4D35E" />
                                    </>
                                ) : (
                                    <>
                                        <Circle cx={leftEyeX} cy={108 + faceYOffset} r="7" fill="#1E293B" />
                                        <Circle cx={rightEyeX} cy={108 + faceYOffset} r="7" fill="#1E293B" />

                                        <Circle cx={leftEyeX + 2} cy={106 + faceYOffset} r="2.5" fill="white" opacity={0.9} />
                                        <Circle cx={rightEyeX + 2} cy={106 + faceYOffset} r="2.5" fill="white" opacity={0.9} />
                                    </>
                                )}

                                {mood === 'sleepy' && (
                                    <>
                                        <Rect x={leftEyeX - 8} y={108 + faceYOffset - 8} width="16" height="9" fill={color} />
                                        <Rect x={rightEyeX - 8} y={108 + faceYOffset - 8} width="16" height="9" fill={color} />
                                    </>
                                )}
                            </G>
                        </G>
                    </G>

                    {/* MOUTH */}
                    {(mood === 'happy' || mood === 'loved' || mood === 'excited') && (
                        <Path d={`M 94 ${130 + faceYOffset} Q 100 ${134 + faceYOffset} 106 ${130 + faceYOffset}`} stroke="#EF6C00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    )}


                    {/* ACCESSORIES - Adjusted to new low face position */}

                    {/* Hat - Lower on head */}
                    <G transform={`translate(0, ${lerp(30, 25, growthFactor)})`}>
                        <G transform={`translate(100, 50) scale(${accessoryScale}) translate(-100, -50)`}>
                            {accessories.includes('hat_beanie') && <HatBeanie color={accessoryColors['hat_beanie']} />}
                        </G>
                    </G>

                    {/* Glasses */}
                    <G transform={`translate(0, ${lerp(-5, 0, growthFactor) + faceYOffset})`}>
                        <G transform={`translate(100, 100) scale(${accessoryScale}) translate(-100, -100)`}>
                            {accessories.includes('glasses') && <GlassesRound color={accessoryColors['glasses']} />}
                        </G>
                    </G>

                    {/* Scarf/Tie - Neck area */}
                    <G transform={`translate(0, ${lerp(15, 20, growthFactor)})`}>
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
