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
                padding: 12,
            }}
        >
            {/* Inner Ticket Card */}
            <FlexWidget
                style={{
                    height: 'match_parent',
                    width: 'match_parent',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: 0,
                    overflow: 'hidden',
                }}
            >
                {/* 1. Ticket Header (Colored Strip) */}
                <FlexWidget
                    style={{
                        width: 'match_parent',
                        height: 38,
                        backgroundColor: '#FFEBEE', // Soft Pink Header
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TextWidget
                        text="✨ TOGETHER"
                        style={{
                            fontSize: 10,
                            color: '#9C4A5A',
                            letterSpacing: 2,
                            fontWeight: 'bold',
                        }}
                    />
                </FlexWidget>

                {/* 2. Main Content (White Body) */}
                <FlexWidget
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1, // Fill remaining space
                        paddingBottom: 8
                    }}
                >
                    <FlexWidget
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <TextWidget
                            text={streak}
                            style={{
                                fontSize: 62,
                                fontWeight: 'bold',
                                color: '#D4847C', // Muted Coral
                                fontFamily: 'sans-serif-medium'
                            }}
                        />
                        <TextWidget
                            text="DAYS"
                            style={{
                                fontSize: 13,
                                color: '#D4847C',
                                fontWeight: 'bold',
                                marginTop: -10,
                            }}
                        />
                    </FlexWidget>

                    {/* Footer Creature (Mood) */}
                    <FlexWidget
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 12,
                            backgroundColor: '#FDF2F4',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                        }}
                    >
                        <TextWidget
                            text={creature}
                            style={{
                                fontSize: 16,
                            }}
                        />
                    </FlexWidget>
                </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}

export default DayStreakWidget;
