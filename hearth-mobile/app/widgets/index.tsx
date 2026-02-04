import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const WidgetPreview = ({ title, width = '100%', children }: { title: string, width?: any, children: React.ReactNode }) => (
    <View className="mb-8 items-center" style={{ width }}>
        <Text className="font-dmsans text-white/60 mb-3 text-xs uppercase tracking-widest">{title}</Text>
        <View className="shadow-2xl shadow-black/50">
            {children}
        </View>
    </View>
);

export default function WidgetShowcase() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-charcoal">
            <StatusBar style="light" />

            {/* Header */}
            <View className="pt-16 pb-6 px-6 flex-row items-center justify-between z-10">
                <Pressable onPress={() => router.back()} className="w-10 h-10 bg-white/10 rounded-full items-center justify-center">
                    <Text className="text-white text-xl">←</Text>
                </Pressable>
                <Text className="text-white font-outfit font-bold text-xl">Widgets</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>

                {/* --- Small Widgets --- */}
                <View className="flex-row justify-between mb-8">
                    <WidgetPreview title="Day Streak" width="48%">
                        <View className="bg-white/90 w-full aspect-square rounded-[24px] items-center justify-center p-4">
                            <View className="w-10 h-10 bg-coral/20 rounded-full items-center justify-center mb-2">
                                <Text className="text-xl">🐻</Text>
                            </View>
                            <Text className="text-3xl font-bold text-coral font-outfit">24</Text>
                            <Text className="text-[10px] text-charcoal/50 font-bold uppercase">Streak</Text>
                        </View>
                    </WidgetPreview>

                    <WidgetPreview title="Status" width="48%">
                        <View className="bg-white/90 w-full aspect-square rounded-[24px] items-center justify-center p-4">
                            <View className="w-12 h-12 rounded-full border-4 border-lavender items-center justify-center mb-2">
                                <Text className="text-xl opacity-30">👤</Text>
                            </View>
                            <Text className="text-xs font-bold text-lavender font-outfit">Waiting...</Text>
                        </View>
                    </WidgetPreview>
                </View>

                {/* --- Medium Widget --- */}
                <WidgetPreview title="Morning Check-in">
                    <View className="bg-white/90 w-full h-[160px] rounded-[32px] p-6 flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-charcoal font-bold font-quicksand text-lg mb-4">Morning Check-in</Text>
                            <View className="flex-row gap-2">
                                <View className="flex-row items-center bg-black/5 px-3 py-1.5 rounded-xl">
                                    <View className="w-2 h-2 bg-mint rounded-full mr-2" />
                                    <Text className="text-xs font-bold text-charcoal/80">You</Text>
                                </View>
                                <View className="flex-row items-center bg-black/5 px-3 py-1.5 rounded-xl border border-charcoal/5 border-dashed">
                                    <View className="w-2 h-2 bg-charcoal/20 rounded-full mr-2" />
                                    <Text className="text-xs font-bold text-charcoal/50">Alex</Text>
                                </View>
                            </View>
                        </View>
                        <View className="w-20 h-20 bg-gradient-to-br from-coral to-peach rounded-[24px] items-center justify-center shadow-lg">
                            <Text className="text-4xl">🐻</Text>
                        </View>
                    </View>
                </WidgetPreview>

                {/* --- Lock Screen --- */}
                <WidgetPreview title="Lock Screen">
                    <View className="bg-white/10 border border-white/20 w-full p-4 rounded-3xl flex-row items-center gap-4 backdrop-blur-md">
                        <View className="w-12 h-12 bg-coral rounded-full items-center justify-center">
                            <Text className="text-xl">🐻</Text>
                        </View>
                        <View>
                            <Text className="text-white/60 font-bold text-xs uppercase">Hearth Streak</Text>
                            <Text className="text-white font-bold text-xl">24 days 🔥</Text>
                        </View>
                    </View>
                </WidgetPreview>

            </ScrollView>
        </View>
    );
}
