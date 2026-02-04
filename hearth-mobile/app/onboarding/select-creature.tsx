import { View, Text, Pressable, ScrollView, Dimensions, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { CREATURES, CreatureType } from '../../constants/creatures';
import { LinearGradient } from 'expo-linear-gradient';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Helper to get partner's name
async function getPartnerName(partnerId: string) {
    const { data } = await supabase.from('profiles').select('display_name').eq('id', partnerId).single();
    return data?.display_name || 'Partner';
}

export default function CreatureSelectionScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { refreshCouple, couple } = useCreature();

    // User Roles
    const [isP1, setIsP1] = useState(false);
    const [partnerName, setPartnerName] = useState('Partner');

    // Modes
    const hasCreature = !!couple?.creature_type;
    // We are in "Active Decision" mode if ANY temporary choice exists in DB
    const hasActiveProposal = couple ? (!!couple.p1_choice || !!couple.p2_choice) : false;

    // Local State
    const [renamingMode, setRenamingMode] = useState(false);
    const [selectedId, setSelectedId] = useState<CreatureType>('bear');
    const [nameInput, setNameInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    // VIEW LOGIC: Show Profile ONLY if established AND no active decision being made
    const showProfileView = hasCreature && !hasActiveProposal && !renamingMode;

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

    // Auto-update UI on existing choices
    useEffect(() => {
        if (hasCreature) {
            setSelectedId(couple.creature_type as CreatureType);
        }

        // If I have a pending choice, sync input
        if (myChoice) {
            setSelectedId(myChoice as CreatureType);
            if (myNameChoice && !nameInput) setNameInput(myNameChoice);
        }
    }, [hasCreature, couple, myChoice, myNameChoice]);


    // --- HANDLERS ---

    const handleSelect = (id: CreatureType) => {
        if (renamingMode || hasCreature) return; // Locked if renaming or already has creature
        if (isCreatureMatch) return;
        setSelectedId(id);
    };

    const handleLockIn = async () => {
        if (!nameInput.trim()) return Alert.alert("Name Needed", "Please name your companion!");
        setSubmitting(true);
        Keyboard.dismiss();
        try {
            const updates: any = {};
            // If renaming, ensure we lock the ID to the current type
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
        } catch (e: any) { Alert.alert('Error', e.message); }
        finally { setSubmitting(false); }
    };

    const handleFinalize = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase.from('couples')
                .update({
                    creature_type: myChoice,
                    creature_name: myNameChoice,
                    // CLEAR temporary choices to return to "Peaceful/Profile" state
                    p1_choice: null, p2_choice: null,
                    p1_name_choice: null, p2_name_choice: null
                })
                .eq('id', couple!.id);
            if (error) throw error;
            await refreshCouple();

            // If we were effectively editing, this brings us back to profile view
            // If we were onboarding, we go home
            if (hasCreature) {
                setRenamingMode(false);
            } else {
                router.replace('/(tabs)');
            }
        } catch (e: any) { Alert.alert('Error', e.message); }
        finally { setSubmitting(false); }
    };

    const handleReset = async () => {
        setSubmitting(true);
        try {
            const { error } = await supabase.from('couples')
                .update({ p1_choice: null, p2_choice: null, p1_name_choice: null, p2_name_choice: null })
                .eq('id', couple!.id);
            if (error) throw error;
            await refreshCouple();
            setNameInput('');
            setRenamingMode(false);
        } catch (e: any) { Alert.alert('Error', e.message); }
        finally { setSubmitting(false); }
    };

    const handleStartRename = () => {
        if (couple?.creature_name) setNameInput(couple.creature_name);
        setRenamingMode(true);
    };

    const handleAcceptPartnerChoice = async () => {
        if (!partnerChoice || !partnerNameChoice) return;
        setSubmitting(true);
        try {
            const updates: any = {};
            if (isP1) { updates.p1_choice = partnerChoice; updates.p1_name_choice = partnerNameChoice; }
            else { updates.p2_choice = partnerChoice; updates.p2_name_choice = partnerNameChoice; }

            await supabase.from('couples').update(updates).eq('id', couple!.id);
            await refreshCouple();
        } catch (e) { console.log(e); }
        finally { setSubmitting(false); }
    };

    // --- RENDERERS ---

    const renderEstablishedView = () => (
        <View className="flex-1 items-center justify-center p-6 relative">
            {/* Close Button */}
            <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} className="absolute top-12 right-6 bg-white/50 p-2 rounded-full z-10">
                <Ionicons name="close" size={24} color="#4B5563" />
            </Pressable>

            <View className="bg-white/60 p-10 rounded-[40px] items-center shadow-lg w-full mb-8">
                <Text className="text-[130px] mb-6">{activeCreature.emoji}</Text>

                <View className="flex-row items-center justify-center gap-3 mb-2">
                    <Text className="font-outfit font-bold text-4xl text-charcoal">{couple?.creature_name || activeCreature.name}</Text>
                    <Pressable onPress={handleStartRename} className="bg-charcoal/5 p-2 rounded-full">
                        <Feather name="edit-2" size={20} color="#EA580C" />
                    </Pressable>
                </View>

                <Text className="font-dmsans text-charcoal/50 font-bold uppercase tracking-widest text-xs">Your Companion</Text>
            </View>
        </View>
    );

    const renderDecisionView = () => (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <View className="pt-12 px-6 justify-between flex-1">
                {/* Header */}
                <View className="items-center mb-6">
                    <Text className="font-outfit font-bold text-3xl text-charcoal text-center">
                        {renamingMode || hasCreature ? 'Update Companion' : 'Sync Minds'}
                    </Text>
                    <Text className="font-dmsans text-charcoal/60 text-base text-center mt-1">Deciding with <Text className="font-bold text-coral">{partnerName}</Text></Text>
                </View>

                {/* Main Card */}
                <Animated.View key={selectedId} entering={FadeInUp.springify()} className="bg-white/60 border border-white/80 rounded-[40px] p-6 items-center shadow-sm mb-6">
                    <Text className="text-[100px] mb-4">{activeCreature.emoji}</Text>
                    <Text className="font-outfit font-bold text-2xl text-charcoal mb-1">{activeCreature.name}</Text>

                    {/* Show Scroller ONLY if NOT established/locked */}
                    {!hasCreature && !myChoice && (
                        <View className="h-20 mb-2 mt-2">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 10 }}>
                                {Object.values(CREATURES).map((c) => (
                                    <Pressable key={c.id} onPress={() => handleSelect(c.id as CreatureType)} className={`w-16 h-16 rounded-full items-center justify-center border-2 ${selectedId === c.id ? 'bg-white border-coral scale-110' : 'bg-white/40 border-transparent'}`}>
                                        <Text className="text-2xl">{c.emoji}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </Animated.View>

                {/* Name Input - Show if we need to vote */}
                {!myChoice && (
                    <View className="bg-white/50 p-4 rounded-2xl border border-white/60 mb-6">
                        <Text className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-2 ml-1">
                            {renamingMode || hasCreature ? 'Propose New Name' : 'Name your companion'}
                        </Text>
                        <TextInput
                            value={nameInput} onChangeText={setNameInput} placeholder="e.g. Barnaby..."
                            className="bg-white p-4 rounded-xl text-lg font-outfit text-charcoal border border-charcoal/5"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                )}

                {/* Status Overlay */}
                {renderMatchStatus()}

                {/* Lock In Button */}
                {!myChoice && (
                    <View className="gap-3">
                        <Pressable onPress={handleLockIn} disabled={submitting} className={`w-full bg-charcoal py-5 rounded-full shadow-lg ${!nameInput.trim() ? 'opacity-50' : ''}`}>
                            {submitting ? <ActivityIndicator color="white" /> : <Text className="text-cream text-center font-bold text-lg">{renamingMode || hasCreature ? 'Propose Update' : 'Lock In Choice'} 🔒</Text>}
                        </Pressable>
                        {renamingMode && (
                            <Pressable onPress={() => setRenamingMode(false)} className="py-2"><Text className="text-center text-xs font-bold text-charcoal/40 underline">Cancel</Text></Pressable>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );

    const renderMatchStatus = () => {
        if (isFullyMatched) {
            return (
                <View className="w-full mb-6 gap-3">
                    <View className="bg-mint/20 border border-mint p-4 rounded-2xl items-center"><Text className="text-mint font-bold uppercase text-xs tracking-widest mb-1">Agreed! ✨</Text><Text className="text-charcoal font-outfit text-center text-lg">New name: <Text className="font-bold">{myNameChoice}</Text></Text></View>
                    <Pressable onPress={handleFinalize} disabled={submitting} className="w-full bg-charcoal py-5 rounded-full shadow-lg"><Text className="text-cream text-center font-bold text-lg">Confirm Change ✅</Text></Pressable>
                </View>
            );
        }
        if (isCreatureMatch && !isNameMatch && myNameChoice && partnerNameChoice) {
            return (
                <View className="bg-yellow/10 border border-yellow p-4 rounded-2xl mb-4 items-center w-full">
                    <Text className="text-yellow-600 font-bold uppercase text-xs tracking-widest mb-1">Different Names</Text>
                    <View className="flex-row justify-between w-full px-8 mb-6 mt-2">
                        <View className="items-center"><Text className="text-lg font-bold text-charcoal">{myNameChoice}</Text><Text className="text-xs text-charcoal/50">You</Text></View>
                        <Text className="text-xl text-charcoal/30">vs</Text>
                        <View className="items-center"><Text className="text-lg font-bold text-charcoal">{partnerNameChoice}</Text><Text className="text-xs text-charcoal/50">{partnerName}</Text></View>
                    </View>
                    <Pressable onPress={handleAcceptPartnerChoice} className="bg-white/80 py-3 px-6 rounded-xl mb-2 w-full"><Text className="text-center font-bold text-charcoal">Agree to "{partnerNameChoice}"</Text></Pressable>
                    <Pressable onPress={handleReset} className="py-2"><Text className="text-center text-xs font-bold text-charcoal/40 underline">Change My Input</Text></Pressable>
                </View>
            );
        }
        if (myChoice) {
            return (
                <View className="bg-charcoal/5 p-4 rounded-2xl mb-4 items-center animate-pulse">
                    <Text className="text-charcoal/60 font-bold uppercase text-xs tracking-widest mb-1">Waiting...</Text>
                    <Text className="text-charcoal font-outfit text-center">Waiting for {partnerName} to agree...</Text>
                    <Pressable onPress={handleReset} className="mt-2"><Text className="text-charcoal/40 font-bold text-xs underline">Cancel Proposal</Text></Pressable>
                </View>
            );
        }
        if (partnerChoice) return (
            <View className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-4 items-center w-full">
                <Text className="text-blue-500 font-bold uppercase text-xs tracking-widest mb-1">Update Proposed</Text>
                <Text className="text-charcoal font-outfit text-center mb-1">{partnerName} wants to name the companion:</Text>
                <Text className="text-coral font-outfit font-bold text-2xl mb-4">"{partnerNameChoice}"</Text>
                <Pressable onPress={handleAcceptPartnerChoice} className="bg-white py-3 px-6 rounded-xl w-full border border-blue-100 mb-3"><Text className="text-center font-bold text-blue-600">Sync with Partner 🔄</Text></Pressable>
                <Pressable onPress={handleReset} className="py-2"><Text className="text-red-400 font-bold text-xs underline">Decline & Reset</Text></Pressable>
            </View>
        );
        return null;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
            <View className="flex-1 bg-cream relative">
                <StatusBar style="dark" />
                <LinearGradient
                    colors={[activeCreature.gradient.colors[0], '#FFF9F0']}
                    style={{ position: 'absolute', width: '100%', height: '60%' }}
                    className="opacity-30"
                />

                {showProfileView ? renderEstablishedView() : renderDecisionView()}
            </View>
        </KeyboardAvoidingView>
    );
}
