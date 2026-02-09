import React from 'react';
import Svg, { Circle, Path, G, Rect, Ellipse, Line } from 'react-native-svg';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';
import { Platform } from 'react-native';

import { GlassesRound, HatBeanie, ScarfRed, BowTie } from '../parts/Accessories';

const AnimatedG = Animated.createAnimatedComponent(G);

interface DogProps {
    mood: 'happy' | 'sad' | 'sleepy' | 'neutral' | 'loved' | 'excited';
    breathing: SharedValue<number>;
    blink: SharedValue<number>;
    color?: string; // Default warm peach/yellow
    accessories?: string[];
    growthFactor?: number; // 0.0 (Puppy) -> 1.0 (Dog)
    accessoryColors?: Record<string, string>;
}

// Linear Interpolation Helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const isWeb = Platform.OS === 'web';

export const DogModel = ({ mood, breathing, blink, color = '#FFDAC1', accessories = [], growthFactor = 0, accessoryColors = {} }: DogProps) => {
    const isAndroid = Platform.OS === 'android';

    // --- NEOTENY CALCULATIONS ---
    const headScale = lerp(1.15, 1.0, growthFactor);
    const bodyScale = lerp(0.85, 1.0, growthFactor);
    const headYOffset = lerp(10, 0, growthFactor); // Baby head is lower/bigger relative to body

    // EARS: Floppy Ears
    const earScale = lerp(1.1, 1.0, growthFactor);

    // FACE
    const eyeScale = lerp(1.2, 1.0, growthFactor);
    const eyeSpacing = lerp(0.9, 1.0, growthFactor);
    const faceYOffset = 0; // Reset offset (Eyes were overlapping muzzle at 18)

    // Derived Eye X positions
    const leftEyeX = 100 - (22 * eyeSpacing);
    const rightEyeX = 100 + (22 * eyeSpacing);

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

    // Tail Wag - Happy & Energetic
    const tailProps = useAnimatedProps(() => {
        const rot = Math.sin(breathing.value * Math.PI * 4) * 25;
        if (isWeb) {
            return { transform: `rotate(${rot}, 135, 175)` } as any;
        }
        return {
            transform: [
                { rotate: `${rot}deg` },
                { translateX: 135 }, { translateY: 175 },
                { translateX: -135 }, { translateY: -175 }
            ]
        } as any;
    });

    // Ear Flop - Subtle bounce
    const earLeftProps = useAnimatedProps(() => {
        const rot = Math.sin(breathing.value * Math.PI) * 4;
        if (isWeb) return { transform: `rotate(${rot}, 60, 60)` } as any;
        return { transform: [{ rotate: `${rot}deg` }, { translateX: 60 }, { translateY: 60 }, { translateX: -60 }, { translateY: -60 }] } as any;
    });

    const earRightProps = useAnimatedProps(() => {
        const rot = Math.sin(breathing.value * Math.PI) * -4;
        if (isWeb) return { transform: `rotate(${rot}, 140, 60)` } as any;
        return { transform: [{ rotate: `${rot}deg` }, { translateX: 140 }, { translateY: 60 }, { translateX: -140 }, { translateY: -60 }] } as any;
    });

    return (
        <Svg viewBox="0 0 200 300" width={200} height={300}>
            {/* Wrapper offset */}
            <G transform="translate(0, 50)">
                {/* SHADOW */}
                <Circle cx="100" cy="180" r={38 * bodyScale} fill="rgba(69, 58, 43, 0.1)" transform={`translate(100, 175) scale(${1 + (1 - growthFactor) * 0.2}) translate(-100, -175)`} />

                <G {...(isAndroid ? {} : { animatedProps: creatureProps })}>

                    {/* TAIL - Happy Wag */}
                    <G {...(isAndroid ? {} : { animatedProps: tailProps })}>
                        {/* Fluffy tail */}
                        <Path d="M 135 175 Q 160 160 155 130" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round" />
                        <Path d="M 135 175 Q 160 160 155 130" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="none" strokeLinecap="round" />
                    </G>

                    {/* BODY - Round Bean */}
                    <G transform={`translate(0, -15) translate(100, 160) scale(${bodyScale}) translate(-100, -160)`}>
                        <Ellipse cx="100" cy="170" rx="42" ry="46" fill={color} />
                        {/* Belly */}
                        <Ellipse cx="100" cy="180" rx="28" ry="34" fill="#FFFBEB" opacity={0.7} />

                        {/* FEET - Chunky paws */}
                        <Circle cx="72" cy="205" r="14" fill={color} />
                        <Circle cx="128" cy="205" r="14" fill={color} />
                        {/* Toe pads */}
                        <Circle cx="72" cy="205" r="6" fill="#FFFBEB" opacity={0.5} />
                        <Circle cx="128" cy="205" r="6" fill="#FFFBEB" opacity={0.5} />

                        {/* ARMS - Resting paws */}
                        <Circle cx="60" cy="160" r="13" fill={color} />
                        <Circle cx="140" cy="160" r="13" fill={color} />
                    </G>

                    {/* HEAD GROUP */}
                    <G transform={`translate(0, ${-25 + headYOffset}) translate(100, 130) scale(${headScale}) translate(-100, -130)`}>

                        {/* EARS - Floppy Spaniel/Retriever Style */}
                        {/* Left Ear */}
                        <G {...(isAndroid ? {} : { animatedProps: earLeftProps })}>
                            {/* Attached high, droops low and wide */}
                            <Path d="M 55 60 C 20 60, 10 120, 40 135 C 55 142, 65 120, 60 70" fill={color} />
                            {/* Highlight */}
                            <Path d="M 45 80 C 35 80, 30 110, 45 120" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </G>

                        {/* Right Ear */}
                        <G {...(isAndroid ? {} : { animatedProps: earRightProps })}>
                            <Path d="M 145 60 C 180 60, 190 120, 160 135 C 145 142, 135 120, 140 70" fill={color} />
                            <Path d="M 155 80 C 165 80, 170 110, 155 120" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
                        </G>

                        {/* FACE BASE - Soft Oval */}
                        <Ellipse cx="100" cy="100" rx="55" ry="48" fill={color} />

                        {/* Cheeks - Add width */}
                        <Circle cx="100" cy="110" r="52" fill={color} />


                        {/* MUZZLE & NOSE - Lower down */}
                        <G transform={`translate(0, 15)`}>
                            {/* Muzzle Patch - Lighter */}
                            <Ellipse cx="100" cy="112" rx="20" ry="14" fill="#FFFBEB" />

                            {/* Nose - Heart Shape */}
                            <Path d="M 94 108 C 94 105, 106 105, 106 108 L 100 114 Z" fill="#5D4037" strokeLinejoin="round" />

                            {/* Mouth */}
                            {(mood === 'happy' || mood === 'loved' || mood === 'excited') && (
                                <Path d="M 100 114 L 100 118 M 95 116 Q 100 124 105 116" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" fill="none" />
                            )}
                            {(mood === 'neutral' || mood === 'sleepy') && (
                                <Path d="M 100 114 L 100 118 M 96 118 Q 100 118 104 118" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" fill="none" />
                            )}
                            {mood === 'sad' && (
                                <Path d="M 96 122 Q 100 118 104 122" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" fill="none" />
                            )}
                        </G>

                        {/* EYES - Low and Wide */}
                        <G transform={`translate(0, ${100 + faceYOffset}) translate(100, ${100 + faceYOffset}) scale(${eyeScale}) translate(-100, -${100 + faceYOffset})`}>
                            <G {...(isAndroid ? {} : { animatedProps: blinkProps })}>
                                {mood === 'happy' ? (
                                    <>
                                        {/* Happy Arches */}
                                        <Path d={`M ${leftEyeX - 6} ${100 + faceYOffset - 4} Q ${leftEyeX} ${100 + faceYOffset - 12} ${leftEyeX + 6} ${100 + faceYOffset - 4}`} stroke="#4E342E" strokeWidth="3" fill="none" strokeLinecap="round" />
                                        <Path d={`M ${rightEyeX - 6} ${100 + faceYOffset - 4} Q ${rightEyeX} ${100 + faceYOffset - 12} ${rightEyeX + 6} ${100 + faceYOffset - 4}`} stroke="#4E342E" strokeWidth="3" fill="none" strokeLinecap="round" />
                                    </>
                                ) : mood === 'loved' ? (
                                    <>
                                        {/* Heart Eyes 😍 */}
                                        <Path d={`M ${leftEyeX} ${100 + faceYOffset + 3} l -4 -4 q -2 -2 0 -4 q 2 -2 4 0 q 2 -2 4 0 q 2 2 0 4 z`} fill="#E05263" transform={`scale(1.1) translate(${leftEyeX * -0.1 + 8}, ${-(100 + faceYOffset) * 0.1})`} />
                                        <Path d={`M ${rightEyeX} ${100 + faceYOffset + 3} l -4 -4 q -2 -2 0 -4 q 2 -2 4 0 q 2 -2 4 0 q 2 2 0 4 z`} fill="#E05263" transform={`scale(1.1) translate(${rightEyeX * -0.1 - 8}, ${-(100 + faceYOffset) * 0.1})`} />
                                    </>
                                ) : mood === 'excited' ? (
                                    <>
                                        {/* Star Eyes 🤩 */}
                                        <Path d={`M ${leftEyeX} ${100 + faceYOffset - 8} L ${leftEyeX + 2} ${100 + faceYOffset - 2} L ${leftEyeX + 8} ${100 + faceYOffset} L ${leftEyeX + 2} ${100 + faceYOffset + 2} L ${leftEyeX} ${100 + faceYOffset + 8} L ${leftEyeX - 2} ${100 + faceYOffset + 2} L ${leftEyeX - 8} ${100 + faceYOffset} L ${leftEyeX - 2} ${100 + faceYOffset - 2} Z`} fill="#F4D35E" />
                                        <Path d={`M ${rightEyeX} ${100 + faceYOffset - 8} L ${rightEyeX + 2} ${100 + faceYOffset - 2} L ${rightEyeX + 8} ${100 + faceYOffset} L ${rightEyeX + 2} ${100 + faceYOffset + 2} L ${rightEyeX} ${100 + faceYOffset + 8} L ${rightEyeX - 2} ${100 + faceYOffset + 2} L ${rightEyeX - 8} ${100 + faceYOffset} L ${rightEyeX - 2} ${100 + faceYOffset - 2} Z`} fill="#F4D35E" />
                                    </>
                                ) : mood === 'sleepy' ? (
                                    <>
                                        {/* Closed Sleepy Eyes */}
                                        <Path d={`M ${leftEyeX - 6} ${100 + faceYOffset} Q ${leftEyeX} ${100 + faceYOffset + 4} ${leftEyeX + 6} ${100 + faceYOffset}`} stroke="#4E342E" strokeWidth="2" fill="none" strokeLinecap="round" />
                                        <Path d={`M ${rightEyeX - 6} ${100 + faceYOffset} Q ${rightEyeX} ${100 + faceYOffset + 4} ${rightEyeX + 6} ${100 + faceYOffset}`} stroke="#4E342E" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    </>
                                ) : (
                                    <>
                                        <Circle cx={leftEyeX} cy={100 + faceYOffset} r="8" fill="#4E342E" />
                                        <Circle cx={rightEyeX} cy={100 + faceYOffset} r="8" fill="#4E342E" />

                                        {/* Highlights */}
                                        <Circle cx={leftEyeX + 3} cy={100 + faceYOffset - 3} r="3" fill="white" opacity={0.9} />
                                        <Circle cx={rightEyeX + 3} cy={100 + faceYOffset - 3} r="3" fill="white" opacity={0.9} />
                                    </>
                                )}
                            </G>
                        </G>

                        {/* ACCESSORIES - Adjusted */}
                        <G transform={`translate(0, ${lerp(-30, -35, growthFactor)})`}>
                            <G transform={`translate(100, 50) scale(${accessoryScale}) translate(-100, -50)`}>
                                {accessories.includes('hat_beanie') && (
                                    <G transform="translate(0, 5)">
                                        <HatBeanie color={accessoryColors['hat_beanie']} />
                                    </G>
                                )}
                            </G>
                        </G>

                        <G transform={`translate(0, ${lerp(faceYOffset - 10, faceYOffset + 12, growthFactor)})`}>
                            <G transform={`translate(100, 100) scale(${accessoryScale}) translate(-100, -100)`}>
                                {accessories.includes('glasses') && <GlassesRound color={accessoryColors['glasses']} />}
                            </G>
                        </G>

                        <G transform={`translate(0, ${lerp(25, 35, growthFactor)})`}>
                            <G transform={`translate(100, 130) scale(${accessoryScale}) translate(-100, -130)`}>
                                {accessories.includes('scarf') && <ScarfRed color={accessoryColors['scarf']} />}
                                {accessories.includes('bowtie') && <BowTie color={accessoryColors['bowtie']} />}
                            </G>
                        </G>

                    </G>
                </G>
            </G>
        </Svg>
    );
};
