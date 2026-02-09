import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CozyRoom } from './rooms/CozyRoom';
import { NightRoom } from './rooms/NightRoom';
import { ForestRoom } from './rooms/ForestRoom';
import { BeachRoom } from './rooms/BeachRoom';
import { CloudRoom } from './rooms/CloudRoom';

const { width, height } = Dimensions.get('window');

// Keep theme metadata for reference, but rendering is now via components
export const ROOM_THEMES: Record<string, { label: string; colors: string[] }> = {
    'cozy': { label: 'Cozy Cabin', colors: ['#FFF8F0', '#FFE8D6'] },
    'forest': { label: 'Enchanted Forest', colors: ['#E8F5E9', '#C8E6C9'] },
    'beach': { label: 'Sunny Beach', colors: ['#E0F7FA', '#B2EBF2'] },
    'night': { label: 'Starry Night', colors: ['#1A237E', '#311B92'] },
    'cloud': { label: 'Cloud Kingdom', colors: ['#F3E5F5', '#E1BEE7'] },
};

export const RoomBackground = ({ roomId = 'cozy' }: { roomId?: string }) => {
    const theme = ROOM_THEMES[roomId] || ROOM_THEMES['cozy'];

    const renderRoom = () => {
        switch (roomId) {
            case 'cozy': return <CozyRoom />;
            case 'forest': return <ForestRoom />;
            case 'beach': return <BeachRoom />;
            case 'night': return <NightRoom />;
            case 'cloud': return <CloudRoom />;
            default: return <CozyRoom />;
        }
    };

    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Fallback gradient background */}
            <LinearGradient
                colors={theme.colors as any}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 1 }}
            />
            {renderRoom()}
        </View>
    );
};
