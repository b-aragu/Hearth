import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G, Rect, Defs, RadialGradient, Stop, Ellipse, LinearGradient as SvgLinearGradient, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const HORIZON = height * 0.40;

export const BeachRoom = () => {
    return (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
            <Defs>
                <SvgLinearGradient id="sunGlow" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFF8E1" stopOpacity="0.5" />
                    <Stop offset="1" stopColor="#FFF8E1" stopOpacity="0" />
                </SvgLinearGradient>
                <SvgLinearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#4DD0E1" stopOpacity="0.7" />
                    <Stop offset="1" stopColor="#00ACC1" stopOpacity="0.5" />
                </SvgLinearGradient>
                <RadialGradient id="beachGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor="#FFF8E1" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#FFF8E1" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Sky */}
            <SvgLinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#E0F7FA" />
                <Stop offset="1" stopColor="#B2EBF2" />
            </SvgLinearGradient>
            <Rect x="0" y="0" width={width} height={height} fill="url(#skyGrad)" />

            {/* Sun */}
            <Circle cx={70} cy={80} r={80} fill="url(#sunGlow)" />
            <Circle cx={70} cy={80} r={35} fill="#FFEB3B" opacity={0.95} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <Line
                    key={`ray-${i}`}
                    x1={70 + Math.cos(angle * Math.PI / 180) * 45}
                    y1={80 + Math.sin(angle * Math.PI / 180) * 45}
                    x2={70 + Math.cos(angle * Math.PI / 180) * 60}
                    y2={80 + Math.sin(angle * Math.PI / 180) * 60}
                    stroke="#FFEB3B"
                    strokeWidth={3}
                    opacity={0.6}
                />
            ))}

            {/* Clouds */}
            <G opacity={0.6}>
                <Circle cx={width * 0.6} cy={60} r={25} fill="#FFF" />
                <Circle cx={width * 0.65} cy={55} r={20} fill="#FFF" />
                <Circle cx={width * 0.55} cy={65} r={18} fill="#FFF" />
            </G>

            {/* Ocean */}
            <Rect x="0" y={HORIZON - 20} width={width} height={80} fill="url(#oceanGrad)" />
            <Path d={`M 0 ${HORIZON + 30} Q ${width * 0.15} ${HORIZON + 20} ${width * 0.3} ${HORIZON + 30} T ${width * 0.6} ${HORIZON + 30} T ${width} ${HORIZON + 25}`} fill="#4DD0E1" opacity={0.5} />
            <Path d={`M 0 ${HORIZON + 50} Q ${width * 0.2} ${HORIZON + 35} ${width * 0.4} ${HORIZON + 50} T ${width * 0.8} ${HORIZON + 45} T ${width} ${HORIZON + 55}`} fill="#E0F7FA" opacity={0.6} />

            {/* Sand */}
            <Path d={`M 0 ${HORIZON + 55} Q ${width * 0.25} ${HORIZON + 40} ${width * 0.5} ${HORIZON + 50} T ${width} ${HORIZON + 60} V ${height} H 0 Z`} fill="#FFE0B2" />
            <Path d={`M 0 ${HORIZON + 70} L 0 ${height} L ${width} ${height} L ${width} ${HORIZON + 75} Q ${width * 0.5} ${HORIZON + 60} 0 ${HORIZON + 70}`} fill="#FFCC80" opacity={0.5} />

            {/* Glow */}
            <Ellipse cx={width / 2} cy={height * 0.48} rx={90} ry={70} fill="url(#beachGlow)" />
            <Ellipse cx={width / 2} cy={height * 0.56} rx={45} ry={10} fill="#00000012" />

            {/* Palm */}
            <G transform={`translate(25, ${HORIZON - 80})`}>
                <Path d="M30 200 Q25 100 35 40" stroke="#8D6E63" strokeWidth={12} fill="none" />
                <Path d="M30 200 Q25 100 35 40" stroke="#795548" strokeWidth={8} fill="none" />
                {[60, 90, 120, 150, 180].map((y, i) => (
                    <Path key={`tl-${i}`} d={`M${25 + i} ${y} Q30 ${y - 3} ${35 - i} ${y}`} stroke="#6D4C41" strokeWidth={1} fill="none" opacity={0.5} />
                ))}
                <Path d="M35 40 Q15 20 -20 35" stroke="#4CAF50" strokeWidth={4} fill="none" />
                <Path d="M35 40 Q55 15 85 25" stroke="#4CAF50" strokeWidth={4} fill="none" />
                <Path d="M35 40 Q30 5 25 -20" stroke="#66BB6A" strokeWidth={4} fill="none" />
                <Path d="M35 40 Q50 30 70 50" stroke="#66BB6A" strokeWidth={4} fill="none" />
                <Path d="M35 40 Q20 35 0 55" stroke="#81C784" strokeWidth={4} fill="none" />
                <Circle cx={32} cy={50} r={6} fill="#795548" />
                <Circle cx={42} cy={48} r={5} fill="#6D4C41" />
            </G>

            {/* Umbrella */}
            <G transform={`translate(${width - 90}, ${HORIZON + 30})`}>
                <Ellipse cx={30} cy={60} rx={35} ry={8} fill="#00000015" />
                <Rect x={28} y={-10} width={4} height={75} fill="#8D6E63" />
                <Path d="M-10 0 Q30 -40 70 0" fill="#EF5350" />
                <Path d="M0 -2 Q30 -35 60 -2" fill="#FFCDD2" opacity={0.5} />
            </G>

            {/* Props */}
            <G transform={`translate(${width * 0.35}, ${HORIZON + 80})`}>
                <Path d="M0 -8 L2 -2 L8 -2 L3 2 L5 8 L0 4 L-5 8 L-3 2 L-8 -2 L-2 -2 Z" fill="#FF8A65" />
            </G>
            <G transform={`translate(${width * 0.55}, ${HORIZON + 90})`}>
                <Ellipse cx={0} cy={0} rx={8} ry={5} fill="#FFCCBC" />
                <Path d="M-6 0 Q0 -5 6 0" stroke="#FFAB91" strokeWidth={1} fill="none" />
            </G>
            <G transform={`translate(${width * 0.65}, ${HORIZON + 65})`}>
                <Path d="M0 20 L5 0 L25 0 L30 20 Z" fill="#42A5F5" />
                <Rect x={3} y={0} width={24} height={5} fill="#1E88E5" rx={2} />
                <Path d="M8 0 Q15 -10 22 0" stroke="#90CAF9" strokeWidth={2} fill="none" />
            </G>
        </Svg>
    );
};
