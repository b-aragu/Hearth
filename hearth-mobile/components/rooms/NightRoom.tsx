import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G, Rect, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, withSequence, useAnimatedProps } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const HORIZON = height * 0.38;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const NightRoom = () => {
    const twinkleOpacity = useSharedValue(0.5);

    useEffect(() => {
        twinkleOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStarProps = useAnimatedProps(() => ({
        opacity: twinkleOpacity.value,
    }));

    return (
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
            <Defs>
                <RadialGradient id="moonGlow" cx="50%" cy="50%" rx="80%" ry="80%">
                    <Stop offset="0" stopColor="#FFF9C4" stopOpacity="0.4" />
                    <Stop offset="1" stopColor="#FFF9C4" stopOpacity="0" />
                </RadialGradient>
                <RadialGradient id="nightGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                    <Stop offset="0" stopColor="#7986CB" stopOpacity="0.3" />
                    <Stop offset="1" stopColor="#7986CB" stopOpacity="0" />
                </RadialGradient>
            </Defs>

            {/* Background */}
            <Rect x="0" y="0" width={width} height={height} fill="#121212" />

            {/* Moon */}
            <Circle cx={width - 70} cy={90} r={60} fill="url(#moonGlow)" />
            <Circle cx={width - 70} cy={90} r={35} fill="#FFF9C4" opacity={0.95} />
            <Circle cx={width - 85} cy={85} r={35} fill="#1A237E" />
            <Circle cx={width - 60} cy={85} r={5} fill="#FFF59D" opacity={0.5} />
            <Circle cx={width - 75} cy={100} r={3} fill="#FFF59D" opacity={0.4} />

            {/* Stars */}
            {[
                { x: 40, y: 60, r: 2 }, { x: 100, y: 120, r: 1.5 }, { x: 160, y: 50, r: 2.5 },
                { x: 70, y: 180, r: 1.5 }, { x: 200, y: 100, r: 2 }, { x: 250, y: 60, r: 1.5 },
                { x: 50, y: 240, r: 2 }, { x: 180, y: 160, r: 1.5 }, { x: 120, y: 220, r: 2 },
                { x: width * 0.4, y: 80, r: 2.5 }, { x: width * 0.5, y: 140, r: 1.5 },
            ].map((s, i) => (
                <Circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#FFF" opacity={0.8} />
            ))}
            <AnimatedCircle cx={80} cy={90} r={3} fill="#FFF" animatedProps={animatedStarProps} />
            <AnimatedCircle cx={200} cy={180} r={2.5} fill="#FFF" animatedProps={animatedStarProps} />
            <AnimatedCircle cx={width * 0.6} cy={70} r={3} fill="#FFF" animatedProps={animatedStarProps} />

            {/* Hills */}
            <Path d={`M 0 ${HORIZON + 20} Q ${width * 0.2} ${HORIZON - 30} ${width * 0.4} ${HORIZON + 10} T ${width * 0.7} ${HORIZON} T ${width} ${HORIZON + 30} V ${height} H 0 Z`} fill="#283593" opacity={0.7} />
            <Path d={`M 0 ${HORIZON + 60} Q ${width * 0.3} ${HORIZON + 30} ${width * 0.6} ${HORIZON + 50} T ${width} ${HORIZON + 70} V ${height} H 0 Z`} fill="#1A237E" opacity={0.6} />

            {/* Glow */}
            <Ellipse cx={width / 2} cy={height * 0.48} rx={100} ry={80} fill="url(#nightGlow)" />
            <Ellipse cx={width / 2} cy={height * 0.56} rx={45} ry={10} fill="#00000030" />

            {/* Owl */}
            <G transform={`translate(30, ${HORIZON - 40})`}>
                <Path d="M-20 30 Q20 25 60 35" stroke="#4E342E" strokeWidth={8} fill="none" />
                <Ellipse cx={25} cy={18} rx={12} ry={14} fill="#795548" />
                <Ellipse cx={25} cy={12} rx={10} ry={8} fill="#8D6E63" />
                <Path d="M20 10 Q22 12 24 10" stroke="#3E2723" strokeWidth={1.5} fill="none" />
                <Path d="M26 10 Q28 12 30 10" stroke="#3E2723" strokeWidth={1.5} fill="none" />
                <Path d="M24 14 L25 17 L26 14" fill="#FF8A65" />
            </G>

            {/* Lantern */}
            <G transform={`translate(${width - 70}, ${HORIZON + 20})`}>
                <Circle cx={20} cy={25} r={25} fill="#FFCC80" opacity={0.3} />
                <Rect x={18} y={40} width={4} height={50} fill="#5D4037" />
                <Rect x={8} y={15} width={24} height={30} fill="#3E2723" rx={3} />
                <Rect x={12} y={20} width={16} height={20} fill="#FFCC80" opacity={0.9} />
                <Rect x={6} y={12} width={28} height={5} fill="#4E342E" rx={2} />
                <Rect x={6} y={43} width={28} height={5} fill="#4E342E" rx={2} />
            </G>

            {/* Fireflies */}
            {[
                { x: width * 0.2, y: height * 0.4 },
                { x: width * 0.35, y: height * 0.35 },
                { x: width * 0.65, y: height * 0.38 },
                { x: width * 0.5, y: height * 0.32 },
            ].map((f, i) => (
                <G key={`fly-${i}`}>
                    <Circle cx={f.x} cy={f.y} r={5} fill="#FFEE58" opacity={0.2} />
                    <Circle cx={f.x} cy={f.y} r={2} fill="#FFEE58" opacity={0.8} />
                </G>
            ))}
        </Svg>
    );
};
