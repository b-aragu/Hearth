import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function DayStreakWidget() {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFF9F0', // Cream background
                borderRadius: 24,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}
        >
            <TextWidget
                text="🐻"
                style={{
                    fontSize: 32,
                    marginBottom: 8,
                }}
            />
            <TextWidget
                text="24"
                style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    color: '#FFB7B2', // Coral
                }}
            />
            <TextWidget
                text="STREAK"
                style={{
                    fontSize: 12,
                    color: '#2D2D3A', // Charcoal
                    opacity: 0.5,
                    letterSpacing: 2,
                    fontWeight: 'bold',
                }}
            />
        </FlexWidget>
    );
}
