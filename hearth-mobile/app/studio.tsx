import { View, Text, Pressable, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useCreature } from '../context/CreatureContext';
import { DynamicCreature } from '../components/creatures/DynamicCreature';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Possible accessories configuration
const ACCESSORY_OPTIONS = [
    { id: 'glasses', label: 'Round Glasses', icon: '👓' },
    { id: 'hat_beanie', label: 'Beanie', icon: '🧢' },
    { id: 'scarf', label: 'Red Scarf', icon: '🧣' },
    { id: 'bowtie', label: 'Bow Tie', icon: '👔' },
];

export default function StudioScreen() {
    const router = useRouter();
    const { selectedCreature, couple, saveAccessories, daysTogether } = useCreature();

    // Local state for previewing changes
    const [currentAccessories, setCurrentAccessories] = useState<string[]>([]);

    // Customize Colors logic
    const [accessoryColors, setAccessoryColors] = useState<Record<string, string>>({});
    const [selectedAccessoryForColor, setSelectedAccessoryForColor] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [mood, setMood] = useState<'happy' | 'sad' | 'sleepy' | 'neutral'>('neutral');

    // Initialize with existing accessories AND couple days if available (or default to 1)
    useEffect(() => {
        if (couple) {
            if (couple.accessories) setCurrentAccessories(couple.accessories);
            if (couple.accessory_colors) setAccessoryColors(couple.accessory_colors);
        }
    }, [couple]);

    const toggleAccessory = (id: string) => {
        setCurrentAccessories(prev => {
            if (prev.includes(id)) {
                // If currently selected for color, deselect color logic
                if (selectedAccessoryForColor === id) setSelectedAccessoryForColor(null);
                // Remove item
                return prev.filter(item => item !== id);
            } else {
                // Add
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

    const handleSave = async () => {
        setIsSaving(true);
        if (saveAccessories) {
            await saveAccessories(currentAccessories, accessoryColors);
        }
        setIsSaving(false);
        router.back();
    };

    return (
        <View className="flex-1 bg-cream">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header / Nav */}
            <View className="absolute top-12 left-6 z-10">
                <Pressable onPress={() => router.back()} className="bg-white/50 p-3 rounded-full">
                    <Text>←</Text>
                </Pressable>
            </View>

            {/* Preview Area */}
            <View className="flex-1 items-center justify-center pt-20 pb-[400px]">
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.5)']}
                    className="absolute inset-0"
                />

                <View className="items-center">
                    <Text className="font-quicksand font-bold text-xl text-charcoal mb-4">
                        Dressing Room
                    </Text>

                    <View className="scale-150">
                        <DynamicCreature
                            creatureId={selectedCreature}
                            mood={mood}
                            accessories={currentAccessories}
                            accessoryColors={accessoryColors}
                            daysTogether={daysTogether || 1}
                        />
                    </View>
                </View>
            </View>

            {/* Control Panel - Scrollable for more controls */}
            <View className="bg-white rounded-t-[40px] shadow-lg h-[45%] absolute bottom-0 w-full flex-1">
                <ScrollView className="flex-1 p-8" contentContainerStyle={{ paddingBottom: 40 }}>



                    {/* 2. Wardrobe */}
                    <View className="mb-8">
                        <Text className="font-bold text-charcoal/50 uppercase tracking-widest mb-2 text-xs">
                            Accessories
                        </Text>
                        <Text className="text-xs text-charcoal/40 mb-4">Tap to wear. Tap again to select for coloring.</Text>

                        <View className="flex-row flex-wrap gap-4 justify-between">
                            {ACCESSORY_OPTIONS.map((item) => {
                                const isVisible = currentAccessories.includes(item.id);
                                const isSelectedForColor = selectedAccessoryForColor === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => {
                                            if (!isVisible) {
                                                toggleAccessory(item.id);
                                            } else {
                                                // If visible, Select for color
                                                setSelectedAccessoryForColor(item.id);
                                                // If already selected for color, maybe toggle off? 
                                                // Let's keep it simple: Click -> Wear & Select. Click again -> Select. 
                                                // To remove, users might expect a toggle. 
                                                // Logic Update:
                                                if (isSelectedForColor) toggleAccessory(item.id);
                                            }
                                        }}
                                        className={`w-[47%] p-4 rounded-2xl flex-row items-center gap-3 border-2 transition-all ${isVisible ? (isSelectedForColor ? 'bg-blue-100 border-blue-600' : 'bg-blue-50 border-blue-200') : 'bg-cream border-transparent'
                                            }`}
                                    >
                                        <Text className="text-2xl">{item.icon}</Text>
                                        <View>
                                            <Text className={`font-bold ${isVisible ? 'text-charcoal' : 'text-charcoal/50'}`}>
                                                {item.label}
                                            </Text>
                                            {accessoryColors[item.id] && (
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
                        <View className="mb-8 animate-fade-in">
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

                    {/* Save Button */}
                    <Pressable
                        onPress={handleSave}
                        disabled={isSaving}
                        className="bg-charcoal rounded-2xl py-5 items-center active:scale-95 transition-transform mb-8"
                    >
                        <Text className="text-white font-bold font-outfit text-lg">
                            {isSaving ? 'Saving Look...' : 'Save & Exit'}
                        </Text>
                    </Pressable>
                </ScrollView>
            </View>
        </View>
    );
}
