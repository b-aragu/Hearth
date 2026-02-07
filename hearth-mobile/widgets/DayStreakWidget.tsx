import React from 'react';
import { FlexWidget, TextWidget, SvgWidget } from 'react-native-android-widget';

export interface DayStreakWidgetProps {
    streak: string;
    creature: string;
    creatureName?: string;
    isGlowing?: boolean;
}

// SVG Paths
const FLAME_PATH = "M8.5 14.5A6.5 6.5 0 0 1 15 8c0-3-2.5-5-2.5-5S18 6.5 18 10a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 0-4 4c0 3 2.5 5 2.5 5 0 1-1.5 1-1.5 2 0 1 2 2 2 2a4 4 0 0 0 4-4c0-2-1.5-3-1.5-3s2 1 2 2 0 1-1 1-1 2z"; // Simplified Flame
const ZAP_PATH = "M13 2L3 14h9l-1 8 10-12h-9l1-8z";

export function DayStreakWidget({
    streak = "0",
    creature = "🐻",
    creatureName = "Companion",
    isGlowing = false,
}: DayStreakWidgetProps) {
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
                borderRadius: 22,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 12,
                borderWidth: isGlowing ? 2 : 1.5,
                borderColor: borderColor
            }}
        >
            {/* Top Label with Icon */}
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <SvgWidget
                    height={12}
                    width={12}
                    svgContent={`
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${subTextColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="${isGlowing ? ZAP_PATH : 'M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2'}"/>
                        </svg>
                    `}
                />
                <TextWidget
                    text={isGlowing ? " ACTIVE" : " DAYS"}
                    style={{
                        fontSize: 11,
                        color: subTextColor,
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        marginLeft: 4
                    }}
                />
            </FlexWidget>

            {/* Main Content */}
            <FlexWidget
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextWidget
                        text={streak}
                        style={{
                            fontSize: 46,
                            fontWeight: 'bold',
                            color: textColor,
                            fontFamily: 'sans-serif-medium',
                            marginTop: -4
                        }}
                    />
                    {/* Flame Icon next to number if glowing */}
                    {isGlowing && (
                        <SvgWidget
                            height={28}
                            width={28}
                            style={{ marginLeft: 4 }}
                            svgContent={`
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="${textColor}" stroke="${textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8.5 14.5A6.5 6.5 0 0 1 15 8c0-3-2.5-5-2.5-5S18 6.5 18 10a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 0-4 4c0 3 2.5 5 2.5 5 0 1-1.5 1-1.5 2 0 1 2 2 2 2a4 4 0 0 0 4-4c0-2-1.5-3-1.5-3s2 1 2 2 0 1-1 1-1 2z"/>
                                </svg>
                            `}
                        />
                    )}
                </FlexWidget>

                {/* Creature Expression */}
                <TextWidget
                    text={creature}
                    style={{
                        fontSize: 32,
                        marginTop: 4
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

export default DayStreakWidget;
