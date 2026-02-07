import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';

export function OfflineBanner() {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    if (isConnected !== false) return null;

    return (
        <Animated.View
            entering={FadeInDown.springify()}
            exiting={FadeOutDown}
            className="absolute bottom-10 left-0 right-0 items-center z-50 pointer-events-none"
        >
            <View className="bg-slate-800/90 backdrop-blur-md px-5 py-3 rounded-full flex-row items-center space-x-3 shadow-lg border border-slate-700/50">
                <WifiOff size={18} color="#94A3B8" />
                <Text className="text-slate-200 font-medium text-sm">
                    You are currently offline
                </Text>
            </View>
        </Animated.View>
    );
}
