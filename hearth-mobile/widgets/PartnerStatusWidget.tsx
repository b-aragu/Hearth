import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface PartnerStatusWidgetProps {
    partnerName: string;
    status: 'Online' | 'Offline' | 'Sleeping' | 'Away';
    lastSeen?: string;
}

const getStatusEmoji = (status: string) => {
    switch (status) {
        case 'Online': return '🟢';
        case 'Sleeping': return '😴';
        case 'Away': return '🌙';
        default: return '⚪';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Online': return '#4CAF50';
        case 'Sleeping': return '#9C89B8'; // Lavender
        default: return '#B8B8B8';
    }
};

const getBorderColor = (status: string) => {
    switch (status) {
        case 'Online': return '#4CAF50';
        case 'Sleeping': return '#C4B8E0';
        default: return '#E0E0E0';
    }
};

export function PartnerStatusWidget({
    partnerName = "Partner",
    status = "Offline",
    lastSeen,
}: PartnerStatusWidgetProps) {
    const initial = partnerName.charAt(0).toUpperCase();

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFF9F0', // Warm cream
                borderRadius: 24,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}
        >
            {/* Avatar Circle with Status Border */}
            <FlexWidget
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    borderWidth: 3,
                    borderColor: getBorderColor(status),
                    backgroundColor: '#C4B8E0', // Lavender for avatar bg
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <TextWidget
                    text={initial}
                    style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                    }}
                />
            </FlexWidget>

            {/* Partner Name */}
            <TextWidget
                text={partnerName}
                style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#4A3B32',
                    marginBottom: 4,
                }}
            />

            {/* Status */}
            <FlexWidget
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <TextWidget
                    text={getStatusEmoji(status)}
                    style={{
                        fontSize: 10,
                        marginRight: 4,
                    }}
                />
                <TextWidget
                    text={status.toUpperCase()}
                    style={{
                        fontSize: 10,
                        color: getStatusColor(status),
                        letterSpacing: 1,
                        fontWeight: 'bold',
                    }}
                />
            </FlexWidget>

            {/* Last seen (if offline) */}
            {status === 'Offline' && lastSeen && (
                <TextWidget
                    text={lastSeen}
                    style={{
                        fontSize: 9,
                        color: '#A0A0A0',
                        marginTop: 4,
                    }}
                />
            )}
        </FlexWidget>
    );
}

export default PartnerStatusWidget;
