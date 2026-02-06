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

export const Crown = ({ color = '#FFD700' }: { color?: string }) => (
    <G>
        <Path d="M 65 72 L 65 45 L 82.5 58 L 100 35 L 117.5 58 L 135 45 L 135 72 Z" fill={color} stroke="#DAA520" strokeWidth="2" />
        <Circle cx="65" cy="45" r="3" fill="#DAA520" />
        <Circle cx="100" cy="35" r="3" fill="#DAA520" />
        <Circle cx="135" cy="45" r="3" fill="#DAA520" />
    </G>
);

export const Flower = ({ color = '#FF69B4' }: { color?: string }) => (
    <G transform="translate(135, 60)">
        <Circle cx="0" cy="0" r="5" fill="#FFFF00" />
        <Circle cx="0" cy="-8" r="6" fill={color} />
        <Circle cx="7" cy="-4" r="6" fill={color} />
        <Circle cx="7" cy="4" r="6" fill={color} />
        <Circle cx="0" cy="8" r="6" fill={color} />
        <Circle cx="-7" cy="4" r="6" fill={color} />
        <Circle cx="-7" cy="-4" r="6" fill={color} />
    </G>
);

export const HeartsHeadband = ({ color = '#FF69B4' }: { color?: string }) => (
    <G>
        <Path d="M 60 80 Q 100 60 140 80" stroke="#FFC0CB" strokeWidth="4" fill="none" />
        <G transform="translate(80, 68) rotate(-15)">
            <Path d="M 0 0 C -5 -5, -10 0, 0 8 C 10 0, 5 -5, 0 0" fill={color} />
        </G>
        <G transform="translate(120, 68) rotate(15)">
            <Path d="M 0 0 C -5 -5, -10 0, 0 8 C 10 0, 5 -5, 0 0" fill={color} />
        </G>
    </G>
);

export const TopHat = ({ color = '#333' }: { color?: string }) => (
    <G>
        <Rect x="70" y="35" width="60" height="40" fill={color} />
        <Rect x="60" y="75" width="80" height="5" fill={color} />
        <Rect x="70" y="65" width="60" height="10" fill="#555" />
    </G>
);

export const Sunglasses = ({ color = '#333' }: { color?: string }) => (
    <G>
        {/* Lenses */}
        <Path d="M 65 85 H 90 Q 90 100 77.5 100 Q 65 100 65 85 Z" fill={color} />
        <Path d="M 110 85 H 135 Q 135 100 122.5 100 Q 110 100 110 85 Z" fill={color} />
        {/* Bridge */}
        <Path d="M 90 85 Q 100 80 110 85" stroke={color} strokeWidth="3" fill="none" />
        {/* Arms */}
        <Path d="M 65 85 L 50 82" stroke={color} strokeWidth="3" />
        <Path d="M 135 85 L 150 82" stroke={color} strokeWidth="3" />
    </G>
);

export const Monocle = ({ color = '#FFD700' }: { color?: string }) => (
    <G>
        <Circle cx="125" cy="90" r="14" stroke={color} strokeWidth="2" fill="rgba(255,255,255,0.2)" />
        <Path d="M 139 90 L 145 100 L 150 120" stroke={color} strokeWidth="1.5" fill="none" />
    </G>
);

export const Necklace = ({ color = '#FFD700' }: { color?: string }) => (
    <G>
        <Path d="M 75 130 Q 100 155 125 130" stroke={color} strokeWidth="2" fill="none" />
        <Circle cx="100" cy="142" r="5" fill="#FFF" stroke={color} strokeWidth="1" />
    </G>
);

export const Cape = ({ color = '#E63946' }: { color?: string }) => (
    <G>
        <Path d="M 70 130 L 60 200 L 140 200 L 130 130 Q 100 140 70 130 Z" fill={color} />
    </G>
);

export const Backpack = ({ color = '#4682B4' }: { color?: string }) => (
    <G>
        {/* Straps only visible from front usually */}
        <Path d="M 75 130 L 75 160" stroke={color} strokeWidth="6" />
        <Path d="M 125 130 L 125 160" stroke={color} strokeWidth="6" />
        <Rect x="70" y="160" width="60" height="5" fill={color} />
    </G>
);
