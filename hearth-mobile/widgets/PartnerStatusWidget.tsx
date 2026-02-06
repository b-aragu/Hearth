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
                    padding: 8,
                }}
            >
                {/* Avatar Circle with Status Border */}
                <FlexWidget
                    style={{
                        width: 58,
                        height: 58,
                        borderRadius: 29,
                        borderWidth: 3,
                        borderColor: getBorderColor(status),
                        backgroundColor: '#EDE7F6', // Lavender mist
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 6,
                    }}
                >
                    <TextWidget
                        text={initial}
                        style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#5E35B1', // Deep purple
                        }}
                    />
                </FlexWidget>

                {/* Partner Name */}
                <TextWidget
                    text={partnerName}
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#424242',
                        marginBottom: 4,
                    }}
                />

                {/* Status Pill */}
                <FlexWidget
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: status === 'Online' ? '#E8F5E9' : '#F5F5F5',
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
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
                            letterSpacing: 0.5,
                            fontWeight: 'bold',
                        }}
                    />
                </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}

export default PartnerStatusWidget;
