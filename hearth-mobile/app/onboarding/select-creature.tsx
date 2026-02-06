import { View, Text, Pressable, ScrollView, Dimensions, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import { CREATURES, CreatureType } from '../../constants/creatures';
import { LinearGradient } from 'expo-linear-gradient';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DynamicCreature } from '../../components/creatures/DynamicCreature';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS, SPACING, GRADIENTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper to get partner's name
async function getPartnerName(partnerId: string) {
    const { data } = await supabase.from('profiles').select('display_name').eq('id', partnerId).single();
    return data?.display_name || 'Partner';
}

// --- CREATURE SELECTION BUTTON ---
const CreatureOption = ({
    creature,
    isSelected,
    onPress,
    delay = 0,
}: {
    creature: typeof CREATURES['bear'];
    isSelected: boolean;
    onPress: () => void;
    delay?: number;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.9, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    return (
        <Animated.View entering={FadeInUp.delay(delay).duration(300)}>
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    animatedStyle,
                    {
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? COLORS.white : 'rgba(255,255,255,0.5)',
                        borderWidth: 3,
                        borderColor: isSelected ? COLORS.coral : 'transparent',
                        ...(isSelected ? SHADOWS.glow : SHADOWS.sm),
                    },
                ]}
            >
                <Text style={{ fontSize: 28 }}>{creature.emoji}</Text>
            </AnimatedPressable>
        </Animated.View>
    );
};

export default function CreatureSelectionScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { refreshCouple, couple } = useCreature();

    // User Roles
    const [isP1, setIsP1] = useState(false);
    const [partnerName, setPartnerName] = useState('Partner');

    // Modes
    const hasCreature = !!couple?.creature_type;
    const hasActiveProposal = couple ? (!!couple.p1_choice || !!couple.p2_choice) : false;

    // Local State
    const [renamingMode, setRenamingMode] = useState(false);
    const [selectedId, setSelectedId] = useState<CreatureType>('bear');
    const [nameInput, setNameInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [nameFocused, setNameFocused] = useState(false);

    const buttonScale = useSharedValue(1);
    const pulseScale = useSharedValue(1);

    // Derived Data
    const activeCreature = CREATURES[selectedId];

    // Collaborative Choices
    const myChoice = isP1 ? couple?.p1_choice : couple?.p2_choice;
    const partnerChoice = isP1 ? couple?.p2_choice : couple?.p1_choice;
    const myNameChoice = isP1 ? couple?.p1_name_choice : couple?.p2_name_choice;
    const partnerNameChoice = isP1 ? couple?.p2_name_choice : couple?.p1_name_choice;

    // Matching Logic
    const isCreatureMatch = myChoice && partnerChoice && myChoice === partnerChoice;
    const isNameMatch = myNameChoice?.trim().toLowerCase() === partnerNameChoice?.trim().toLowerCase();
    const isFullyMatched = isCreatureMatch && isNameMatch;

    const showProfileView = hasCreature && !hasActiveProposal && !renamingMode;

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    // Init Effect
    useEffect(() => {
        if (!user || !couple) return;
        const p1 = couple.partner1_id === user.id;
        setIsP1(p1);
        const partnerId = p1 ? couple.partner2_id : couple.partner1_id;
        if (partnerId) getPartnerName(partnerId).then(setPartnerName);
    }, [user, couple]);

    // Polling
    useEffect(() => {
        const interval = setInterval(refreshCouple, 3000);
        return () => clearInterval(interval);
    }, []);

    // Waiting pulse animation
    useEffect(() => {
        if (myChoice && !isFullyMatched) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                false
            );
        }
    }, [myChoice, isFullyMatched]);

    // Auto-update UI on existing choices
    useEffect(() => {
        if (hasCreature) {
            setSelectedId(couple.creature_type as CreatureType);
        }
        if (myChoice) {
            setSelectedId(myChoice as CreatureType);
            if (myNameChoice && !nameInput) setNameInput(myNameChoice);
        }
    }, [hasCreature, couple, myChoice, myNameChoice]);

    // --- HANDLERS ---

    const handleButtonPressIn = () => {
        buttonScale.value = withTiming(0.96, { duration: 100 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
    };

    const handleSelect = (id: CreatureType) => {
        if (renamingMode || hasCreature) return;
        if (isCreatureMatch) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedId(id);
    };

    const handleLockIn = async () => {
        if (!nameInput.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return Alert.alert('Name Needed', 'Please name your companion!');
        }
        setSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Keyboard.dismiss();
        try {
            const updates: any = {};
            const typeToLock = hasCreature ? couple.creature_type : selectedId;

            if (isP1) {
                updates.p1_choice = typeToLock;
                updates.p1_name_choice = nameInput.trim();
            } else {
                updates.p2_choice = typeToLock;
                updates.p2_name_choice = nameInput.trim();
            }

            const { error } = await supabase.from('couples').update(updates).eq('id', couple!.id);
            if (error) throw error;
            await refreshCouple();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinalize = async () => {
        setSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
            const { error } = await supabase.from('couples')
                .update({
                    creature_type: myChoice,
                    creature_name: myNameChoice,
                    p1_choice: null, p2_choice: null,
                    p1_name_choice: null, p2_name_choice: null
                })
                .eq('id', couple!.id);
            if (error) throw error;
            await refreshCouple();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            if (hasCreature) {
                setRenamingMode(false);
            } else {
                router.replace('/(tabs)');
            }
        } catch (e: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = async () => {
        setSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            const { error } = await supabase.from('couples')
                .update({ p1_choice: null, p2_choice: null, p1_name_choice: null, p2_name_choice: null })
                .eq('id', couple!.id);
            if (error) throw error;
            await refreshCouple();
            setNameInput('');
            setRenamingMode(false);
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartRename = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (couple?.creature_name) setNameInput(couple.creature_name);
        setRenamingMode(true);
    };

    const handleAcceptPartnerChoice = async () => {
        if (!partnerChoice || !partnerNameChoice) return;
        setSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            const updates: any = {};
            if (isP1) {
                updates.p1_choice = partnerChoice;
                updates.p1_name_choice = partnerNameChoice;
            } else {
                updates.p2_choice = partnerChoice;
                updates.p2_name_choice = partnerNameChoice;
            }

            await supabase.from('couples').update(updates).eq('id', couple!.id);
            await refreshCouple();
        } catch (e) {
            console.log(e);
        } finally {
            setSubmitting(false);
        }
    };

    // --- RENDERERS ---

    const renderEstablishedView = () => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg, position: 'relative' }}>
            {/* Close Button */}
            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.canGoBack() ? router.back() : router.replace('/(tabs)');
                }}
                style={{
                    position: 'absolute',
                    top: 50,
                    right: SPACING.lg,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    padding: 10,
                    borderRadius: 20,
                    zIndex: 10,
                    ...SHADOWS.sm,
                }}
            >
                <Ionicons name="close" size={24} color={COLORS.charcoal} />
            </Pressable>

            <Animated.View
                entering={FadeInDown.duration(500)}
                style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    padding: SPACING.xxl,
                    borderRadius: 40,
                    alignItems: 'center',
                    width: '100%',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.9)',
                    ...SHADOWS.lg,
                }}
            >
                <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg }}>
                    <DynamicCreature
                        creatureId={couple.creature_type || activeCreature.id}
                        mood="happy"
                        scale={1.2}
                        daysTogether={5}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.sm }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 36, color: COLORS.charcoal }}>
                        {couple?.creature_name || activeCreature.name}
                    </Text>
                    <Pressable
                        onPress={handleStartRename}
                        style={{
                            backgroundColor: 'rgba(45,45,45,0.06)',
                            padding: 10,
                            borderRadius: 20,
                        }}
                    >
                        <Feather name="edit-2" size={20} color={COLORS.coral} />
                    </Pressable>
                </View>

                <Text style={{ fontFamily: 'DMSans_700Bold', color: 'rgba(45,45,45,0.5)', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    Your Companion
                </Text>
            </Animated.View>
        </View>
    );

    const renderDecisionView = () => (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <View style={{ paddingTop: 50, paddingHorizontal: SPACING.lg, justifyContent: 'space-between', flex: 1 }}>
                {/* Header */}
                <Animated.View entering={FadeInDown.duration(400)} style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 32, color: COLORS.charcoal, textAlign: 'center' }}>
                        {renamingMode || hasCreature ? 'Update Companion' : 'Sync Minds'}
                    </Text>
                    <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 16, color: 'rgba(45,45,45,0.6)', textAlign: 'center', marginTop: 8 }}>
                        Deciding with <Text style={{ fontFamily: 'DMSans_700Bold', color: COLORS.coral }}>{partnerName}</Text>
                    </Text>
                </Animated.View>

                {/* Main Card */}
                <Animated.View
                    key={selectedId}
                    entering={FadeInUp.springify()}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.9)',
                        borderRadius: 40,
                        padding: SPACING.lg,
                        alignItems: 'center',
                        marginBottom: SPACING.lg,
                        ...SHADOWS.md,
                    }}
                >
                    <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md }}>
                        <DynamicCreature
                            creatureId={activeCreature.id}
                            mood="happy"
                            scale={1.1}
                            daysTogether={0}
                        />
                    </View>
                    <Text style={{ fontFamily: 'Outfit_700Bold', fontSize: 24, color: COLORS.charcoal, marginBottom: SPACING.sm }}>
                        {activeCreature.name}
                    </Text>

                    {/* Creature Selector */}
                    {!hasCreature && !myChoice && (
                        <View style={{ marginTop: SPACING.md, marginBottom: SPACING.sm }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 14, paddingHorizontal: SPACING.sm }}
                            >
                                {Object.values(CREATURES).map((c, index) => (
                                    <CreatureOption
                                        key={c.id}
                                        creature={c}
                                        isSelected={selectedId === c.id}
                                        onPress={() => handleSelect(c.id as CreatureType)}
                                        delay={index * 50}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </Animated.View>

                {/* Name Input */}
                {!myChoice && (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(400)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            padding: SPACING.md,
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.8)',
                            marginBottom: SPACING.lg,
                            ...SHADOWS.sm,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 11,
                                fontFamily: 'DMSans_700Bold',
                                color: nameFocused ? COLORS.coral : 'rgba(45,45,45,0.5)',
                                letterSpacing: 1.2,
                                textTransform: 'uppercase',
                                marginBottom: 10,
                                marginLeft: 4,
                            }}
                        >
                            {renamingMode || hasCreature ? 'Propose New Name' : 'Name your companion'}
                        </Text>
                        <TextInput
                            value={nameInput}
                            onChangeText={setNameInput}
                            placeholder="e.g. Barnaby..."
                            placeholderTextColor="rgba(45,45,45,0.35)"
                            onFocus={() => setNameFocused(true)}
                            onBlur={() => setNameFocused(false)}
                            style={{
                                backgroundColor: COLORS.white,
                                padding: SPACING.md,
                                borderRadius: 16,
                                fontSize: 18,
                                fontFamily: 'Outfit_600SemiBold',
                                color: COLORS.charcoal,
                                borderWidth: 2,
                                borderColor: nameFocused ? COLORS.coral : 'rgba(45,45,45,0.05)',
                            }}
                        />
                    </Animated.View>
                )}

                {/* Status Overlay */}
                {renderMatchStatus()}

                {/* Lock In Button */}
                {!myChoice && (
                    <View style={{ gap: SPACING.md }}>
                        <AnimatedPressable
                            onPress={handleLockIn}
                            onPressIn={handleButtonPressIn}
                            onPressOut={handleButtonPressOut}
                            disabled={submitting || !nameInput.trim()}
                            style={buttonAnimatedStyle}
                        >
                            <LinearGradient
                                colors={nameInput.trim() ? [COLORS.charcoal, '#1a1a1a'] : ['rgba(45,45,45,0.3)', 'rgba(45,45,45,0.4)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    width: '100%',
                                    paddingVertical: 18,
                                    borderRadius: 28,
                                    alignItems: 'center',
                                    ...SHADOWS.md,
                                }}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={{ color: COLORS.cream, fontFamily: 'Outfit_700Bold', fontSize: 17 }}>
                                        {renamingMode || hasCreature ? 'Propose Update 🔒' : 'Lock In Choice 🔒'}
                                    </Text>
                                )}
                            </LinearGradient>
                        </AnimatedPressable>
                        {renamingMode && (
                            <Pressable onPress={() => setRenamingMode(false)} style={{ paddingVertical: 8 }}>
                                <Text style={{ textAlign: 'center', fontSize: 13, fontFamily: 'DMSans_700Bold', color: 'rgba(45,45,45,0.4)', textDecorationLine: 'underline' }}>
                                    Cancel
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );

    const renderMatchStatus = () => {
        if (isFullyMatched) {
            return (
                <Animated.View entering={FadeInUp.duration(400)} style={{ width: '100%', marginBottom: SPACING.lg, gap: SPACING.md }}>
                    <View
                        style={{
                            backgroundColor: 'rgba(168,220,192,0.25)',
                            borderWidth: 2,
                            borderColor: COLORS.mint,
                            padding: SPACING.md,
                            borderRadius: 24,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: COLORS.mint, fontFamily: 'DMSans_700Bold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>
                            Agreed! ✨
                        </Text>
                        <Text style={{ color: COLORS.charcoal, fontFamily: 'Outfit_600SemiBold', textAlign: 'center', fontSize: 18 }}>
                            New name: <Text style={{ fontFamily: 'Outfit_700Bold' }}>{myNameChoice}</Text>
                        </Text>
                    </View>
                    <AnimatedPressable
                        onPress={handleFinalize}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        disabled={submitting}
                        style={buttonAnimatedStyle}
                    >
                        <LinearGradient
                            colors={GRADIENTS.mintSky}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: '100%',
                                paddingVertical: 18,
                                borderRadius: 28,
                                alignItems: 'center',
                                ...SHADOWS.mintGlow,
                            }}
                        >
                            <Text style={{ color: COLORS.white, fontFamily: 'Outfit_700Bold', fontSize: 17 }}>
                                Confirm Change ✅
                            </Text>
                        </LinearGradient>
                    </AnimatedPressable>
                </Animated.View>
            );
        }

        if (isCreatureMatch && !isNameMatch && myNameChoice && partnerNameChoice) {
            return (
                <View
                    style={{
                        backgroundColor: 'rgba(255,200,138,0.2)',
                        borderWidth: 2,
                        borderColor: '#FFC88A',
                        padding: SPACING.md,
                        borderRadius: 24,
                        marginBottom: SPACING.md,
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Text style={{ color: '#D97706', fontFamily: 'DMSans_700Bold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: SPACING.sm }}>
                        Different Names
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg, marginTop: SPACING.sm }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: COLORS.charcoal }}>{myNameChoice}</Text>
                            <Text style={{ fontSize: 12, color: 'rgba(45,45,45,0.5)' }}>You</Text>
                        </View>
                        <Text style={{ fontSize: 20, color: 'rgba(45,45,45,0.3)' }}>vs</Text>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: COLORS.charcoal }}>{partnerNameChoice}</Text>
                            <Text style={{ fontSize: 12, color: 'rgba(45,45,45,0.5)' }}>{partnerName}</Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={handleAcceptPartnerChoice}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            paddingVertical: 14,
                            paddingHorizontal: SPACING.lg,
                            borderRadius: 16,
                            marginBottom: SPACING.sm,
                            width: '100%',
                            ...SHADOWS.sm,
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontFamily: 'DMSans_700Bold', color: COLORS.charcoal }}>
                            Agree to "{partnerNameChoice}"
                        </Text>
                    </Pressable>
                    <Pressable onPress={handleReset} style={{ paddingVertical: 8 }}>
                        <Text style={{ textAlign: 'center', fontSize: 12, fontFamily: 'DMSans_700Bold', color: 'rgba(45,45,45,0.4)', textDecorationLine: 'underline' }}>
                            Change My Input
                        </Text>
                    </Pressable>
                </View>
            );
        }

        if (myChoice) {
            return (
                <Animated.View
                    style={[
                        pulseStyle,
                        {
                            backgroundColor: 'rgba(45,45,45,0.05)',
                            padding: SPACING.md,
                            borderRadius: 24,
                            marginBottom: SPACING.md,
                            alignItems: 'center',
                        },
                    ]}
                >
                    <Text style={{ color: 'rgba(45,45,45,0.6)', fontFamily: 'DMSans_700Bold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>
                        Waiting...
                    </Text>
                    <Text style={{ color: COLORS.charcoal, fontFamily: 'Outfit_400Regular', textAlign: 'center' }}>
                        Waiting for {partnerName} to agree...
                    </Text>
                    <Pressable onPress={handleReset} style={{ marginTop: SPACING.sm }}>
                        <Text style={{ color: 'rgba(45,45,45,0.4)', fontFamily: 'DMSans_700Bold', fontSize: 12, textDecorationLine: 'underline' }}>
                            Cancel Proposal
                        </Text>
                    </Pressable>
                </Animated.View>
            );
        }

        if (partnerChoice) {
            return (
                <View
                    style={{
                        backgroundColor: 'rgba(180,229,248,0.25)',
                        borderWidth: 2,
                        borderColor: COLORS.sky,
                        padding: SPACING.md,
                        borderRadius: 24,
                        marginBottom: SPACING.md,
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Text style={{ color: '#0EA5E9', fontFamily: 'DMSans_700Bold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>
                        Update Proposed
                    </Text>
                    <Text style={{ color: COLORS.charcoal, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginBottom: 4 }}>
                        {partnerName} wants to name the companion:
                    </Text>
                    <Text style={{ color: COLORS.coral, fontFamily: 'Outfit_700Bold', fontSize: 26, marginBottom: SPACING.md }}>
                        "{partnerNameChoice}"
                    </Text>
                    <Pressable
                        onPress={handleAcceptPartnerChoice}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            paddingVertical: 14,
                            paddingHorizontal: SPACING.lg,
                            borderRadius: 16,
                            width: '100%',
                            marginBottom: SPACING.sm,
                            borderWidth: 1,
                            borderColor: COLORS.sky,
                            ...SHADOWS.sm,
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontFamily: 'DMSans_700Bold', color: '#0EA5E9' }}>
                            Sync with Partner 🔄
                        </Text>
                    </Pressable>
                    <Pressable onPress={handleReset} style={{ paddingVertical: 8 }}>
                        <Text style={{ color: '#EF4444', fontFamily: 'DMSans_700Bold', fontSize: 12, textDecorationLine: 'underline' }}>
                            Decline & Reset
                        </Text>
                    </Pressable>
                </View>
            );
        }

        return null;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: COLORS.cream, position: 'relative' }}>
                <StatusBar style="dark" />

                {/* Background Gradient */}
                <LinearGradient
                    colors={[activeCreature.gradient.colors[0] + '40', COLORS.cream]}
                    style={{ position: 'absolute', width: '100%', height: '60%' }}
                />

                {/* Decorative Stars */}
                <Animated.Text
                    entering={FadeInDown.delay(500)}
                    style={{ position: 'absolute', top: 100, right: 30, fontSize: 28, opacity: 0.12 }}
                >
                    ✦
                </Animated.Text>
                <Animated.Text
                    entering={FadeInDown.delay(700)}
                    style={{ position: 'absolute', top: 180, left: 25, fontSize: 20, opacity: 0.1 }}
                >
                    ✦
                </Animated.Text>

                {showProfileView ? renderEstablishedView() : renderDecisionView()}
            </View>
        </KeyboardAvoidingView>
    );
}
