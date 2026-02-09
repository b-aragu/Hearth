import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PartnerStatusWidget } from './PartnerStatusWidget';
import { DayStreakWidget } from './DayStreakWidget';

// Storage keys for widget data
const WIDGET_DATA_KEY = 'hearth_widget_data';

interface WidgetData {
    streak: number;
    creature: string;
    creatureName: string;
    partnerName: string;
    partnerStatus: 'Online' | 'Offline' | 'Sleeping' | 'Away';
}

// Get stored widget data or defaults
async function getWidgetData(): Promise<WidgetData> {
    try {
        const stored = await AsyncStorage.getItem(WIDGET_DATA_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.log('Widget data read error:', e);
    }

    // Return defaults
    return {
        streak: 0,
        creature: '🐻',
        creatureName: 'Companion',
        partnerName: 'Partner',
        partnerStatus: 'Offline',
    };
}

// Save widget data for persistence
export async function saveWidgetData(data: Partial<WidgetData>): Promise<void> {
    try {
        const current = await getWidgetData();
        const updated = { ...current, ...data };
        await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(updated));
    } catch (e) {
        console.log('Widget data save error:', e);
    }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            // Load stored data
            const data = await getWidgetData();

            if (widgetInfo.widgetName === 'DayStreak') {
                await props.renderWidget(
                    <DayStreakWidget
                        streak={data.streak.toString()}
                        creature={data.creature}
                        creatureName={data.creatureName}
                    />
                );
            } else if (widgetInfo.widgetName === 'PartnerStatus') {
                await props.renderWidget(
                    <PartnerStatusWidget
                        partnerName={data.partnerName}
                        status={data.partnerStatus}
                    />
                );
            }
            break;

        case 'WIDGET_DELETED':
            // Cleanup if needed
            break;

        case 'WIDGET_CLICK':
            // Handle clicks - could open app to specific screen
            break;

        default:
            break;
    }
}
