import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

export const GlassesRound = ({ color = '#333' }: { color?: string }) => (
    <G>
        {/* Left Lens */}
        <Circle cx="75" cy="90" r="12" stroke={color} strokeWidth="3" fill="rgba(255,255,255,0.3)" />
        {/* Right Lens */}
        <Circle cx="125" cy="90" r="12" stroke={color} strokeWidth="3" fill="rgba(255,255,255,0.3)" />
        {/* Bridge */}
        <Path d="M 87 90 Q 100 80 113 90" stroke={color} strokeWidth="3" fill="none" />
        {/* Temple Arms */}
        <Path d="M 63 90 L 50 85" stroke={color} strokeWidth="3" />
        <Path d="M 137 90 L 150 85" stroke={color} strokeWidth="3" />
    </G>
);

export const HatBeanie = ({ color = '#FF6B6B' }: { color?: string }) => (
    <G>
        {/* Main Beanie Body */}
        <Path d="M 60 70 C 60 30, 140 30, 140 70 L 140 75 L 60 75 Z" fill={color} />
        {/* Cuff */}
        <Rect x="55" y="70" width="90" height="15" rx="5" fill="#E05555" />
        {/* Pom Pom */}
        <Circle cx="100" cy="35" r="10" fill="#E05555" />
    </G>
);

export const ScarfRed = ({ color = '#FF6B6B' }: { color?: string }) => (
    <G>
        <Path d="M 70 130 Q 100 150 130 130" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" />
        <Path d="M 120 130 L 130 160" stroke={color} strokeWidth="15" strokeLinecap="round" />
    </G>
);

export const BowTie = ({ color = '#333' }: { color?: string }) => (
    <G transform="translate(100, 135)">
        <Path d="M 0 0 L -10 -5 L -10 5 Z" fill={color} />
        <Path d="M 0 0 L 10 -5 L 10 5 Z" fill={color} />
        <Circle cx="0" cy="0" r="3" fill={color} />
    </G>
);
