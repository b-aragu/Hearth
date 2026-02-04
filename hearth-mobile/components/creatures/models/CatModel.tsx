import React from 'react';
import Svg, { Circle, Path, G, Polygon, Ellipse, Line, Rect } from 'react-native-svg';
import Animated, { useAnimatedProps, useAnimatedStyle, SharedValue } from 'react-native-reanimated';

import { Platform } from 'react-native';

// Animated components
const AnimatedG = Animated.createAnimatedComponent(G);

import { GlassesRound, HatBeanie, ScarfRed, BowTie } from '../parts/Accessories';

interface CatProps {
    mood: 'happy' | 'sad' | 'sleepy' | 'neutral';
    breathing: SharedValue<number>;
    blink: SharedValue<number>;
    color?: string;
    accessories?: string[];
    growthFactor?: number; // 0.0 (Kitten) -> 1.0 (Adult)
    accessoryColors?: Record<string, string>;
}

// Linear Interpolation Helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const isWeb = Platform.OS === 'web';

export const CatModel = ({ mood, breathing, blink, color = '#E0AFA0', accessories = [], growthFactor = 0, accessoryColors = {} }: CatProps) => {

    // --- NEOTENY CALCULATIONS ---
    const headScale = lerp(1.15, 1.0, growthFactor);
    const bodyScale = lerp(0.9, 1.05, growthFactor); // Bigger body
    const headYOffset = lerp(5, 0, growthFactor);

    // EARS: Normal sized and wide
    const earScale = lerp(1.1, 1.0, growthFactor);

    // FACE
    const eyeScale = lerp(1.2, 1.0, growthFactor);
    const eyeSpacing = lerp(0.9, 1.0, growthFactor);
    const faceYOffset = 15;

    // Derived Eye X positions
    const leftEyeX = 100 - (20 * eyeSpacing);
    const rightEyeX = 100 + (20 * eyeSpacing);

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

    // Tail Sway
    const tailProps = useAnimatedProps(() => {
        const rot = Math.sin(breathing.value * Math.PI) * 15;
        if (isWeb) {
            return { transform: `rotate(${rot}, 130, 170)` } as any;
        }
        return {
            transform: [
                { rotate: `${rot}deg` },
                { translateX: 130 }, { translateY: 170 }, // Pivot point adjustment for rotation
                { translateX: -130 }, { translateY: -170 }
            ]
        } as any;
    });

    return (
        <Svg viewBox="0 -50 200 300" width="100%" height="100%">
            {/* SHADOW */}
            <Circle cx="100" cy="180" r={45 * bodyScale} fill="rgba(69, 58, 43, 0.1)" transform={`translate(100, 175) scale(${1 + (1 - growthFactor) * 0.2}) translate(-100, -175)`} />

            <AnimatedG animatedProps={creatureProps}>

                {/* TAIL - Classic Cat Tail */}
                <AnimatedG animatedProps={tailProps}>
                    <Path d="M 130 170 Q 170 150 160 100" stroke={color} strokeWidth="20" fill="none" strokeLinecap="round" />
                    <Path d="M 130 170 Q 170 150 160 100" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" strokeLinecap="round" />
                </AnimatedG>

                {/* BODY - CHUBBY & ROUND */}
                <G transform={`translate(0, -15) translate(100, 160) scale(${bodyScale}) translate(-100, -160)`}>
                    {/* Main Body - Much wider rx */}
                    <Ellipse cx="100" cy="175" rx="50" ry="45" fill={color} />

                    {/* Belly Patch - Wide */}
                    <Ellipse cx="100" cy="185" rx="30" ry="32" fill="#FFF8F0" opacity={0.6} />

                    {/* FEET - Stubby Paws */}
                    <Circle cx="70" cy="205" r="13" fill={color} />
                    <Circle cx="130" cy="205" r="13" fill={color} />

                    {/* Toe Beans (Detail) */}
                    <Circle cx="70" cy="205" r="5" fill="#F0E0D0" opacity={0.5} />
                    <Circle cx="130" cy="205" r="5" fill="#F0E0D0" opacity={0.5} />

                    {/* ARMS - Resting on belly */}
                    <Circle cx="58" cy="165" r="12" fill={color} />
                    <Circle cx="142" cy="165" r="12" fill={color} />
                </G>

                {/* HEAD GROUP */}
                <G transform={`translate(0, ${-20 + headYOffset}) translate(100, 130) scale(${headScale}) translate(-100, -130)`}>

                    {/* EARS - Definitive Cat Triangles */}
                    {/* Left Ear */}
                    <G transform={`translate(50, 50) scale(${earScale})`}>
                        <Path d="M 10 30 L 30 30 L 20 -15 Z" fill={color} stroke={color} strokeWidth="6" strokeLinejoin="round" />
                        <Path d="M 20 -5 L 14 20 L 26 20 Z" fill="#F4E1D2" opacity={0.7} />
                    </G>
                    {/* Right Ear */}
                    <G transform={`translate(110, 50) scale(${earScale})`}>
                        <Path d="M 10 30 L 30 30 L 20 -15 Z" fill={color} stroke={color} strokeWidth="6" strokeLinejoin="round" />
                        <Path d="M 20 -5 L 14 20 L 26 20 Z" fill="#F4E1D2" opacity={0.7} />
                    </G>

                    {/* FACE BASE - Soft Trapezoid / Loaf shape */}
                    {/* This shape is wider at bottom (cheeks) and slightly flatter on top */}
                    <Path
                        d="M 50 80 Q 50 60 100 60 Q 150 60 150 80 Q 160 110 140 135 Q 100 155 60 135 Q 40 110 50 80 Z"
                        fill={color}
                        stroke={color}
                        strokeWidth="15" // Softens the path
                        strokeLinejoin="round"
                    />


                    {/* MUZZLE & WHISKERS */}
                    <G transform={`translate(0, ${faceYOffset})`}>
                        {/* Nose - Tiny pink triangle */}
                        <Path d="M 96 114 Q 100 117 104 114 L 100 118 Z" fill="#F4E1D2" />

                        {/* Mouth - 'w' */}
                        {mood === 'happy' && (
                            <Path d="M 100 118 L 100 120 M 94 120 Q 97 124 100 121 Q 103 124 106 120" stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        )}
                        {(mood === 'neutral' || mood === 'sleepy') && (
                            <Path d="M 100 118 L 100 120 M 95 121 Q 100 120 105 121" stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        )}
                        {mood === 'sad' && (
                            <Path d="M 96 122 Q 100 119 104 122" stroke="#8A6A5C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        )}

                        {/* Whiskers - Distinctly Cat-like */}
                        <G opacity={0.5}>
                            {/* Left */}
                            <Line x1="85" y1="116" x2="55" y2="112" stroke="#4A3B32" strokeWidth="1.5" strokeLinecap="round" />
                            <Line x1="85" y1="120" x2="55" y2="124" stroke="#4A3B32" strokeWidth="1.5" strokeLinecap="round" />

                            {/* Right */}
                            <Line x1="115" y1="116" x2="145" y2="112" stroke="#4A3B32" strokeWidth="1.5" strokeLinecap="round" />
                            <Line x1="115" y1="120" x2="145" y2="124" stroke="#4A3B32" strokeWidth="1.5" strokeLinecap="round" />
                        </G>
                    </G>

                    {/* EYES - Low */}
                    <G transform={`translate(0, ${100 + faceYOffset}) translate(100, ${100 + faceYOffset}) scale(${eyeScale}) translate(-100, -${100 + faceYOffset})`}>
                        <AnimatedG animatedProps={blinkProps}>
                            <G transform={`translate(0, -${100 + faceYOffset})`}>
                                <Ellipse cx={leftEyeX} cy={100 + faceYOffset} rx="9" ry="9" fill="#4A3B32" />
                                <Ellipse cx={rightEyeX} cy={100 + faceYOffset} rx="9" ry="9" fill="#4A3B32" />

                                {/* Highlights */}
                                <Circle cx={leftEyeX + 3} cy={100 + faceYOffset - 3} r="3" fill="white" opacity={0.9} />
                                <Circle cx={rightEyeX + 3} cy={100 + faceYOffset - 3} r="3" fill="white" opacity={0.9} />

                                {mood === 'sleepy' && (
                                    <>
                                        {/* Eyelids */}
                                        <Rect x={leftEyeX - 10} y={100 + faceYOffset - 9} width="20" height="10" fill={color} />
                                        <Rect x={rightEyeX - 10} y={100 + faceYOffset - 9} width="20" height="10" fill={color} />
                                    </>
                                )}
                            </G>
                        </AnimatedG>
                    </G>

                    {/* ACCESSORIES */}
                    <G transform={`translate(0, ${lerp(-25, -35, growthFactor)})`}>
                        <G transform={`translate(100, 50) scale(${accessoryScale}) translate(-100, -50)`}>
                            {accessories.includes('hat_beanie') && (
                                <G transform="translate(0, -5)">
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
            </AnimatedG>
        </Svg>
    );
};
