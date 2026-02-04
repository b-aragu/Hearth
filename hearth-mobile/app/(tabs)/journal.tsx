import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useCreature } from '../../context/CreatureContext';

// Types
type MemoryType = 'Daily' | 'Growth' | 'Milestone' | 'Decision';

interface Memory {
    id: string;
    created_at: string;
    type: MemoryType;
    title: string;
    description: string;
    image_emoji?: string;
    color_theme: 'mint' | 'coral' | 'lavender';
}

const MemoryCard = ({ memory, index }: { memory: Memory; index: number }) => (
    <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        className="bg-white/90 rounded-3xl p-5 mb-4 border border-white/60 shadow-sm relative overflow-hidden"
    >
        {/* Left Border Decoration */}
        <LinearGradient
            colors={['#FFB7B2', '#FFDAC1']}
            className="absolute left-0 top-0 bottom-0 w-1.5"
        />

        <View className="flex-row justify-between items-center mb-3">
            <View className="bg-coral/10 px-3 py-1.5 rounded-full">
                <Text className="text-coral font-bold text-xs">{new Date(memory.created_at).toLocaleDateString()}</Text>
            </View>
            <View className="bg-mint/20 px-3 py-1 rounded-xl">
                <Text className="text-mint font-bold text-[10px] uppercase tracking-widest">{memory.type}</Text>
            </View>
        </View>

        <Text className="font-outfit font-bold text-lg text-charcoal mb-1.5">{memory.title}</Text>
        <Text className="font-dmsans font-bold text-charcoal/60 text-sm leading-5">{memory.description}</Text>

        {memory.image_emoji && (
            <View className="mt-4 w-full h-32 bg-gradient-to-br from-yellow/20 to-coral/20 rounded-2xl items-center justify-center border border-white/50">
                <LinearGradient
                    colors={['rgba(255, 218, 193, 0.4)', 'rgba(255, 183, 178, 0.4)']}
                    className="absolute inset-0 rounded-2xl"
                />
                <Text className="text-5xl shadow-sm">{memory.image_emoji}</Text>
            </View>
        )}
    </Animated.View>
);

export default function JournalScreen() {
    const { couple, daysTogether } = useCreature();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMemories = async () => {
        if (!couple?.id) return;
        try {
            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .eq('couple_id', couple.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMemories(data as Memory[]);
        } catch (error) {
            console.log("Error fetching memories:", error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchMemories();
        setRefreshing(false);
    }, [couple?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchMemories();
        }, [couple?.id])
    );

    return (
        <View className="flex-1 bg-cream">
            <StatusBar style="light" />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFB7B2" />
                }
            >
                {/* Header */}
                <View className="relative overflow-hidden mb-6 rounded-b-[40px]">
                    <LinearGradient
                        colors={['#B5EAD7', '#81D4C8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="pt-16 pb-10 px-6 items-center justify-center"
                    >
                        <Text className="font-outfit font-bold text-3xl text-white mb-1 shadow-sm">
                            Our Journey
                        </Text>
                        <Text className="font-dmsans font-bold text-white/90 text-sm">
                            {daysTogether} days of love and growth ✨
                        </Text>

                        {/* Decorative Star */}
                        <Animated.Text
                            className="absolute top-8 right-8 text-4xl text-white/30"
                            entering={FadeInDown.delay(300).springify()}
                        >
                            ✦
                        </Animated.Text>
                    </LinearGradient>
                </View>

                {/* Content */}
                <View className="px-5">
                    {memories.length === 0 ? (
                        <View className="py-20 items-center justify-center">
                            <Text className="text-charcoal/40 font-dmsans font-bold">No memories yet. Check in tomorrow!</Text>
                        </View>
                    ) : (
                        memories.map((memory, index) => (
                            <MemoryCard key={memory.id} memory={memory} index={index} />
                        ))
                    )}
                </View>

            </ScrollView>
        </View>
    );
}
