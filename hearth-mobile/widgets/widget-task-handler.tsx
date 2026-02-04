import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { DayStreakWidget } from './DayStreakWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            props.renderWidget(<DayStreakWidget />);
            break;

        case 'WIDGET_DELETED':
            // Cleanup if needed
            break;

        case 'WIDGET_CLICK':
            // Handle clicks
            break;

        default:
            break;
    }
}
