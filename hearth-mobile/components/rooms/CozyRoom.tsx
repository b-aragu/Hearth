import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Defs, RadialGradient, Stop, LinearGradient as SvgLinearGradient, G, Path, Line, Circle, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const HORIZON = height * 0.38;
const FLOOR_Y = HORIZON + 20;

export const CozyRoom = () => {
    return (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
            <Defs>
                <SvgLinearGradient id="warmLight" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFF5E6" stopOpacity="0.6" />
                    <Stop offset="1" stopColor="#FFE0C0" stopOpacity="0" />
                </SvgLinearGradient>
                <SvgLinearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#D4A574" stopOpacity="0.5" />
                    <Stop offset="1" stopColor="#C49A6C" stopOpacity="0.7" />
                </SvgLinearGradient>
                <SvgLinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#FFF8F0" stopOpacity="0.3" />
                    <Stop offset="1" stopColor="#FFE8D6" stopOpacity="0.5" />
                </SvgLinearGradient>
                <RadialGradient id="bunnyGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor="#FFE8CC" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#FFE8CC" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Wall */}
            <Rect x="0" y="0" width={width} height={HORIZON + 40} fill="url(#wallGrad)" />

            {/* Heart Pattern */}
            {[...Array(12)].map((_, i) => (
                <G key={`heart-${i}`} transform={`translate(${30 + (i % 4) * 100}, ${40 + Math.floor(i / 4) * 50})`}>
                    <Path d="M0 3 C0 0 3 0 3 2 C3 0 6 0 6 3 C6 6 3 8 3 10 C3 8 0 6 0 3 Z" fill="#F5D0C5" opacity={0.25} scale={0.8} />
                </G>
            ))}

            {/* Window */}
            <G transform={`translate(${width * 0.08}, ${HORIZON - 160})`}>
                <Rect x={4} y={4} width={75} height={110} fill="#00000010" rx={6} />
                <Rect x={0} y={0} width={75} height={110} fill="#E8DFD5" rx={6} />
                <Rect x={6} y={6} width={63} height={98} fill="#D4C8BC" rx={4} />
                <Rect x={10} y={10} width={55} height={42} fill="#87CEEB" rx={2} />
                <Rect x={10} y={56} width={55} height={42} fill="#A8D8EA" rx={2} />
                <Circle cx={25} cy={25} r={8} fill="#FFF" opacity={0.9} />
                <Circle cx={35} cy={28} r={6} fill="#FFF" opacity={0.8} />
                <Circle cx={45} cy={70} r={7} fill="#FFF" opacity={0.7} />
                <Line x1={10} y1={52} x2={65} y2={52} stroke="#C4B8AC" strokeWidth={4} />
                <Line x1={37} y1={10} x2={37} y2={98} stroke="#C4B8AC" strokeWidth={4} />
                <Path d="M0 0 Q-15 55 0 110" fill="#F8E8DC" opacity={0.6} />
                <Path d="M75 0 Q90 55 75 110" fill="#F8E8DC" opacity={0.6} />
            </G>

            {/* Shelf */}
            <G transform={`translate(${width * 0.68}, ${HORIZON - 130})`}>
                <Rect x={3} y={23} width={90} height={12} fill="#00000015" rx={3} />
                <Rect x={0} y={20} width={90} height={10} fill="#B8A090" rx={3} />
                <Rect x={8} y={2} width={12} height={18} fill="#E8A0A0" rx={2} />
                <Rect x={22} y={5} width={10} height={15} fill="#A0C8E0" rx={2} />
                <Rect x={34} y={3} width={11} height={17} fill="#C8E0A0" rx={2} />
                <Rect x={52} y={4} width={16} height={16} fill="#D4C0B0" rx={1} />
                <Rect x={54} y={6} width={12} height={12} fill="#FFE0D0" rx={1} />
                <Circle cx={60} cy={12} r={4} fill="#E0B0A0" />
                <Rect x={74} y={10} width={10} height={10} fill="#C8A080" rx={2} />
                <Circle cx={79} cy={6} r={6} fill="#7CB342" />
                <Circle cx={75} cy={8} r={4} fill="#8BC34A" />
            </G>

            {/* Frame */}
            <G transform={`translate(${width * 0.42}, ${HORIZON - 110})`}>
                <Rect x={3} y={3} width={54} height={44} fill="#00000010" rx={3} />
                <Rect x={0} y={0} width={54} height={44} fill="#C8B0A0" rx={3} />
                <Rect x={5} y={5} width={44} height={34} fill="#E8D8C8" rx={2} />
                <Rect x={8} y={8} width={38} height={28} fill="#FFF0E8" rx={2} />
                <Path d="M27 14 C27 10 22 10 22 14 C22 18 27 24 27 28 C27 24 32 18 32 14 C32 10 27 10 27 14 Z" fill="#E8A0A0" opacity={0.7} />
            </G>

            {/* Floor */}
            <Rect x={0} y={HORIZON} width={width} height={8} fill="#C4A484" opacity={0.6} />
            <Rect x={0} y={FLOOR_Y} width={width} height={height * 0.40} fill="url(#floorGrad)" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <Line key={`board-${i}`} x1={0} y1={FLOOR_Y + i * 25} x2={width} y2={FLOOR_Y + i * 25} stroke="#C49060" strokeWidth={1} opacity={0.2} />
            ))}

            {/* Rug */}
            <G transform={`translate(${width / 2}, ${height * 0.52})`}>
                <Ellipse cx={0} cy={8} rx={width * 0.32} ry={28} fill="#00000010" />
                <Ellipse cx={0} cy={0} rx={width * 0.30} ry={24} fill="#D4847C" opacity={0.5} />
                <Ellipse cx={0} cy={0} rx={width * 0.24} ry={18} fill="#E8A090" opacity={0.4} />
                <Ellipse cx={0} cy={0} rx={width * 0.18} ry={12} fill="#F0B8A8" opacity={0.5} />
                <Circle cx={0} cy={0} r={20} fill="#F8C8B8" opacity={0.4} />
            </G>

            {/* Glow */}
            <Ellipse cx={width / 2} cy={height * 0.45} rx={100} ry={80} fill="url(#bunnyGlow)" />
            <Ellipse cx={width / 2} cy={height * 0.52} rx={50} ry={12} fill="#00000012" />

            {/* Plant */}
            <G transform={`translate(${width * 0.82}, ${HORIZON + 10})`}>
                <Ellipse cx={28} cy={95} rx={32} ry={8} fill="#00000015" />
                <Path d="M8 40 L4 85 Q28 95 52 85 L48 40 Q28 35 8 40 Z" fill="#C67D5E" />
                <Ellipse cx={28} cy={40} rx={22} ry={8} fill="#D4896A" />
                <Path d="M10 40 L6 48 Q28 55 50 48 L46 40" fill="#B86E4C" opacity={0.5} />
                <Ellipse cx={28} cy={42} rx={18} ry={6} fill="#5D4037" />
                <Path d="M28 42 Q10 20 15 -10 Q28 0 30 42" fill="#66BB6A" />
                <Path d="M28 42 Q45 15 50 -5 Q28 5 26 42" fill="#4CAF50" />
                <Path d="M28 42 Q0 30 -5 10 Q20 15 28 42" fill="#81C784" />
                <Path d="M28 42 Q55 25 60 15 Q35 20 28 42" fill="#43A047" />
                <Path d="M28 42 Q25 10 30 -15 Q32 10 28 42" fill="#2E7D32" />
            </G>

            {/* Lamp */}
            <G transform={`translate(${width * 0.05}, ${HORIZON + 30})`}>
                <Ellipse cx={20} cy={65} rx={18} ry={5} fill="#00000010" />
                <Ellipse cx={20} cy={60} rx={14} ry={4} fill="#D4C0A8" />
                <Rect x={16} y={35} width={8} height={25} fill="#C8B498" />
                <Path d="M5 35 L10 10 L30 10 L35 35 Z" fill="#FFF8E8" opacity={0.9} />
                <Ellipse cx={20} cy={10} rx={10} ry={4} fill="#FFF0D8" opacity={0.8} />
                <Circle cx={20} cy={20} r={18} fill="#FFFBE8" opacity={0.3} />
            </G>

            {/* Sparkles */}
            {[
                { x: width * 0.25, y: height * 0.35, size: 3 },
                { x: width * 0.75, y: height * 0.32, size: 2 },
                { x: width * 0.5, y: height * 0.28, size: 2.5 },
                { x: width * 0.15, y: height * 0.42, size: 2 },
                { x: width * 0.85, y: height * 0.38, size: 2.5 },
            ].map((spark, i) => (
                <G key={`spark-${i}`}>
                    <Line x1={spark.x - spark.size} y1={spark.y} x2={spark.x + spark.size} y2={spark.y} stroke="#F0D0C0" strokeWidth={1} opacity={0.5} />
                    <Line x1={spark.x} y1={spark.y - spark.size} x2={spark.x} y2={spark.y + spark.size} stroke="#F0D0C0" strokeWidth={1} opacity={0.5} />
                </G>
            ))}

            {/* Lighting */}
            <Rect x={0} y={0} width={width * 0.6} height={height * 0.5} fill="url(#warmLight)" />
            <Rect x={0} y={0} width={30} height={height} fill="#00000008" />
            <Rect x={width - 30} y={0} width={30} height={height} fill="#00000008" />

            <Path
                d={`M ${width / 2 - 60} ${height * 0.35} 
                     Q ${width / 2} ${height * 0.30} ${width / 2 + 60} ${height * 0.35}
                     L ${width / 2 + 50} ${height * 0.55}
                     Q ${width / 2} ${height * 0.58} ${width / 2 - 50} ${height * 0.55} Z`}
                fill="#FFFBE8"
                opacity={0.08}
            />
        </Svg>
    );
};
