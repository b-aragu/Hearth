import { View, Text, Pressable, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Creature } from '../../components/Creature';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { CREATURES } from '../../constants/creatures';
// ... imports
import Animated, { FadeInDown, FadeInUp, useSharedValue, withRepeat, withTiming, Easing, useAnimatedStyle, withDelay } from 'react-native-reanimated';
import { useState, useCallback, useEffect } from 'react';
import { DynamicCreature } from '../../components/creatures/DynamicCreature';

const { width } = Dimensions.get('window');

// Floating Particle Component
const FloatingParticle = ({ children, delay = 0, x, y }: { children: React.ReactNode, delay?: number, x: number, y: number }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        translateY.value = withDelay(delay, withRepeat(withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true));
        opacity.value = withDelay(delay, withRepeat(withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
        position: 'absolute',
        top: y,
        left: x
    }));

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

// Components
const StatBadge = ({ value, label, isStreak }: { value: string | number, label: string, isStreak?: boolean }) => (
    <View className="items-center">
        <Text className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-1">{label}</Text>
        <Text className={`text-2xl font-outfit font-bold ${isStreak ? 'text-coral' : 'text-charcoal'}`}>
            {value}{isStreak && ' ✦'}
        </Text>
    </View>
);

const PartnerStatus = ({ name, isCheckedIn, isOnline }: { name: string, isCheckedIn: boolean, isOnline?: boolean }) => (
    <View className={`flex-row items-center gap-2 px-3 py-2 rounded-2xl border ${isCheckedIn ? 'bg-white/60 border-white/50' : 'bg-white/30 border-dashed border-charcoal/10'}`}>
        <View className={`w-6 h-6 rounded-full items-center justify-center ${isCheckedIn ? 'bg-mint' : 'border-2 border-blue/40'}`}>
            {isCheckedIn && <Text className="text-white text-[10px]">✓</Text>}
        </View>
        <View>
            <Text className="font-bold text-charcoal/80 text-sm">{isCheckedIn ? name : `Waiting for ${name}`}</Text>
            {isOnline && <Text className="text-[9px] font-bold text-mint uppercase tracking-widest">● Online</Text>}
        </View>
    </View>
);

export default function HomeScreen() {
    const router = useRouter();
    const { selectedCreature, couple, daysTogether, streak, partnerName, partnerCheckedIn, isPartnerOnline, refreshCouple } = useCreature();
    const { profile, user } = useAuth();
    const creatureData = CREATURES[selectedCreature];

    // Poll for updates (every 5s) to catch partner proposals
    useEffect(() => {
        refreshCouple();
        const interval = setInterval(refreshCouple, 5000);
        return () => clearInterval(interval);
    }, []);

    // Also refresh on focus
    useFocusEffect(
        useCallback(() => {
            refreshCouple();
        }, [])
    );

    // Check for Pending Proposals
    const isP1 = couple?.partner1_id === user?.id;
    const partnerChoice = isP1 ? couple?.p2_choice : couple?.p1_choice;
    const hasPendingProposal = !!partnerChoice;

    // Determine Mood
    const mood = streak > 2 ? 'happy' : (streak > 0 ? 'neutral' : 'sleepy');

    return (
        <View className="flex-1 bg-cream relative overflow-hidden">
            <StatusBar style="dark" />

            {/* Dynamic Background */}
            <View className="absolute inset-0 pointer-events-none">
                <LinearGradient
                    // Simplified gradient for now, actual implementation might need specific stops
                    colors={[creatureData.gradient.colors[0], '#FFF9F0', '#F0FFF4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ width: '100%', height: '100%' }}
                    className="opacity-40"
                />
            </View>

            {/* Main Container */}
            <View className="flex-1 px-6 pt-14 pb-4 justify-between">

                {/* Top Stats Bar */}
                <Animated.View entering={FadeInDown.delay(100)} className="flex-row justify-between bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white/60 shadow-sm">
                    <StatBadge label="Days Together" value={daysTogether} />
                    <StatBadge label="Streak" value={streak} isStreak />
                </Animated.View>

                {/* Center Creature Area */}
                <View className="flex-1 items-center justify-center relative">
                    {/* Floating Particles (Animated) */}
                    <FloatingParticle x={40} y={40} delay={0}><Text className="text-2xl">✨</Text></FloatingParticle>
                    <FloatingParticle x={width - 80} y={150} delay={1000}><Text className="text-2xl">🌸</Text></FloatingParticle>

                    <View className="mb-10 relative">
                        {/* Replaced Static Emoji with SVG Engine */}
                        <DynamicCreature
                            creatureId={selectedCreature}
                            mood={mood}
                            scale={1.2}
                            accessories={couple?.accessories}
                            accessoryColors={couple?.accessory_colors}
                            daysTogether={daysTogether}
                        />

                        {/* Edit Button */}
                        <Pressable
                            onPress={() => router.push('/studio')}
                            className="absolute -bottom-4 right-0 bg-white/80 p-2 rounded-full border border-white shadow-sm"
                        >
                            <Text className="text-xs">🎨</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Bottom Actions */}
                <View className="w-full gap-4">

                    {/* Action Prompt */}
                    <Animated.View entering={FadeInUp.delay(200)} className="bg-white/80 p-6 rounded-[32px] border border-white shadow-sm items-center">
                        <Text className="font-quicksand font-bold text-lg text-charcoal mb-1">Good morning! ☀️</Text>
                        <Text className="font-dmsans text-charcoal/60 font-bold mb-4">Your {couple?.creature_name || creatureData.name} is sleepy...</Text>

                        <Pressable
                            className="w-full bg-charcoal rounded-full py-4 shadow-lg active:scale-95 transition-transform"
                            onPress={() => console.log("Action Clicked")}
                        >
                            <Text className="text-white text-center font-outfit font-bold text-base">
                                Morning Cuddle Session 🤗
                            </Text>
                        </Pressable>
                    </Animated.View>

                    {/* Proposal Alert - High Priority */}
                    {hasPendingProposal && (
                        <Animated.View entering={FadeInUp.springify()} className="mb-2">
                            <Pressable
                                onPress={() => router.push('/onboarding/select-creature')}
                                className="bg-blue-500 p-4 rounded-2xl shadow-lg border-2 border-white flex-row items-center justify-between"
                            >
                                <View>
                                    <Text className="text-white font-bold text-base uppercase tracking-widest text-[10px] mb-0.5">Alert</Text>
                                    <Text className="text-white font-outfit font-bold text-lg">{partnerName} has a proposal! 🔔</Text>
                                </View>
                                <View className="bg-white/20 p-2 rounded-full">
                                    <Text className="text-white font-bold">→</Text>
                                </View>
                            </Pressable>
                        </Animated.View>
                    )}

                    {/* Partner Status */}
                    <Animated.View entering={FadeInUp.delay(300)} className="flex-row justify-between bg-white/40 p-2 rounded-3xl">
                        <PartnerStatus name={profile?.display_name || 'You'} isCheckedIn={true} isOnline={true} />
                        <PartnerStatus name={partnerName} isCheckedIn={partnerCheckedIn} isOnline={isPartnerOnline} />
                    </Animated.View>

                </View>

            </View>
        </View>
    );
}
