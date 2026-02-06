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
                backgroundColor: '#FFF0F5', // Lavender Blush
                borderRadius: 24,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}
        >
            {/* Decorative Ring 1 - Subtle outer glow effect via nested view */}
            <FlexWidget
                style={{
                    height: 'match_parent',
                    width: 'match_parent',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 12,
                }}
            >
                {/* Header */}
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextWidget
                        text="✨ TOGETHER"
                        style={{
                            fontSize: 11,
                            color: '#9C4A5A',
                            letterSpacing: 1,
                            fontWeight: 'bold',
                        }}
                    />
                </FlexWidget>

                {/* Main Counter */}
                <FlexWidget
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginVertical: 4
                    }}
                >
                    <TextWidget
                        text={streak}
                        style={{
                            fontSize: 54,
                            fontWeight: 'bold',
                            color: '#D4847C', // Muted Coral
                            fontFamily: 'sans-serif-medium'
                        }}
                    />
                    <TextWidget
                        text="DAYS"
                        style={{
                            fontSize: 12,
                            color: '#D4847C',
                            fontWeight: 'bold',
                            marginTop: -8,
                        }}
                    />
                </FlexWidget>

                {/* Footer Creature */}
                <FlexWidget
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FFF0F5',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                    }}
                >
                    <TextWidget
                        text={creature}
                        style={{
                            fontSize: 14,
                        }}
                    />
                    <TextWidget
                        text=" IN LOVE"
                        style={{
                            fontSize: 10,
                            color: '#9C4A5A',
                            fontWeight: 'bold',
                            marginLeft: 4
                        }}
                    />
                </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}

export default DayStreakWidget;
