import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface DayStreakWidgetProps {
    streak: string;
    creature: string;
    creatureName?: string;
    isGlowing?: boolean;
}

export function DayStreakWidget({
    streak = "0",
    creature = "🐻",
    creatureName = "Companion",
    isGlowing = false,
}: DayStreakWidgetProps) {
    // Locket/Airbuds Aesthetic: Bold, rounded, minimal.
    // Squircle shape with large number and creature.

    // Dynamic Colors based on Glow
    const bgColor = isGlowing ? '#FFF9C4' : '#FFFFFF';
    const textColor = isGlowing ? '#FBC02D' : '#333333';
    const subTextColor = isGlowing ? '#FBC02D' : '#888888';
    const borderColor = isGlowing ? '#FBC02D' : '#E5E5E5';

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: bgColor,
                borderRadius: 22, // Squircle-ish
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 8,
                borderWidth: isGlowing ? 2 : 1.5,
                borderColor: borderColor
            }}
        >
            {/* Top Label (Tiny) */}
            <TextWidget
                text={isGlowing ? "⚡ ACTIVE" : "TOGETHER"}
                style={{
                    fontSize: 10,
                    color: subTextColor,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    marginBottom: 4
                }}
            />

            {/* Main Content: Big Number + Creature Side-by-Side or Stacked */}
            {/* For 2x2, Stacked is usually better for readability of large numbers */}

            <FlexWidget
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <TextWidget
                    text={streak}
                    style={{
                        fontSize: 42,
                        fontWeight: 'bold',
                        color: textColor,
                        fontFamily: 'sans-serif-medium',
                        marginTop: -4
                    }}
                />

                {/* Creature Expression */}
                <TextWidget
                    text={creature}
                    style={{
                        fontSize: 28,
                        marginTop: 2
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

export default DayStreakWidget;
