import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G, Rect, Defs, RadialGradient, Stop, Ellipse, LinearGradient as SvgLinearGradient, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const HORIZON = height * 0.40;

export const ForestRoom = () => {
    return (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
            <Defs>
                <SvgLinearGradient id="forestLight" x1="0" y1="0" x2="0.5" y2="1">
                    <Stop offset="0" stopColor="#E8FFE8" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#C8E6C9" stopOpacity="0" />
                </SvgLinearGradient>
                <RadialGradient id="forestGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor="#E8F5E9" stopOpacity="0.5" />
                    <Stop offset="1" stopColor="#E8F5E9" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Background */}
            <SvgLinearGradient id="forestBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#E8F5E9" />
                <Stop offset="1" stopColor="#C8E6C9" />
            </SvgLinearGradient>
            <Rect x="0" y="0" width={width} height={height} fill="url(#forestBg)" />

            {/* Distant trees */}
            <G opacity={0.3}>
                <Path d={`M -30 ${HORIZON} L 30 ${HORIZON - 120} L 90 ${HORIZON} Z`} fill="#81C784" />
                <Path d={`M 60 ${HORIZON} L 110 ${HORIZON - 100} L 160 ${HORIZON} Z`} fill="#A5D6A7" />
                <Path d={`M ${width - 120} ${HORIZON} L ${width - 70} ${HORIZON - 110} L ${width - 20} ${HORIZON} Z`} fill="#81C784" />
                <Path d={`M ${width - 60} ${HORIZON} L ${width - 20} ${HORIZON - 90} L ${width + 20} ${HORIZON} Z`} fill="#A5D6A7" />
            </G>
            <Rect x={25} y={HORIZON - 10} width={10} height={40} fill="#5D4037" opacity={0.2} />
            <Rect x={105} y={HORIZON - 10} width={8} height={35} fill="#5D4037" opacity={0.2} />
            <Rect x={width - 75} y={HORIZON - 10} width={10} height={40} fill="#5D4037" opacity={0.2} />

            {/* Ground */}
            <Rect x="0" y={HORIZON} width={width} height={height * 0.40} fill="#A5D6A7" opacity={0.6} />
            <Rect x="0" y={HORIZON + 30} width={width} height={height * 0.35} fill="#81C784" opacity={0.4} />

            {[...Array(8)].map((_, i) => (
                <G key={`grass-${i}`} transform={`translate(${30 + i * 50}, ${HORIZON + 50})`}>
                    <Path d="M0 15 Q3 5 5 0 Q7 8 10 15" fill="#66BB6A" opacity={0.5} />
                </G>
            ))}

            {/* Glow */}
            <Ellipse cx={width / 2} cy={height * 0.48} rx={90} ry={70} fill="url(#forestGlow)" />
            <Ellipse cx={width / 2} cy={height * 0.56} rx={45} ry={10} fill="#00000015" />

            {/* Trees */}
            <G transform={`translate(10, ${HORIZON - 160})`}>
                <Rect x={35} y={100} width={30} height={120} fill="#6D4C41" />
                <Rect x={40} y={110} width={5} height={100} fill="#5D4037" opacity={0.5} />
                <Path d="M0 120 L50 30 L100 120 Z" fill="#43A047" />
                <Path d="M10 90 L50 10 L90 90 Z" fill="#66BB6A" />
                <Path d="M20 60 L50 -10 L80 60 Z" fill="#81C784" />
            </G>

            <G transform={`translate(${width - 90}, ${HORIZON - 140})`}>
                <Rect x={30} y={90} width={25} height={100} fill="#6D4C41" />
                <Path d="M0 100 L42 20 L85 100 Z" fill="#388E3C" />
                <Path d="M10 70 L42 0 L75 70 Z" fill="#4CAF50" />
                <Path d="M18 45 L42 -15 L66 45 Z" fill="#66BB6A" />
            </G>

            {/* Mushrooms */}
            <G transform={`translate(${width * 0.18}, ${HORIZON + 60})`}>
                <Ellipse cx={10} cy={25} rx={12} ry={4} fill="#00000010" />
                <Rect x={7} y={12} width={6} height={15} fill="#FFECB3" rx={2} />
                <Ellipse cx={10} cy={10} rx={12} ry={8} fill="#EF5350" />
                <Circle cx={6} cy={7} r={2} fill="#FFEBEE" opacity={0.8} />
                <Circle cx={14} cy={9} r={1.5} fill="#FFEBEE" opacity={0.8} />
            </G>

            <G transform={`translate(${width * 0.75}, ${HORIZON + 75})`}>
                <Ellipse cx={8} cy={22} rx={10} ry={3} fill="#00000010" />
                <Rect x={5} y={10} width={5} height={13} fill="#FFECB3" rx={2} />
                <Ellipse cx={8} cy={8} rx={10} ry={7} fill="#AB47BC" />
                <Circle cx={5} cy={5} r={1.5} fill="#F3E5F5" opacity={0.8} />
                <Circle cx={11} cy={7} r={1} fill="#F3E5F5" opacity={0.8} />
            </G>

            {/* Flowers */}
            {[
                { x: width * 0.35, y: HORIZON + 45, color: '#FFB74D' },
                { x: width * 0.55, y: HORIZON + 55, color: '#F48FB1' },
                { x: width * 0.7, y: HORIZON + 40, color: '#81D4FA' },
            ].map((f, i) => (
                <G key={`flower-${i}`} transform={`translate(${f.x}, ${f.y})`}>
                    <Path d="M3 12 L3 5" stroke="#66BB6A" strokeWidth={2} />
                    <Circle cx={3} cy={3} r={4} fill={f.color} />
                    <Circle cx={3} cy={3} r={2} fill="#FFFDE7" />
                </G>
            ))}

            <Rect x={0} y={0} width={width * 0.5} height={height * 0.4} fill="url(#forestLight)" />

            {[
                { x: width * 0.3, y: height * 0.32 },
                { x: width * 0.65, y: height * 0.28 },
                { x: width * 0.2, y: height * 0.38 },
                { x: width * 0.8, y: height * 0.35 },
            ].map((f, i) => (
                <Circle key={`firefly-${i}`} cx={f.x} cy={f.y} r={3} fill="#FFEE58" opacity={0.6} />
            ))}
        </Svg>
    );
};
