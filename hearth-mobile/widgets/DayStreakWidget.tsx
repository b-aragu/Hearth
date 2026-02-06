import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface DayStreakWidgetProps {
    streak: string;
    creature: string;
    creatureName?: string;
}

export function DayStreakWidget({
    streak = "0",
    creature = "🐻",
    creatureName = "Companion",
}: DayStreakWidgetProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFF9F0', // Warm cream - matches app theme
                borderRadius: 24,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}
        >
            {/* Creature Circle */}
            <FlexWidget
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255, 183, 178, 0.25)', // Coral accent
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <TextWidget
                    text={creature}
                    style={{
                        fontSize: 28,
                    }}
                />
            </FlexWidget>

            {/* Streak Number */}
            <TextWidget
                text={streak}
                style={{
                    fontSize: 42,
                    fontWeight: 'bold',
                    color: '#FFB7B2', // Coral
                }}
            />

            {/* Label */}
            <TextWidget
                text="STREAK"
                style={{
                    fontSize: 10,
                    color: '#8A8A8A',
                    letterSpacing: 2,
                    fontWeight: 'bold',
                }}
            />

            {/* Optional creature name */}
            {creatureName && (
                <TextWidget
                    text={creatureName}
                    style={{
                        fontSize: 11,
                        color: '#A0A0A0',
                        marginTop: 4,
                    }}
                />
            )}
        </FlexWidget>
    );
}

export default DayStreakWidget;
