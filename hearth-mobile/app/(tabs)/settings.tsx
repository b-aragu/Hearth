import { View, Text, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useCreature } from '../../context/CreatureContext';
import { useAuth } from '../../context/AuthContext';
import { CREATURES } from '../../constants/creatures';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const SettingItem = ({ icon, label, value, onPress, isLink }: { icon: string, label: string, value?: string, onPress?: () => void, isLink?: boolean }) => (
    <Pressable
        onPress={onPress}
        className={`flex-row items-center justify-between p-4 bg-white/60 mb-3 rounded-2xl border border-white/50 ${onPress ? 'active:opacity-70' : ''}`}
    >
        <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                <Text className="text-xl">{icon}</Text>
            </View>
            <Text className="text-base font-bold text-charcoal">{label}</Text>
        </View>

        {value && <Text className="font-dmsans text-charcoal/50 font-bold">{value}</Text>}
        {isLink && <Text className="text-charcoal/40 text-lg">›</Text>}
    </Pressable>
);

export default function SettingsScreen() {
    const router = useRouter();
    const { selectedCreature, couple, partnerName } = useCreature();
    const { user, profile, signOut, refreshProfile } = useAuth();
    const creature = CREATURES[selectedCreature];

    // Edit Name State
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(profile?.display_name || '');
    const [saving, setSaving] = useState(false);

    const handleSaveName = async () => {
        if (!newName.trim() || !user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ display_name: newName.trim() })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile(); // Immediate update
            setIsEditingName(false);
            Alert.alert("Success", "Name updated successfully!");
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-cream">
            <StatusBar style="dark" />

            {/* Edit Name Modal */}
            <Modal transparent visible={isEditingName} animationType="fade">
                <View className="flex-1 bg-black/50 items-center justify-center px-6">
                    <View className="bg-white w-full p-6 rounded-3xl">
                        <Text className="font-outfit font-bold text-xl text-charcoal mb-4">Update Name</Text>
                        <TextInput
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Your Name"
                            className="bg-charcoal/5 p-4 rounded-xl text-lg font-bold text-charcoal mb-4"
                            autoFocus
                        />
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setIsEditingName(false)}
                                className="flex-1 py-3 bg-charcoal/10 rounded-xl items-center"
                            >
                                <Text className="font-bold text-charcoal/60">Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleSaveName}
                                disabled={saving}
                                className="flex-1 py-3 bg-charcoal rounded-xl items-center"
                            >
                                <Text className="font-bold text-white">{saving ? 'Saving...' : 'Save'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView className="flex-1 px-6 pt-16">
                <Text className="font-outfit font-bold text-3xl text-charcoal mb-8">Us</Text>

                {/* Profile Card */}
                <View className="bg-white rounded-[32px] p-6 mb-8 border border-white shadow-sm relative overflow-hidden">
                    <LinearGradient
                        colors={['rgba(255,183,178,0.1)', 'rgba(255,218,193,0.2)']}
                        className="absolute inset-0"
                    />
                    <View className="flex-row items-center justify-between mb-6">
                        <Pressable onPress={() => { setNewName(profile?.display_name || ''); setIsEditingName(true); }} className="items-center">
                            <View className="w-16 h-16 bg-lavender rounded-full items-center justify-center border-4 border-white shadow-sm mb-2 relative">
                                <Text className="text-2xl">👤</Text>
                                <View className="absolute bottom-0 right-0 bg-charcoal rounded-full p-1 border-2 border-white">
                                    <Text className="text-[10px] text-white">✏️</Text>
                                </View>
                            </View>
                            <Text className="font-bold text-charcoal">{profile?.display_name || 'You'}</Text>
                        </Pressable>

                        <View className="h-0.5 flex-1 bg-charcoal/10 mx-4" />
                        <View className="w-8 h-8 rounded-full bg-white border border-charcoal/10 items-center justify-center absolute left-1/2 -ml-4 top-[22px]">
                            <Text className="text-xs">❤️</Text>
                        </View>

                        <View className="items-center">
                            <View className="w-16 h-16 bg-mint/20 rounded-full items-center justify-center border-4 border-white shadow-sm mb-2">
                                <Text className="text-2xl">👤</Text>
                            </View>
                            <Text className="font-bold text-charcoal">{partnerName}</Text>
                        </View>
                    </View>

                    <View className="bg-charcoal/5 py-3 rounded-full items-center">
                        <Text className="text-charcoal/60 font-bold font-dmsans text-xs tracking-widest uppercase">Since {couple?.matched_at ? new Date(couple.matched_at).toLocaleDateString() : 'Forever'}</Text>
                    </View>
                </View>

                {/* Invite Code Display */}
                <View className="bg-white p-4 rounded-xl items-center mb-8 border border-charcoal/5 shadow-sm">
                    <Text className="text-xs text-charcoal/50 font-bold uppercase tracking-widest mb-1">Your Invite Code</Text>
                    <Text className="text-3xl font-outfit font-bold text-coral selection:bg-coral/20 tracking-widest">
                        {couple?.invite_code || '---'}
                    </Text>
                    <Text className="text-xs text-charcoal/40 mt-2 font-dmsans">Share this with your partner to link up.</Text>
                </View>

                {/* Settings Groups */}
                <Text className="font-dmsans font-bold text-charcoal/40 uppercase text-xs mb-4 ml-2 tracking-widest">Preferences</Text>

                <SettingItem
                    icon="🔔"
                    label="Notifications"
                    value="On"
                    onPress={() => { }}
                />
                <SettingItem
                    icon={creature.emoji}
                    label="Companion"
                    value={couple?.creature_name || creature.name}
                    onPress={() => router.push('/onboarding/select-creature')}
                    isLink
                />

                <Text className="font-dmsans font-bold text-charcoal/40 uppercase text-xs mb-4 ml-2 mt-4 tracking-widest">Extras</Text>

                <SettingItem
                    icon="📱"
                    label="Home Screen Widgets"
                    onPress={() => router.push('/widgets')}
                    isLink
                />
                <SettingItem
                    icon="🔒"
                    label="Lock Screen Widgets"
                    onPress={() => router.push('/widgets')}
                    isLink
                />

                <SettingItem
                    icon="🧪"
                    label="Developer Lab"
                    value="Growth Simulator"
                    onPress={() => router.push('/dev/gallery')}
                    isLink
                />

                <Pressable
                    onPress={() => signOut()}
                    className="mt-8 mb-12 p-4 bg-red-50 rounded-2xl items-center border border-red-100 active:bg-red-100"
                >
                    <Text className="text-red-500 font-bold font-dmsans">Sign Out</Text>
                </Pressable>

            </ScrollView>
        </View>
    );
}
