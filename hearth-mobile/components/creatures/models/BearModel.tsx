import React from 'react';
import Svg, { Circle, Path, G, Rect, Line } from 'react-native-svg';
import Animated, { useAnimatedProps, useAnimatedStyle, SharedValue } from 'react-native-reanimated';

import { Platform } from 'react-native';

// Animated components
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

import {
    GlassesRound, HatBeanie, ScarfRed, BowTie,
    Crown, Flower, HeartsHeadband, TopHat, Sunglasses, Monocle, Necklace, Cape, Backpack
} from '../parts/Accessories';

interface BearProps {
    mood: 'happy' | 'sad' | 'sleepy' | 'neutral';
    breathing: SharedValue<number>;
    blink: SharedValue<number>;
    color?: string;
    accessories?: string[];
    growthFactor?: number; // 0.0 (Baby) -> 1.0 (Adult)
    accessoryColors?: Record<string, string>; // Map of accessory ID -> Color
}

// Linear Interpolation Helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const isWeb = Platform.OS === 'web';

export const BearModel = ({ mood, breathing, blink, color = '#E6CBA8', accessories = [], growthFactor = 0, accessoryColors = {} }: BearProps) => {
    const isAndroid = Platform.OS === 'android';

    // --- NEOTENY CALCULATIONS ---
    // Baby (0.0) -> Adult (1.0)

    // HEAD: Huge relative to body
    const headScale = lerp(1.15, 1.0, growthFactor);
    // BODY: Small and round
    const bodyScale = lerp(0.85, 1.0, growthFactor);

    // NECK: Subtle squash, don't overdo it
    const headYOffset = lerp(4, 0, growthFactor);

    // MUZZLE: Small and cute - LOWERED to fit eyes
    const muzzleScale = lerp(0.8, 1.0, growthFactor);
    const muzzleY = lerp(132, 115, growthFactor);

    // EYES: Big but balanced
    const eyeScale = lerp(1.25, 1.0, growthFactor);
    // Lower them DRASTICALLY for the "baby" look (Eyes low on face)
    const eyeYOffset = lerp(32, 0, growthFactor);
    const eyeSpacing = lerp(0.85, 1.0, growthFactor); // Babies have eyes closer relative to huge head

    // EARS: Just slightly lower
    const earY = lerp(88, 75, growthFactor);
    const earXOffset = lerp(2, 0, growthFactor);
    const earScale = lerp(1.05, 1.0, growthFactor);

    // ACCESSORIES: Scale DOWN for Baby (to match body, counteract head scale)
    const accessoryScale = lerp(0.74, 1.0, growthFactor);

    // Derived Eye X positions
    const leftEyeX = 100 - (20 * eyeSpacing);
    const rightEyeX = 100 + (20 * eyeSpacing);

    // ----------------------------

    // Whole Creature Animation (Breathing/Bouncing)
    // We animate the whole group to keep parts attached
    const creatureProps = useAnimatedProps(() => {
        const transY = breathing.value * -5;
        if (isWeb) {
            return { transform: `translate(0, ${transY})` };
        }
        return {
            transform: [
                { translateY: transY } // Simple bounce up/down
            ]
        };
    });

    const blinkProps = useAnimatedProps(() => {
        const scaleY = 1 - blink.value;
        if (isWeb) {
            return { transform: `scale(1, ${scaleY})` };
        }
        return {
            transform: [
                { scaleY: scaleY }
            ]
        };
    });

    return (
        <Svg viewBox="0 0 200 300" width={200} height={300}>
            {/* Wrapper to match old viewBox -40 offset */}
            <G transform="translate(0, 40)">
                {/* SHADOW - Centered and scaled */}
                <Circle cx="100" cy="175" r={40 * bodyScale} fill="rgba(69, 58, 43, 0.1)" transform={`translate(100, 175) scale(${1 + (1 - growthFactor) * 0.2}) translate(-100, -175)`} />

                <G {...(isAndroid ? {} : { animatedProps: creatureProps })}>

                    {/* BACK LAYER (Cape, Backpack) */}
                    <G transform={`translate(0, -15) translate(100, 160) scale(${bodyScale}) translate(-100, -160)`}>
                        {accessories.includes('cape') && <Cape color={accessoryColors['cape']} />}
                        {accessories.includes('backpack') && <Backpack color={accessoryColors['backpack']} />}
                    </G>

                    {/* BODY GROUP -> Scaled by Age */}
                    <G transform={`translate(0, -15) translate(100, 160) scale(${bodyScale}) translate(-100, -160)`}>
                        {/* Main Body */}
                        <Circle cx="100" cy="160" r="42" fill={color} />
                        {/* Belly Patch */}
                        <Circle cx="100" cy="160" r="28" fill="#F8EADB" opacity={0.6} />

                        {/* FEET / PAWS (Bottom) */}
                        <Circle cx="75" cy="190" r="14" fill={color} />
                        <Circle cx="75" cy="190" r="8" fill="#F8EADB" opacity={0.6} />

                        <Circle cx="125" cy="190" r="14" fill={color} />
                        <Circle cx="125" cy="190" r="8" fill="#F8EADB" opacity={0.6} />

                        {/* ARMS (Side) - Simple nubbins */}
                        <Circle cx="58" cy="150" r={12} fill={color} />
                        <Circle cx="142" cy="150" r={12} fill={color} />
                    </G>

                    {/* HEAD GROUP -> Scaled significantly for Baby Look */}
                    {/* Pivot is neck area (approx 100, 140) to keep it attached */}
                    {/* headYOffset pushes head down into body for "no neck" look */}
                    <G transform={`translate(0, ${-25 + headYOffset}) translate(100, 130) scale(${headScale}) translate(-100, -130)`}>
                        {/* EARS - Dynamic Position */}
                        <G transform={`translate(100, 100) scale(${earScale}) translate(-100, -100)`}>
                            <Circle cx={55 - earXOffset} cy={earY} r="22" fill={color} />
                            <Circle cx={145 + earXOffset} cy={earY} r="22" fill={color} />
                            <Circle cx={55 - earXOffset} cy={earY} r="12" fill="#D4B08C" />
                            <Circle cx={145 + earXOffset} cy={earY} r="12" fill="#D4B08C" />
                        </G>

                        {/* FACE BASE */}
                        <Circle cx="100" cy="100" r="55" fill={color} />

                        {/* MUZZLE - Scaled Down for Baby */}
                        {/* Using explicit muzzleY now instead of attaching to eyes */}
                        <G transform={`translate(0, ${muzzleY - 115}) translate(100, 115) scale(${muzzleScale}) translate(-100, -115)`}>
                            <Circle cx="100" cy="115" r="20" fill="#F8EADB" />
                            <Circle cx="100" cy="110" r="8" fill="#4A3B32" />

                            {/* MOOD EYEBROWS */}
                            {mood === 'sad' && (
                                <G transform={`translate(0, -5)`}>
                                    <Path d={`M ${leftEyeX - 5} ${95 + eyeYOffset - 8} L ${leftEyeX + 4} ${95 + eyeYOffset - 12}`} stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
                                    <Path d={`M ${rightEyeX + 5} ${95 + eyeYOffset - 8} L ${rightEyeX - 4} ${95 + eyeYOffset - 12}`} stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
                                </G>
                            )}
                            {mood === 'happy' && (
                                <G transform={`translate(0, -5)`}>
                                    <Path d={`M ${leftEyeX - 4} ${95 + eyeYOffset - 10} Q ${leftEyeX} ${95 + eyeYOffset - 14} ${leftEyeX + 4} ${95 + eyeYOffset - 10}`} stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
                                    <Path d={`M ${rightEyeX - 4} ${95 + eyeYOffset - 10} Q ${rightEyeX} ${95 + eyeYOffset - 14} ${rightEyeX + 4} ${95 + eyeYOffset - 10}`} stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" opacity={0.6} />
                                </G>
                            )}

                            {/* MOUTH - Dynamic based on Mood */}
                            {mood === 'happy' && (
                                <Path d="M 94 125 Q 100 132 106 125" stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            )}
                            {mood === 'sad' && (
                                // Deeper frown
                                <Path d="M 94 130 Q 100 120 106 130" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" fill="none" />
                            )}
                            {mood === 'sleepy' && (
                                <Circle cx="100" cy="126" r="2" fill="#4A3B32" opacity={0.6} />
                            )}
                            {mood === 'neutral' && (
                                <Path d="M 98 126 L 102 126" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" />
                            )}
                        </G>

                        {/* EYES - Dynamic Position & Size */}
                        <G transform={`translate(0, ${95 + eyeYOffset}) translate(100, ${95 + eyeYOffset}) scale(${eyeScale}) translate(-100, -${95 + eyeYOffset})`}>
                            {/* Container for Eyes */}
                            <G {...(isAndroid ? {} : { animatedProps: blinkProps })}>
                                <G transform={`translate(0, -${95 + eyeYOffset})`}>
                                    {mood === 'happy' ? (
                                        <>
                                            {/* Arched Happy Eyes ^ ^ (Thicker & Wider) */}
                                            <Path d={`M ${leftEyeX - 7} ${95 + eyeYOffset + 3} Q ${leftEyeX} ${95 + eyeYOffset - 7} ${leftEyeX + 7} ${95 + eyeYOffset + 3}`} stroke="#4A3B32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                                            <Path d={`M ${rightEyeX - 7} ${95 + eyeYOffset + 3} Q ${rightEyeX} ${95 + eyeYOffset - 7} ${rightEyeX + 7} ${95 + eyeYOffset + 3}`} stroke="#4A3B32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                                        </>
                                    ) : mood === 'sleepy' ? (
                                        <>
                                            {/* Sleepy: Half-Lidded Eyes (Droopy look) */}
                                            {/* Base Eyes */}
                                            <Circle cx={leftEyeX} cy={95 + eyeYOffset} r="6" fill="#4A3B32" />
                                            <Circle cx={rightEyeX} cy={95 + eyeYOffset} r="6" fill="#4A3B32" />

                                            {/* Heavy Lids (Skin color cover) - Animated by blink technically, but distinct style */}
                                            {/* We simply draw a rectangle over the top half of the eye matching the head color */}
                                            <Rect x={leftEyeX - 8} y={95 + eyeYOffset - 8} width="16" height="9" fill={color} />
                                            <Rect x={rightEyeX - 8} y={95 + eyeYOffset - 8} width="16" height="9" fill={color} />

                                            {/* Lid Line to show they are heavy */}
                                            <Line x1={leftEyeX - 6} y1={95 + eyeYOffset + 1} x2={leftEyeX + 6} y2={95 + eyeYOffset + 1} stroke="#4A3B32" strokeWidth="1" opacity={0.5} />
                                            <Line x1={rightEyeX - 6} y1={95 + eyeYOffset + 1} x2={rightEyeX + 6} y2={95 + eyeYOffset + 1} stroke="#4A3B32" strokeWidth="1" opacity={0.5} />
                                        </>
                                    ) : (
                                        <>
                                            {/* Neutral/Sad Eyes (Standard Dots) */}
                                            <Circle cx={leftEyeX} cy={95 + eyeYOffset} r="6" fill="#4A3B32" />
                                            <Circle cx={leftEyeX + 2} cy={95 + eyeYOffset - 2} r="2" fill="white" opacity={0.6} />

                                            <Circle cx={rightEyeX} cy={95 + eyeYOffset} r="6" fill="#4A3B32" />
                                            <Circle cx={rightEyeX + 2} cy={95 + eyeYOffset - 2} r="2" fill="white" opacity={0.6} />

                                            {/* Sad Tear */}
                                            {mood === 'sad' && (
                                                <Circle cx={rightEyeX + 6} cy={95 + eyeYOffset + 6} r="3" fill="#A0D8EF" />
                                            )}
                                        </>
                                    )}
                                </G>
                            </G>
                        </G>

                        {/* ACCESSORIES - Layered Correctly */}

                        {/* 1. Forehead (Hats) */}
                        {/* Baby: -15, Adult: -25 (Moves higher as it scales) */}
                        <G transform={`translate(0, ${lerp(-15, -25, growthFactor)})`}>
                            <G transform={`translate(100, 50) scale(${accessoryScale}) translate(-100, -50)`}>
                                {accessories.includes('hat_beanie') && <HatBeanie color={accessoryColors['hat_beanie']} />}
                                {accessories.includes('crown') && <Crown color={accessoryColors['crown']} />}
                                {accessories.includes('flower') && <Flower color={accessoryColors['flower']} />}
                                {accessories.includes('hearts_headband') && <HeartsHeadband color={accessoryColors['hearts_headband']} />}
                                {accessories.includes('top_hat') && <TopHat color={accessoryColors['top_hat']} />}
                            </G>
                        </G>

                        {/* 2. Eye Level (Glasses) */}
                        {/* Baby: Larger scale (0.85), moves higher as it scales */}
                        <G transform={`translate(0, ${lerp(eyeYOffset - 30, eyeYOffset + 7, growthFactor)})`}>
                            <G transform={`translate(100, 100) scale(${accessoryScale}) translate(-100, -100)`}>
                                {accessories.includes('glasses') && <GlassesRound color={accessoryColors['glasses']} />}
                                {accessories.includes('sunglasses') && <Sunglasses color={accessoryColors['sunglasses']} />}
                                {accessories.includes('monocle') && <Monocle color={accessoryColors['monocle']} />}
                            </G>
                        </G>

                        {/* 3. Neck Level (Scarves/Ties) */}
                        {/* Baby: Move Scarf UP (+15) to neck. Adult (+25) */}
                        <G transform={`translate(0, ${lerp(15, 25, growthFactor)})`}>
                            <G transform={`translate(100, 130) scale(${accessoryScale}) translate(-100, -130)`}>
                                {accessories.includes('scarf') && <ScarfRed color={accessoryColors['scarf']} />}

                                {accessories.includes('bowtie') && <BowTie color={accessoryColors['bowtie']} />}
                                {accessories.includes('necklace') && <Necklace color={accessoryColors['necklace']} />}
                            </G>
                        </G>
                    </G>
                </G>
            </G>

        </Svg >
    );
};
