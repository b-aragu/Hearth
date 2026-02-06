import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Rect, Defs, RadialGradient, Stop, Ellipse, Line, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, withSequence, useAnimatedProps, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// --- THEME DEFINITIONS ---
// Ground level (HORIZON) is at ~38-40% from top of screen
// Bunny feet should rest at height * 0.55-0.58
// Decorations should stay outside center horizontal area (30%-70% of width)
export const ROOM_THEMES: Record<string, { label: string; colors: string[] }> = {
    'cozy': { label: 'Cozy Cabin', colors: ['#FFF8F0', '#FFE8D6'] },
    'forest': { label: 'Enchanted Forest', colors: ['#E8F5E9', '#C8E6C9'] },
    'beach': { label: 'Sunny Beach', colors: ['#E0F7FA', '#B2EBF2'] },
    'night': { label: 'Starry Night', colors: ['#1A237E', '#311B92'] },
    'cloud': { label: 'Cloud Kingdom', colors: ['#F3E5F5', '#E1BEE7'] },
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const RoomBackground = ({ roomId = 'cozy' }: { roomId?: string }) => {

    // Twinkle Animation for Night Mode
    const twinkleOpacity = useSharedValue(0.5);
    useEffect(() => {
        if (roomId === 'night') {
            twinkleOpacity.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1000 }),
                    withTiming(0.3, { duration: 1000 })
                ),
                -1,
                true
            );
        }
    }, [roomId]);

    const animatedStarProps = useAnimatedProps(() => ({
        opacity: twinkleOpacity.value,
    }));

    const theme = ROOM_THEMES[roomId] || ROOM_THEMES['cozy'];

    const renderCozyRoom = () => {
        const HORIZON = height * 0.38;
        const FLOOR_Y = HORIZON + 20;

        return (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
                <Defs>
                    {/* Warm lighting gradient from top-left */}
                    <SvgLinearGradient id="warmLight" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#FFF5E6" stopOpacity="0.6" />
                        <Stop offset="1" stopColor="#FFE0C0" stopOpacity="0" />
                    </SvgLinearGradient>
                    {/* Floor gradient for depth */}
                    <SvgLinearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#D4A574" stopOpacity="0.5" />
                        <Stop offset="1" stopColor="#C49A6C" stopOpacity="0.7" />
                    </SvgLinearGradient>
                    {/* Wall gradient */}
                    <SvgLinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#FFF8F0" stopOpacity="0.3" />
                        <Stop offset="1" stopColor="#FFE8D6" stopOpacity="0.5" />
                    </SvgLinearGradient>
                    {/* Shadow gradient */}
                    <RadialGradient id="bunnyGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0" stopColor="#FFE8CC" stopOpacity="0.4" />
                        <Stop offset="1" stopColor="#FFE8CC" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* ========== BACKGROUND LAYER ========== */}

                {/* Wallpaper with subtle pattern */}
                <Rect x="0" y="0" width={width} height={HORIZON + 40} fill="url(#wallGrad)" />

                {/* Tiny heart pattern on wall */}
                {[...Array(12)].map((_, i) => (
                    <G key={`heart-${i}`} transform={`translate(${30 + (i % 4) * 100}, ${40 + Math.floor(i / 4) * 50})`}>
                        <Path
                            d="M0 3 C0 0 3 0 3 2 C3 0 6 0 6 3 C6 6 3 8 3 10 C3 8 0 6 0 3 Z"
                            fill="#F5D0C5"
                            opacity={0.25}
                            scale={0.8}
                        />
                    </G>
                ))}

                {/* Window with sky view - LEFT SIDE */}
                <G transform={`translate(${width * 0.08}, ${HORIZON - 160})`}>
                    {/* Window frame shadow */}
                    <Rect x={4} y={4} width={75} height={110} fill="#00000010" rx={6} />
                    {/* Window frame */}
                    <Rect x={0} y={0} width={75} height={110} fill="#E8DFD5" rx={6} />
                    {/* Window inner frame */}
                    <Rect x={6} y={6} width={63} height={98} fill="#D4C8BC" rx={4} />
                    {/* Sky view */}
                    <Rect x={10} y={10} width={55} height={42} fill="#87CEEB" rx={2} />
                    <Rect x={10} y={56} width={55} height={42} fill="#A8D8EA" rx={2} />
                    {/* Clouds in window */}
                    <Circle cx={25} cy={25} r={8} fill="#FFF" opacity={0.9} />
                    <Circle cx={35} cy={28} r={6} fill="#FFF" opacity={0.8} />
                    <Circle cx={45} cy={70} r={7} fill="#FFF" opacity={0.7} />
                    {/* Window divider */}
                    <Line x1={10} y1={52} x2={65} y2={52} stroke="#C4B8AC" strokeWidth={4} />
                    <Line x1={37} y1={10} x2={37} y2={98} stroke="#C4B8AC" strokeWidth={4} />
                    {/* Curtain hints */}
                    <Path d="M0 0 Q-15 55 0 110" fill="#F8E8DC" opacity={0.6} />
                    <Path d="M75 0 Q90 55 75 110" fill="#F8E8DC" opacity={0.6} />
                </G>

                {/* Shelf with cute items - RIGHT SIDE on wall */}
                <G transform={`translate(${width * 0.68}, ${HORIZON - 130})`}>
                    {/* Shelf shadow */}
                    <Rect x={3} y={23} width={90} height={12} fill="#00000015" rx={3} />
                    {/* Shelf board */}
                    <Rect x={0} y={20} width={90} height={10} fill="#B8A090" rx={3} />
                    {/* Books on shelf */}
                    <Rect x={8} y={2} width={12} height={18} fill="#E8A0A0" rx={2} />
                    <Rect x={22} y={5} width={10} height={15} fill="#A0C8E0" rx={2} />
                    <Rect x={34} y={3} width={11} height={17} fill="#C8E0A0" rx={2} />
                    {/* Photo frame */}
                    <Rect x={52} y={4} width={16} height={16} fill="#D4C0B0" rx={1} />
                    <Rect x={54} y={6} width={12} height={12} fill="#FFE0D0" rx={1} />
                    <Circle cx={60} cy={12} r={4} fill="#E0B0A0" />
                    {/* Small plant */}
                    <Rect x={74} y={10} width={10} height={10} fill="#C8A080" rx={2} />
                    <Circle cx={79} cy={6} r={6} fill="#7CB342" />
                    <Circle cx={75} cy={8} r={4} fill="#8BC34A" />
                </G>

                {/* Picture frame on wall - decorative */}
                <G transform={`translate(${width * 0.42}, ${HORIZON - 110})`}>
                    {/* Frame shadow */}
                    <Rect x={3} y={3} width={54} height={44} fill="#00000010" rx={3} />
                    {/* Outer frame */}
                    <Rect x={0} y={0} width={54} height={44} fill="#C8B0A0" rx={3} />
                    {/* Inner frame */}
                    <Rect x={5} y={5} width={44} height={34} fill="#E8D8C8" rx={2} />
                    {/* Picture content - abstract heart */}
                    <Rect x={8} y={8} width={38} height={28} fill="#FFF0E8" rx={2} />
                    <Path
                        d="M27 14 C27 10 22 10 22 14 C22 18 27 24 27 28 C27 24 32 18 32 14 C32 10 27 10 27 14 Z"
                        fill="#E8A0A0"
                        opacity={0.7}
                    />
                </G>

                {/* ========== FLOOR LAYER ========== */}

                {/* Baseboard / Wall-Floor separator */}
                <Rect x={0} y={HORIZON} width={width} height={8} fill="#C4A484" opacity={0.6} />

                {/* Floor with gradient for depth */}
                <Rect x={0} y={FLOOR_Y} width={width} height={height * 0.40} fill="url(#floorGrad)" />

                {/* Floor boards pattern */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <Line
                        key={`board-${i}`}
                        x1={0}
                        y1={FLOOR_Y + i * 25}
                        x2={width}
                        y2={FLOOR_Y + i * 25}
                        stroke="#C49060"
                        strokeWidth={1}
                        opacity={0.2}
                    />
                ))}

                {/* Rug with pattern - centered under bunny */}
                <G transform={`translate(${width / 2}, ${height * 0.52})`}>
                    {/* Rug shadow */}
                    <Ellipse cx={0} cy={8} rx={width * 0.32} ry={28} fill="#00000010" />
                    {/* Outer rug */}
                    <Ellipse cx={0} cy={0} rx={width * 0.30} ry={24} fill="#D4847C" opacity={0.5} />
                    {/* Inner rug pattern */}
                    <Ellipse cx={0} cy={0} rx={width * 0.24} ry={18} fill="#E8A090" opacity={0.4} />
                    <Ellipse cx={0} cy={0} rx={width * 0.18} ry={12} fill="#F0B8A8" opacity={0.5} />
                    {/* Rug center design */}
                    <Circle cx={0} cy={0} r={20} fill="#F8C8B8" opacity={0.4} />
                </G>

                {/* ========== MID LAYER - Ambient Effects ========== */}

                {/* Ambient glow around bunny area */}
                <Ellipse
                    cx={width / 2}
                    cy={height * 0.45}
                    rx={100}
                    ry={80}
                    fill="url(#bunnyGlow)"
                />

                {/* Bunny shadow on floor - aligned with rug */}
                <Ellipse
                    cx={width / 2}
                    cy={height * 0.52}
                    rx={50}
                    ry={12}
                    fill="#00000012"
                />

                {/* ========== FOREGROUND LAYER ========== */}

                {/* Large detailed plant - RIGHT SIDE */}
                <G transform={`translate(${width * 0.82}, ${HORIZON + 10})`}>
                    {/* Pot shadow */}
                    <Ellipse cx={28} cy={95} rx={32} ry={8} fill="#00000015" />
                    {/* Pot - terracotta style */}
                    <Path d="M8 40 L4 85 Q28 95 52 85 L48 40 Q28 35 8 40 Z" fill="#C67D5E" />
                    <Ellipse cx={28} cy={40} rx={22} ry={8} fill="#D4896A" />
                    <Path d="M10 40 L6 48 Q28 55 50 48 L46 40" fill="#B86E4C" opacity={0.5} />
                    {/* Soil */}
                    <Ellipse cx={28} cy={42} rx={18} ry={6} fill="#5D4037" />
                    {/* Plant leaves - bigger, more detailed */}
                    <Path d="M28 42 Q10 20 15 -10 Q28 0 30 42" fill="#66BB6A" />
                    <Path d="M28 42 Q45 15 50 -5 Q28 5 26 42" fill="#4CAF50" />
                    <Path d="M28 42 Q0 30 -5 10 Q20 15 28 42" fill="#81C784" />
                    <Path d="M28 42 Q55 25 60 15 Q35 20 28 42" fill="#43A047" />
                    <Path d="M28 42 Q25 10 30 -15 Q32 10 28 42" fill="#2E7D32" />
                    {/* Leaf highlights */}
                    <Path d="M20 20 Q22 10 28 5" stroke="#A5D6A7" strokeWidth={2} fill="none" opacity={0.6} />
                    <Path d="M38 15 Q40 8 45 0" stroke="#A5D6A7" strokeWidth={2} fill="none" opacity={0.6} />
                </G>

                {/* Small decorative lamp - LEFT SIDE near window */}
                <G transform={`translate(${width * 0.05}, ${HORIZON + 30})`}>
                    {/* Lamp shadow */}
                    <Ellipse cx={20} cy={65} rx={18} ry={5} fill="#00000010" />
                    {/* Lamp base */}
                    <Ellipse cx={20} cy={60} rx={14} ry={4} fill="#D4C0A8" />
                    <Rect x={16} y={35} width={8} height={25} fill="#C8B498" />
                    {/* Lamp shade */}
                    <Path d="M5 35 L10 10 L30 10 L35 35 Z" fill="#FFF8E8" opacity={0.9} />
                    <Ellipse cx={20} cy={10} rx={10} ry={4} fill="#FFF0D8" opacity={0.8} />
                    {/* Lamp glow */}
                    <Circle cx={20} cy={20} r={18} fill="#FFFBE8" opacity={0.3} />
                </G>

                {/* Floating sparkles for magic feel */}
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

                {/* ========== LIGHTING EFFECTS ========== */}

                {/* Warm light gradient overlay from top-left */}
                <Rect x={0} y={0} width={width * 0.6} height={height * 0.5} fill="url(#warmLight)" />

                {/* Subtle vignette at edges */}
                <Rect x={0} y={0} width={30} height={height} fill="#00000008" />
                <Rect x={width - 30} y={0} width={30} height={height} fill="#00000008" />

                {/* Soft rim light effect area (bunny will be placed here) */}
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

    const renderDecor = () => {
        const HORIZON = height * 0.40;

        switch (roomId) {
            case 'cozy':
                return renderCozyRoom();
            case 'forest':
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

                        {/* ========== BACKGROUND LAYER ========== */}
                        {/* Distant trees (far back) */}
                        <G opacity={0.3}>
                            <Path d={`M -30 ${HORIZON} L 30 ${HORIZON - 120} L 90 ${HORIZON} Z`} fill="#81C784" />
                            <Path d={`M 60 ${HORIZON} L 110 ${HORIZON - 100} L 160 ${HORIZON} Z`} fill="#A5D6A7" />
                            <Path d={`M ${width - 120} ${HORIZON} L ${width - 70} ${HORIZON - 110} L ${width - 20} ${HORIZON} Z`} fill="#81C784" />
                            <Path d={`M ${width - 60} ${HORIZON} L ${width - 20} ${HORIZON - 90} L ${width + 20} ${HORIZON} Z`} fill="#A5D6A7" />
                        </G>

                        {/* Trunk shadows for distant trees */}
                        <Rect x={25} y={HORIZON - 10} width={10} height={40} fill="#5D4037" opacity={0.2} />
                        <Rect x={105} y={HORIZON - 10} width={8} height={35} fill="#5D4037" opacity={0.2} />
                        <Rect x={width - 75} y={HORIZON - 10} width={10} height={40} fill="#5D4037" opacity={0.2} />

                        {/* ========== MID LAYER - Ground ========== */}
                        {/* Grass floor with gradient */}
                        <Rect x="0" y={HORIZON} width={width} height={height * 0.40} fill="#A5D6A7" opacity={0.6} />
                        <Rect x="0" y={HORIZON + 30} width={width} height={height * 0.35} fill="#81C784" opacity={0.4} />

                        {/* Grass tufts */}
                        {[...Array(8)].map((_, i) => (
                            <G key={`grass-${i}`} transform={`translate(${30 + i * 50}, ${HORIZON + 50})`}>
                                <Path d="M0 15 Q3 5 5 0 Q7 8 10 15" fill="#66BB6A" opacity={0.5} />
                            </G>
                        ))}

                        {/* Bunny ambient glow */}
                        <Ellipse cx={width / 2} cy={height * 0.48} rx={90} ry={70} fill="url(#forestGlow)" />

                        {/* Bunny shadow */}
                        <Ellipse cx={width / 2} cy={height * 0.56} rx={45} ry={10} fill="#00000015" />

                        {/* ========== FOREGROUND LAYER ========== */}
                        {/* Large tree LEFT */}
                        <G transform={`translate(10, ${HORIZON - 160})`}>
                            {/* Tree trunk */}
                            <Rect x={35} y={100} width={30} height={120} fill="#6D4C41" />
                            <Rect x={40} y={110} width={5} height={100} fill="#5D4037" opacity={0.5} />
                            {/* Tree foliage layers */}
                            <Path d="M0 120 L50 30 L100 120 Z" fill="#43A047" />
                            <Path d="M10 90 L50 10 L90 90 Z" fill="#66BB6A" />
                            <Path d="M20 60 L50 -10 L80 60 Z" fill="#81C784" />
                        </G>

                        {/* Large tree RIGHT */}
                        <G transform={`translate(${width - 90}, ${HORIZON - 140})`}>
                            <Rect x={30} y={90} width={25} height={100} fill="#6D4C41" />
                            <Path d="M0 100 L42 20 L85 100 Z" fill="#388E3C" />
                            <Path d="M10 70 L42 0 L75 70 Z" fill="#4CAF50" />
                            <Path d="M18 45 L42 -15 L66 45 Z" fill="#66BB6A" />
                        </G>

                        {/* Mushrooms with detail */}
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

                        {/* Flowers on floor */}
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

                        {/* Light rays through trees */}
                        <Rect x={0} y={0} width={width * 0.5} height={height * 0.4} fill="url(#forestLight)" />

                        {/* Fireflies / sparkles */}
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
            case 'night':
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

                        {/* ========== BACKGROUND LAYER ========== */}
                        {/* Moon with glow */}
                        <Circle cx={width - 70} cy={90} r={60} fill="url(#moonGlow)" />
                        <Circle cx={width - 70} cy={90} r={35} fill="#FFF9C4" opacity={0.95} />
                        <Circle cx={width - 85} cy={85} r={35} fill="#1A237E" />
                        {/* Moon craters */}
                        <Circle cx={width - 60} cy={85} r={5} fill="#FFF59D" opacity={0.5} />
                        <Circle cx={width - 75} cy={100} r={3} fill="#FFF59D" opacity={0.4} />

                        {/* Stars - fixed positions for consistency */}
                        {[
                            { x: 40, y: 60, r: 2 }, { x: 100, y: 120, r: 1.5 }, { x: 160, y: 50, r: 2.5 },
                            { x: 70, y: 180, r: 1.5 }, { x: 200, y: 100, r: 2 }, { x: 250, y: 60, r: 1.5 },
                            { x: 50, y: 240, r: 2 }, { x: 180, y: 160, r: 1.5 }, { x: 120, y: 220, r: 2 },
                            { x: width * 0.4, y: 80, r: 2.5 }, { x: width * 0.5, y: 140, r: 1.5 },
                        ].map((s, i) => (
                            <Circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#FFF" opacity={0.8} />
                        ))}
                        {/* Animated twinkling stars */}
                        <AnimatedCircle cx={80} cy={90} r={3} fill="#FFF" animatedProps={animatedStarProps} />
                        <AnimatedCircle cx={200} cy={180} r={2.5} fill="#FFF" animatedProps={animatedStarProps} />
                        <AnimatedCircle cx={width * 0.6} cy={70} r={3} fill="#FFF" animatedProps={animatedStarProps} />

                        {/* Distant hills silhouette */}
                        <Path d={`M 0 ${HORIZON + 20} Q ${width * 0.2} ${HORIZON - 30} ${width * 0.4} ${HORIZON + 10} T ${width * 0.7} ${HORIZON} T ${width} ${HORIZON + 30} V ${height} H 0 Z`} fill="#283593" opacity={0.7} />
                        <Path d={`M 0 ${HORIZON + 60} Q ${width * 0.3} ${HORIZON + 30} ${width * 0.6} ${HORIZON + 50} T ${width} ${HORIZON + 70} V ${height} H 0 Z`} fill="#1A237E" opacity={0.6} />

                        {/* ========== MID LAYER ========== */}
                        {/* Bunny ambient glow */}
                        <Ellipse cx={width / 2} cy={height * 0.48} rx={100} ry={80} fill="url(#nightGlow)" />
                        {/* Bunny shadow (subtle on dark) */}
                        <Ellipse cx={width / 2} cy={height * 0.56} rx={45} ry={10} fill="#00000030" />

                        {/* ========== FOREGROUND LAYER ========== */}
                        {/* Sleeping owl on branch LEFT */}
                        <G transform={`translate(30, ${HORIZON - 40})`}>
                            {/* Branch */}
                            <Path d="M-20 30 Q20 25 60 35" stroke="#4E342E" strokeWidth={8} fill="none" />
                            {/* Owl body */}
                            <Ellipse cx={25} cy={18} rx={12} ry={14} fill="#795548" />
                            <Ellipse cx={25} cy={12} rx={10} ry={8} fill="#8D6E63" />
                            {/* Owl eyes (closed - sleeping) */}
                            <Path d="M20 10 Q22 12 24 10" stroke="#3E2723" strokeWidth={1.5} fill="none" />
                            <Path d="M26 10 Q28 12 30 10" stroke="#3E2723" strokeWidth={1.5} fill="none" />
                            {/* Owl beak */}
                            <Path d="M24 14 L25 17 L26 14" fill="#FF8A65" />
                        </G>

                        {/* Glowing lantern RIGHT */}
                        <G transform={`translate(${width - 70}, ${HORIZON + 20})`}>
                            {/* Lantern glow */}
                            <Circle cx={20} cy={25} r={25} fill="#FFCC80" opacity={0.3} />
                            {/* Lantern post */}
                            <Rect x={18} y={40} width={4} height={50} fill="#5D4037" />
                            {/* Lantern body */}
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
            case 'beach':
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

                        {/* ========== BACKGROUND LAYER ========== */}
                        {/* Sun with glow */}
                        <Circle cx={70} cy={80} r={80} fill="url(#sunGlow)" />
                        <Circle cx={70} cy={80} r={35} fill="#FFEB3B" opacity={0.95} />
                        {/* Sun rays */}
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

                        {/* Distant clouds */}
                        <G opacity={0.6}>
                            <Circle cx={width * 0.6} cy={60} r={25} fill="#FFF" />
                            <Circle cx={width * 0.65} cy={55} r={20} fill="#FFF" />
                            <Circle cx={width * 0.55} cy={65} r={18} fill="#FFF" />
                        </G>

                        {/* ========== MID LAYER - Ocean & Sand ========== */}
                        {/* Ocean with gradient */}
                        <Rect x="0" y={HORIZON - 20} width={width} height={80} fill="url(#oceanGrad)" />

                        {/* Waves */}
                        <Path d={`M 0 ${HORIZON + 30} Q ${width * 0.15} ${HORIZON + 20} ${width * 0.3} ${HORIZON + 30} T ${width * 0.6} ${HORIZON + 30} T ${width} ${HORIZON + 25}`} fill="#4DD0E1" opacity={0.5} />
                        <Path d={`M 0 ${HORIZON + 50} Q ${width * 0.2} ${HORIZON + 35} ${width * 0.4} ${HORIZON + 50} T ${width * 0.8} ${HORIZON + 45} T ${width} ${HORIZON + 55}`} fill="#E0F7FA" opacity={0.6} />

                        {/* Sand beach */}
                        <Path d={`M 0 ${HORIZON + 55} Q ${width * 0.25} ${HORIZON + 40} ${width * 0.5} ${HORIZON + 50} T ${width} ${HORIZON + 60} V ${height} H 0 Z`} fill="#FFE0B2" />
                        <Path d={`M 0 ${HORIZON + 70} L 0 ${height} L ${width} ${height} L ${width} ${HORIZON + 75} Q ${width * 0.5} ${HORIZON + 60} 0 ${HORIZON + 70}`} fill="#FFCC80" opacity={0.5} />

                        {/* Bunny ambient glow */}
                        <Ellipse cx={width / 2} cy={height * 0.48} rx={90} ry={70} fill="url(#beachGlow)" />
                        {/* Bunny shadow */}
                        <Ellipse cx={width / 2} cy={height * 0.56} rx={45} ry={10} fill="#00000012" />

                        {/* ========== FOREGROUND LAYER ========== */}
                        {/* Palm tree LEFT */}
                        <G transform={`translate(25, ${HORIZON - 80})`}>
                            {/* Trunk with texture */}
                            <Path d="M30 200 Q25 100 35 40" stroke="#8D6E63" strokeWidth={12} fill="none" />
                            <Path d="M30 200 Q25 100 35 40" stroke="#795548" strokeWidth={8} fill="none" />
                            {/* Trunk lines */}
                            {[60, 90, 120, 150, 180].map((y, i) => (
                                <Path key={`tl-${i}`} d={`M${25 + i} ${y} Q30 ${y - 3} ${35 - i} ${y}`} stroke="#6D4C41" strokeWidth={1} fill="none" opacity={0.5} />
                            ))}
                            {/* Palm leaves */}
                            <Path d="M35 40 Q15 20 -20 35" stroke="#4CAF50" strokeWidth={4} fill="none" />
                            <Path d="M35 40 Q55 15 85 25" stroke="#4CAF50" strokeWidth={4} fill="none" />
                            <Path d="M35 40 Q30 5 25 -20" stroke="#66BB6A" strokeWidth={4} fill="none" />
                            <Path d="M35 40 Q50 30 70 50" stroke="#66BB6A" strokeWidth={4} fill="none" />
                            <Path d="M35 40 Q20 35 0 55" stroke="#81C784" strokeWidth={4} fill="none" />
                            {/* Coconuts */}
                            <Circle cx={32} cy={50} r={6} fill="#795548" />
                            <Circle cx={42} cy={48} r={5} fill="#6D4C41" />
                        </G>

                        {/* Beach umbrella RIGHT */}
                        <G transform={`translate(${width - 90}, ${HORIZON + 30})`}>
                            {/* Umbrella shadow */}
                            <Ellipse cx={30} cy={60} rx={35} ry={8} fill="#00000015" />
                            {/* Pole */}
                            <Rect x={28} y={-10} width={4} height={75} fill="#8D6E63" />
                            {/* Umbrella top */}
                            <Path d="M-10 0 Q30 -40 70 0" fill="#EF5350" />
                            <Path d="M0 -2 Q30 -35 60 -2" fill="#FFCDD2" opacity={0.5} />
                        </G>

                        {/* Seashells & starfish */}
                        <G transform={`translate(${width * 0.35}, ${HORIZON + 80})`}>
                            {/* Starfish */}
                            <Path d="M0 -8 L2 -2 L8 -2 L3 2 L5 8 L0 4 L-5 8 L-3 2 L-8 -2 L-2 -2 Z" fill="#FF8A65" />
                        </G>
                        <G transform={`translate(${width * 0.55}, ${HORIZON + 90})`}>
                            {/* Shell */}
                            <Ellipse cx={0} cy={0} rx={8} ry={5} fill="#FFCCBC" />
                            <Path d="M-6 0 Q0 -5 6 0" stroke="#FFAB91" strokeWidth={1} fill="none" />
                        </G>

                        {/* Beach bucket */}
                        <G transform={`translate(${width * 0.65}, ${HORIZON + 65})`}>
                            <Path d="M0 20 L5 0 L25 0 L30 20 Z" fill="#42A5F5" />
                            <Rect x={3} y={0} width={24} height={5} fill="#1E88E5" rx={2} />
                            <Path d="M8 0 Q15 -10 22 0" stroke="#90CAF9" strokeWidth={2} fill="none" />
                        </G>
                    </Svg>
                );
            case 'cloud':
                return (
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice">
                        <Defs>
                            <RadialGradient id="cloudGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                                <Stop offset="0" stopColor="#F8BBD0" stopOpacity="0.4" />
                                <Stop offset="1" stopColor="#F8BBD0" stopOpacity="0" />
                            </RadialGradient>
                        </Defs>

                        {/* ========== BACKGROUND LAYER ========== */}
                        {/* Large fluffy clouds */}
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

                        {/* Gentle rainbow arc */}
                        <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 180} ${width + 30} ${HORIZON - 30}`} stroke="#FFCDD2" strokeWidth={15} fill="none" opacity={0.3} />
                        <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 200} ${width + 30} ${HORIZON - 30}`} stroke="#F8BBD0" strokeWidth={15} fill="none" opacity={0.25} />
                        <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 220} ${width + 30} ${HORIZON - 30}`} stroke="#E1BEE7" strokeWidth={15} fill="none" opacity={0.2} />
                        <Path d={`M -30 ${HORIZON - 30} Q ${width * 0.5} ${HORIZON - 240} ${width + 30} ${HORIZON - 30}`} stroke="#B39DDB" strokeWidth={15} fill="none" opacity={0.15} />

                        {/* ========== MID LAYER - Cloud Floor ========== */}
                        {/* Fluffy cloud floor */}
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

                        {/* Bunny ambient glow */}
                        <Ellipse cx={width / 2} cy={height * 0.46} rx={100} ry={80} fill="url(#cloudGlow)" />
                        {/* Bunny shadow (very soft on clouds) */}
                        <Ellipse cx={width / 2} cy={height * 0.55} rx={50} ry={12} fill="#CE93D8" opacity={0.15} />

                        {/* ========== FOREGROUND LAYER ========== */}
                        {/* Floating stars/sparkles */}
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

                        {/* Cute sleeping cloud LEFT */}
                        <G transform={`translate(30, ${HORIZON - 70})`}>
                            <Circle cx={30} cy={25} r={25} fill="#FFF" opacity={0.9} />
                            <Circle cx={55} cy={30} r={20} fill="#FFF" opacity={0.9} />
                            <Circle cx={10} cy={30} r={18} fill="#FFF" opacity={0.9} />
                            {/* Sleeping face */}
                            <Path d="M20 30 Q25 25 30 30" stroke="#CE93D8" strokeWidth={2} fill="none" />
                            <Path d="M38 30 Q43 25 48 30" stroke="#CE93D8" strokeWidth={2} fill="none" />
                            <Circle cx={34} cy={40} r={6} fill="#F8BBD0" opacity={0.6} />
                        </G>

                        {/* Happy cloud RIGHT */}
                        <G transform={`translate(${width - 100}, ${HORIZON - 90})`}>
                            <Circle cx={25} cy={28} r={22} fill="#FFF" opacity={0.9} />
                            <Circle cx={48} cy={32} r={18} fill="#FFF" opacity={0.9} />
                            <Circle cx={8} cy={33} r={16} fill="#FFF" opacity={0.9} />
                            {/* Happy face */}
                            <Circle cx={20} cy={28} r={3} fill="#CE93D8" />
                            <Circle cx={38} cy={28} r={3} fill="#CE93D8" />
                            <Path d="M22 38 Q29 44 36 38" stroke="#CE93D8" strokeWidth={2} fill="none" />
                        </G>

                        {/* Floating hearts */}
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
            default:
                return null;
        }
    };

    return (
        <View style={StyleSheet.absoluteFill}>
            <LinearGradient
                colors={theme.colors as any}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 1 }}
            />
            {renderDecor()}
        </View>
    );
};
