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
    const isOnline = status === 'Online';
    const statusColor = getStatusColor(status);

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#F8F9FA', // Very light grey
                borderRadius: 24,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}
        >
            <FlexWidget
                style={{
                    height: 'match_parent',
                    width: 'match_parent',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 8,
                }}
            >
                {/* Status Header */}
                <TextWidget
                    text={isOnline ? "ACTIVE NOW" : (lastSeen ? "LAST SEEN" : "CURRENTLY")}
                    style={{
                        fontSize: 10,
                        color: statusColor,
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        marginBottom: 12,
                    }}
                />

                {/* Avatar */}
                <FlexWidget
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: '#F3E5F5',
                        borderWidth: 4,
                        borderColor: statusColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 12,
                    }}
                >
                    <TextWidget
                        text={initial}
                        style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: '#7B1FA2',
                        }}
                    />
                </FlexWidget>

                {/* Name & Detail */}
                <TextWidget
                    text={partnerName}
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#263238',
                        marginBottom: 2,
                    }}
                />

                <TextWidget
                    text={isOnline ? "Online" : (lastSeen || status)}
                    style={{
                        fontSize: 12,
                        color: '#78909C',
                        fontWeight: 'normal',
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

export default PartnerStatusWidget;
