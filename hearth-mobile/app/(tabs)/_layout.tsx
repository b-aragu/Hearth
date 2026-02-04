import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFF9F0', // Cream
                    borderTopColor: 'rgba(45, 45, 58, 0.05)', // Charcoal low opacity
                    borderTopWidth: 1,
                    height: 80,
                    paddingBottom: 20,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: '#FFB7B2', // Coral
                tabBarInactiveTintColor: '#C7CEEA', // Lavender
                tabBarLabelStyle: {
                    fontFamily: 'DMSans_700Bold',
                    fontSize: 10,
                    marginTop: -5,
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Pet",
                    tabBarIcon: ({ color, focused }) => (
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${focused ? 'bg-coral/20' : ''}`}>
                            {/* Simple circle/emoji for now, will add icons later */}
                            <View className={`w-4 h-4 rounded-full ${focused ? 'bg-coral' : 'bg-lavender'}`} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    title: "Memories",
                    tabBarIcon: ({ color, focused }) => (
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${focused ? 'bg-coral/20' : ''}`}>
                            <View className={`w-4 h-4 rounded-sm ${focused ? 'bg-coral' : 'bg-lavender'}`} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Us",
                    tabBarIcon: ({ color, focused }) => (
                        <View className={`w-10 h-10 items-center justify-center rounded-full ${focused ? 'bg-coral/20' : ''}`}>
                            <View className={`w-4 h-4 rounded-full border-2 ${focused ? 'border-coral bg-coral' : 'border-lavender'}`} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
