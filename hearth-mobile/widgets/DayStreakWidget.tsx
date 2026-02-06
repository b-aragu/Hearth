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
                backgroundColor: '#FFF8F0', // Cream background
                borderRadius: 22,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 12,
            }}
        >
            {/* Inner Card Effect */}
            <FlexWidget
                style={{
                    width: 'match_parent',
                    height: 'match_parent',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                }}
            >
                {/* Creature Circle */}
                <FlexWidget
                    style={{
                        width: 54,
                        height: 54,
                        borderRadius: 27,
                        backgroundColor: '#FFEBEE', // Soft pink
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 4,
                    }}
                >
                    <TextWidget
                        text={creature}
                        style={{
                            fontSize: 32,
                        }}
                    />
                </FlexWidget>

                {/* Streak Count */}
                <TextWidget
                    text={streak}
                    style={{
                        fontSize: 48,
                        fontWeight: 'bold',
                        color: '#D84315', // Deep Coral
                    }}
                />

                {/* Days Together Label */}
                <TextWidget
                    text="DAYS OF LOVE"
                    style={{
                        fontSize: 9,
                        color: '#A1887F',
                        letterSpacing: 1.5,
                        fontWeight: 'bold',
                        marginTop: -4,
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

export default DayStreakWidget;
