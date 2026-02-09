import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G, Rect, Defs, RadialGradient, Stop, Ellipse, LinearGradient as SvgLinearGradient, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const HORIZON = height * 0.40;

export const CloudRoom = () => {
    return (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
            <Defs>
                <RadialGradient id="cloudGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor="#F8BBD0" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#F8BBD0" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            <SvgLinearGradient id="cloudBg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#F3E5F5" />
                <Stop offset="1" stopColor="#E1BEE7" />
            </SvgLinearGradient>
            <Rect x="0" y="0" width={width} height={height} fill="url(#cloudBg)" />

            {/* Background Clouds */}
            <G opacity={0.5}>
                <Circle cx={80} cy={100} r={50} fill="#FFF" />
                <Circle cx={120} cy={90} r={40} fill="#FFF" />
                <Circle cx={50} cy={110} r={35} fill="#FFF" />
            </G>
            <G opacity={0.4}>
                <Circle cx={width - 60} cy={130} r={55} fill="#FFF" />
                <Circle cx={width - 100} cy={120} r={40} fill="#FFF" />
                <Circle cx={width - 30} cy={145} r={35} fill="#FFF" />
            </G>

            {/* Rainbow */}
            <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 180} ${width + 30} ${HORIZON - 30}`} stroke="#FFCDD2" strokeWidth={15} fill="none" opacity={0.3} />
            <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 200} ${width + 30} ${HORIZON - 30}`} stroke="#F8BBD0" strokeWidth={15} fill="none" opacity={0.25} />
            <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 220} ${width + 30} ${HORIZON - 30}`} stroke="#E1BEE7" strokeWidth={15} fill="none" opacity={0.2} />
            <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 240} ${width + 30} ${HORIZON - 30}`} stroke="#B39DDB" strokeWidth={15} fill="none" opacity={0.15} />

            {/* Cloud Floor */}
            <G transform={`translate(0, ${HORIZON - 20})`}>
                <Circle cx={-20} cy={30} r={70} fill="#F8BBD0" opacity={0.4} />
                <Circle cx={80} cy={50} r={90} fill="#E1BEE7" opacity={0.5} />
                <Circle cx={width * 0.5} cy={40} r={100} fill="#F3E5F5" opacity={0.6} />
                <Circle cx={width * 0.7} cy={55} r={80} fill="#F8BBD0" opacity={0.4} />
                <Circle cx={width + 20} cy={35} r={70} fill="#E1BEE7" opacity={0.5} />
            </G>
            <G transform={`translate(0, ${HORIZON + 30})`}>
                <Circle cx={50} cy={40} r={80} fill="#FCE4EC" opacity={0.5} />
                <Circle cx={width * 0.4} cy={50} r={90} fill="#F3E5F5" opacity={0.6} />
                <Circle cx={width - 50} cy={45} r={85} fill="#FCE4EC" opacity={0.5} />
            </G>

            {/* Glow */}
            <Ellipse cx={width / 2} cy={height * 0.46} rx={100} ry={80} fill="url(#cloudGlow)" />
            <Ellipse cx={width / 2} cy={height * 0.55} rx={50} ry={12} fill="#CE93D8" opacity={0.15} />

            {/* Stars */}
            {[
                { x: width * 0.15, y: height * 0.25, size: 10 },
                { x: width * 0.85, y: height * 0.20, size: 12 },
                { x: width * 0.5, y: height * 0.15, size: 8 },
                { x: width * 0.3, y: height * 0.35, size: 6 },
                { x: width * 0.75, y: height * 0.32, size: 7 },
            ].map((s, i) => (
                <G key={`star-${i}`} transform={`translate(${s.x}, ${s.y})`}>
                    <Path d={`M0 ${-s.size} L${s.size * 0.3} ${-s.size * 0.3} L${s.size} 0 L${s.size * 0.3} ${s.size * 0.3} L0 ${s.size} L${-s.size * 0.3} ${s.size * 0.3} L${-s.size} 0 L${-s.size * 0.3} ${-s.size * 0.3} Z`} fill="#FFF" opacity={0.7} />
                </G>
            ))}

            {/* Decor */}
            <G transform={`translate(30, ${HORIZON - 70})`}>
                <Circle cx={30} cy={25} r={25} fill="#FFF" opacity={0.9} />
                <Circle cx={55} cy={30} r={20} fill="#FFF" opacity={0.9} />
                <Circle cx={10} cy={30} r={18} fill="#FFF" opacity={0.9} />
                <Path d="M20 30 Q25 25 30 30" stroke="#CE93D8" strokeWidth={2} fill="none" />
                <Path d="M38 30 Q43 25 48 30" stroke="#CE93D8" strokeWidth={2} fill="none" />
                <Circle cx={34} cy={40} r={6} fill="#F8BBD0" opacity={0.6} />
            </G>

            <G transform={`translate(${width - 100}, ${HORIZON - 90})`}>
                <Circle cx={25} cy={28} r={22} fill="#FFF" opacity={0.9} />
                <Circle cx={48} cy={32} r={18} fill="#FFF" opacity={0.9} />
                <Circle cx={8} cy={33} r={16} fill="#FFF" opacity={0.9} />
                <Circle cx={20} cy={28} r={3} fill="#CE93D8" />
                <Circle cx={38} cy={28} r={3} fill="#CE93D8" />
                <Path d="M22 38 Q29 44 36 38" stroke="#CE93D8" strokeWidth={2} fill="none" />
            </G>

            {/* Hearts */}
            {[
                { x: width * 0.22, y: height * 0.42, size: 8 },
                { x: width * 0.78, y: height * 0.38, size: 10 },
            ].map((h, i) => (
                <G key={`heart-${i}`} transform={`translate(${h.x}, ${h.y})`}>
                    <Path d={`M0 ${h.size * 0.3} C0 0 ${h.size * 0.5} 0 ${h.size * 0.5} ${h.size * 0.3} C${h.size * 0.5} 0 ${h.size} 0 ${h.size} ${h.size * 0.3} C${h.size} ${h.size * 0.7} ${h.size * 0.5} ${h.size} ${h.size * 0.5} ${h.size * 1.2} C${h.size * 0.5} ${h.size} 0 ${h.size * 0.7} 0 ${h.size * 0.3} Z`} fill="#F48FB1" opacity={0.6} />
                </G>
            ))}
        </Svg>
    );
};
