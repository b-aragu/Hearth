import { View, Text, ScrollView, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { DynamicCreature } from '../../components/creatures/DynamicCreature';
import Slider from '@react-native-community/slider';
import { useCreature } from '../../context/CreatureContext';

// Possible accessories configuration
const ACCESSORY_OPTIONS = [
    { id: 'glasses', label: 'Round Glasses', icon: '👓' },
    { id: 'hat_beanie', label: 'Beanie', icon: '🧢' },
    { id: 'scarf', label: 'Red Scarf', icon: '🧣' },
    { id: 'bowtie', label: 'Bow Tie', icon: '👔' },
];

export default function CreatureGallery() {
    const router = useRouter();
    const [days, setDays] = useState(1);
    const [mood, setMood] = useState<'happy' | 'sad' | 'sleepy' | 'neutral'>('neutral');
    const [selectedCreature, setSelectedCreature] = useState('bear');
    const [currentAccessories, setCurrentAccessories] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Customize Colors logic
    const [accessoryColors, setAccessoryColors] = useState<Record<string, string>>({});
    const [selectedAccessoryForColor, setSelectedAccessoryForColor] = useState<string | null>(null);

    // Load initial state from Context
    const { couple, saveAccessories } = useCreature();

    // Effect to load initial data
    useEffect(() => {
        if (couple) {
            if (couple.accessories) setCurrentAccessories(couple.accessories);
            if (couple.accessory_colors) setAccessoryColors(couple.accessory_colors);
        }
    }, [couple]);

    const handleSave = async () => {
        setIsSaving(true);
        await saveAccessories(currentAccessories, accessoryColors);
        setIsSaving(false);
        // Feedback
        alert("Look saved! Partner notified! 🎨");
    };

    const toggleAccessory = (id: string) => {
        setCurrentAccessories(prev => {
            if (prev.includes(id)) {
                // Remove
                if (selectedAccessoryForColor === id) setSelectedAccessoryForColor(null);
                return prev.filter(item => item !== id);
            } else {
                // Add and Select for coloring
                setSelectedAccessoryForColor(id);
                return [...prev, id];
            }
        });
    };

    const updateColor = (color: string | undefined) => {
        if (!selectedAccessoryForColor) return;
        setAccessoryColors(prev => {
            const next = { ...prev };
            if (color) {
                next[selectedAccessoryForColor] = color;
            } else {
                delete next[selectedAccessoryForColor];
            }
            return next;
        });
    };

    return (
        <ScrollView className="flex-1 bg-cream">
            <Stack.Screen options={{ title: 'Creature Lab 🧪', headerStyle: { backgroundColor: '#FFF9F0' } }} />

            <View className="p-6 items-center">
                <Text className="font-bold text-charcoal/50 uppercase tracking-widest mb-8">Growth Simulator</Text>

                {/* THE STAGE */}
                <View className="bg-white p-8 rounded-[40px] border border-charcoal/5 shadow-sm mb-8 items-center justify-center w-full aspect-square">
                    <DynamicCreature
                        creatureId={selectedCreature}
                        mood={mood}
                        daysTogether={days}
                        scale={1} // Base scale
                        accessories={currentAccessories}
                        accessoryColors={accessoryColors}
                    />
                    <Text className="absolute bottom-4 font-mono text-xs text-charcoal/40">
                        Scale: {(Math.min(0.6 + (days * 0.01), 1.2)).toFixed(2)}x
                    </Text>
                </View>

                {/* CONTROLS */}
                <View className="w-full gap-6">

                    {/* SAVE BUTTON */}
                    <Pressable
                        onPress={handleSave}
                        disabled={isSaving}
                        className={`w-full py-4 rounded-full items-center justify-center shadow-lg ${isSaving ? 'bg-charcoal/50' : 'bg-charcoal'}`}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isSaving ? 'Saving...' : 'Save Look & Notify Partner ✨'}
                        </Text>
                    </Pressable>

                    {/* Growth Slider */}
                    <View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="font-bold text-charcoal">Days Together</Text>
                            <Text className="font-bold text-coral text-xl">{days} days</Text>
                        </View>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={1}
                            maximumValue={100}
                            step={1}
                            value={days}
                            onValueChange={setDays}
                            minimumTrackTintColor="#FFB7B2"
                            maximumTrackTintColor="#000000"
                        />
                        <View className="flex-row justify-between px-1">
                            <Text className="text-xs text-charcoal/40">Baby (Day 1)</Text>
                            <Text className="text-xs text-charcoal/40">Adult (Day 60+)</Text>
                        </View>
                    </View>

                    {/* Mood Selector */}
                    <View>
                        <Text className="font-bold text-charcoal mb-3">Mood State</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['neutral', 'happy', 'sleepy', 'sad'].map((m) => (
                                <Pressable
                                    key={m}
                                    onPress={() => setMood(m as any)}
                                    className={`px-4 py-2 rounded-full border ${mood === m ? 'bg-charcoal border-charcoal' : 'bg-white border-charcoal/10'}`}
                                >
                                    <Text className={`font-bold ${mood === m ? 'text-white' : 'text-charcoal'}`}>
                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Creature Selector */}
                    <View>
                        <Text className="font-bold text-charcoal mb-3">Species</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['bear', 'bunny (WIP)'].map((c) => (
                                <Pressable
                                    key={c}
                                    onPress={() => setSelectedCreature(c.split(' ')[0])}
                                    className={`px-4 py-2 rounded-full border ${selectedCreature === c.split(' ')[0] ? 'bg-blue-500 border-blue-500' : 'bg-white border-charcoal/10'}`}
                                >
                                    <Text className={`font-bold ${selectedCreature === c.split(' ')[0] ? 'text-white' : 'text-charcoal'}`}>
                                        {c}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Accessories Selector */}
                    <View>
                        <Text className="font-bold text-charcoal mb-3">Accessories</Text>
                        <Text className="text-xs text-charcoal/50 mb-2">Tap to toggle & select for coloring</Text>
                        <View className="flex-row flex-wrap gap-4 justify-between">
                            {ACCESSORY_OPTIONS.map((item) => {
                                const isVisible = currentAccessories.includes(item.id);
                                const isSelectedForColor = selectedAccessoryForColor === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => {
                                            if (!isVisible) {
                                                // Toggle On
                                                toggleAccessory(item.id);
                                            } else {
                                                // If already on, just select for coloring
                                                setSelectedAccessoryForColor(item.id);
                                                // Double tap to toggle off?
                                                if (isSelectedForColor) toggleAccessory(item.id);
                                            }
                                        }}
                                        className={`w-[47%] p-4 rounded-2xl flex-row items-center gap-3 border-2 transition-all ${isVisible ? (isSelectedForColor ? 'bg-blue-100 border-blue-600' : 'bg-blue-50 border-blue-200') : 'bg-white border-charcoal/10'
                                            }`}
                                    >
                                        <Text className="text-2xl">{item.icon}</Text>
                                        <View>
                                            <Text className={`font-bold ${isVisible ? 'text-charcoal' : 'text-charcoal/50'}`}>
                                                {item.label}
                                            </Text>
                                            {// Show current color dot if any
                                                accessoryColors[item.id] && (
                                                    <View style={{ backgroundColor: accessoryColors[item.id] }} className="w-3 h-3 rounded-full mt-1 border border-black/10" />
                                                )}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Color Picker (Conditional) */}
                    {selectedAccessoryForColor && (
                        <View className="animate-fade-in">
                            <Text className="font-bold text-charcoal mb-3">
                                Color for {ACCESSORY_OPTIONS.find(a => a.id === selectedAccessoryForColor)?.label}:
                            </Text>
                            <View className="flex-row gap-3 flex-wrap">
                                {['#FF6B6B', '#3b82f6', '#10b981', '#fbbf24', '#292929', '#ec4899', '#8b5cf6', '#ffffff'].map((color) => (
                                    <Pressable
                                        key={color}
                                        onPress={() => updateColor(color)}
                                        style={{ backgroundColor: color }}
                                        className={`w-10 h-10 rounded-full border-2 ${accessoryColors[selectedAccessoryForColor] === color ? 'border-charcoal scale-110' : 'border-black/5'}`}
                                    />
                                ))}
                                {/* Reset */}
                                <Pressable
                                    onPress={() => updateColor(undefined)}
                                    className={`w-10 h-10 rounded-full border-2 items-center justify-center bg-white border-gray-200`}
                                >
                                    <Text className="text-xs">✕</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                </View>
            </View>
        </ScrollView>
    );
}
