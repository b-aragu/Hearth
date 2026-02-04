import { View, Text, Pressable, TextInput, Clipboard, ActivityIndicator, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useCreature } from '../../context/CreatureContext';
import { supabase } from '../../lib/supabase';

export default function PairingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { refreshCouple, couple } = useCreature();
    const [mode, setMode] = useState<'initial' | 'creating' | 'joining'>('initial');
    const [inviteCode, setInviteCode] = useState('');
    const [joinInput, setJoinInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);

    // If we land here and already have a couple with a code but no partner, show "Waiting" mode
    useEffect(() => {
        if (couple && couple.invite_code && !couple.partner2_id) {
            setMode('creating');
            setInviteCode(couple.invite_code);
        }
    }, [couple]);

    // Poll for partner connection if waiting
    useEffect(() => {
        if (mode === 'creating' && inviteCode) {
            const interval = setInterval(async () => {
                await refreshCouple();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [mode, inviteCode]);

    // AUTO-REDIRECT: When partner is found, let Index handle the next step (Name or Creature)
    useEffect(() => {
        if (couple && couple.partner2_id) {
            router.replace('/');
        }
    }, [couple]);

    const handleCreateHome = async () => {
        if (!user) return;
        setLoading(true);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        try {
            // Create a couple record with NO creature selected yet
            const { error } = await supabase.from('couples').insert({
                partner1_id: user.id,
                invite_code: code,
                // We'll let creature_type be null or handle it if DB requires it. 
                // Previous flow had 'bear' as default, let's see. 
                // Ideally schema allows null. If not, we might need a dummy or 'bear'.
                creature_type: 'bear' // Defaulting to bear for DB constraint safety, will re-select later.
            });

            if (error) throw error;

            setInviteCode(code);
            setMode('creating');
            await refreshCouple();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinHome = async () => {
        if (!user || !joinInput || joinInput.length < 6) return;
        setLoading(true);
        console.log("[Pairing] Attempting to join with code:", joinInput);
        try {
            const { data: foundCouple, error: findError } = await supabase
                .from('couples')
                .select('*')
                .eq('invite_code', joinInput.toUpperCase())
                .maybeSingle();

            if (findError) console.error("[Pairing] Find Error:", findError);
            if (!foundCouple) {
                console.log("[Pairing] No couple found with that code");
                throw new Error("Invalid Invite Code");
            }

            console.log("[Pairing] Found couple:", foundCouple);

            if (foundCouple.partner2_id) throw new Error("This home is full!");
            if (foundCouple.partner1_id === user.id) throw new Error("You can't join your own home!");

            console.log("[Pairing] Attempting update...");
            const { error: updateError, data: updateData } = await supabase
                .from('couples')
                .update({ partner2_id: user.id })
                .eq('id', foundCouple.id)
                .select(); // Select to verify the return

            if (updateError) {
                console.error("[Pairing] Update Error:", updateError);
                throw updateError;
            }

            console.log("[Pairing] Update Success:", updateData);

            // Success - refresh context which should trigger redirect
            await refreshCouple();
        } catch (e: any) {
            console.error("[Pairing] Exception:", e);
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setString(inviteCode);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const shareCode = async () => {
        try {
            await Share.share({
                message: `Join me on Hearth! Here is our invite code: ${inviteCode}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View className="flex-1 bg-cream items-center justify-center p-6">
            <StatusBar style="dark" />

            {/* Background Blob */}
            <View className="absolute w-[500px] h-[500px] bg-coral/10 rounded-full blur-3xl -top-20 -left-20" />

            <View className="w-full max-w-sm">

                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100)} className="mb-10 text-center">
                    <Text className="font-outfit font-bold text-4xl text-charcoal text-center mb-2">
                        {mode === 'creating' ? 'Waiting for Partner' : 'Start Your Journey'}
                    </Text>
                    <Text className="font-dmsans text-charcoal/60 text-center text-lg">
                        {mode === 'creating'
                            ? "Share this code with your partner to link your accounts."
                            : "Hearth is designed for two. Invite your partner or join them!"}
                    </Text>
                </Animated.View>

                {mode === 'initial' && (
                    <Animated.View entering={FadeInUp.delay(200)} className="gap-4">
                        <Pressable
                            onPress={handleCreateHome}
                            disabled={loading}
                            className="bg-coral py-5 rounded-2xl shadow-lg active:scale-95 transition-transform"
                        >
                            {loading ? <ActivityIndicator color="white" /> : (
                                <View className="flex-row items-center justify-center space-x-2">
                                    <Text className="text-white font-bold text-xl font-outfit">Create New Home</Text>
                                </View>
                            )}
                        </Pressable>

                        <View className="flex-row items-center my-2">
                            <View className="flex-1 h-[1px] bg-charcoal/10" />
                            <Text className="mx-4 text-charcoal/40 font-dmsans">OR</Text>
                            <View className="flex-1 h-[1px] bg-charcoal/10" />
                        </View>

                        <Pressable
                            onPress={() => setMode('joining')}
                            className="bg-white border-2 border-charcoal/10 py-5 rounded-2xl active:scale-95 transition-transform"
                        >
                            <Text className="text-charcoal font-bold text-xl font-outfit text-center">I Have a Code</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {mode === 'creating' && (
                    <Animated.View entering={FadeInUp.springify()} className="bg-white p-8 rounded-[32px] shadow-sm border border-charcoal/5 items-center">
                        <Text className="font-dmsans text-charcoal/40 mb-2 uppercase tracking-widest text-xs font-bold">Your Invite Code</Text>

                        <Pressable onPress={copyToClipboard}>
                            <Text className="font-outfit font-bold text-6xl text-charcoal tracking-widest mb-2 text-center" style={{ fontFamily: 'Menlo' }}>
                                {inviteCode}
                            </Text>
                        </Pressable>

                        <View className="flex-row gap-2 mb-6">
                            <Pressable onPress={copyToClipboard} className="bg-charcoal/5 px-4 py-2 rounded-full">
                                <Text className="text-charcoal/60 font-bold">{copyFeedback ? 'Copied!' : 'Tap to Copy'}</Text>
                            </Pressable>
                            <Pressable onPress={shareCode} className="bg-coral/10 px-4 py-2 rounded-full">
                                <Text className="text-coral font-bold">Share</Text>
                            </Pressable>
                        </View>

                        <View className="flex-row items-center space-x-3 bg-cream/50 px-4 py-2 rounded-xl">
                            <ActivityIndicator color="#FFB7B2" />
                            <Text className="text-charcoal/50 text-sm font-dmsans italic">Waiting for connection...</Text>
                        </View>
                    </Animated.View>
                )}

                {mode === 'joining' && (
                    <Animated.View entering={FadeInUp.springify()} className="bg-white p-6 rounded-[32px] shadow-sm border border-charcoal/5">
                        <Pressable onPress={() => setMode('initial')} className="self-start mb-4">
                            <Text className="text-charcoal/40 text-sm">← Back</Text>
                        </Pressable>

                        <Text className="font-dmsans text-charcoal/60 mb-2 text-center">Enter the code from your partner</Text>

                        <TextInput
                            className="bg-cream/50 p-4 rounded-xl border border-charcoal/10 font-outfit text-center text-3xl font-bold tracking-widest mb-6 text-charcoal"
                            placeholder="CODE"
                            autoCapitalize="characters"
                            maxLength={6}
                            value={joinInput}
                            onChangeText={setJoinInput}
                            autoFocus
                        />

                        <Pressable
                            onPress={handleJoinHome}
                            disabled={loading || joinInput.length < 6}
                            className={`w-full bg-coral py-4 rounded-xl shadow-md active:scale-95 transition-transform ${loading || joinInput.length < 6 ? 'opacity-50' : ''}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-bold text-lg font-outfit">Join Partner</Text>}
                        </Pressable>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}
