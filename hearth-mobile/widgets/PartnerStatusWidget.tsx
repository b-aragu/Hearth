import React from 'react';
import { FlexWidget, TextWidget, SvgWidget } from 'react-native-android-widget';

export interface PartnerStatusWidgetProps {
    partnerName: string;
    status: 'Online' | 'Offline' | 'Sleeping' | 'Away';
    lastSeen?: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Online': return '#4CAF50';
        case 'Sleeping': return '#9C89B8'; // Lavender
        default: return '#B8B8B8';
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
                {/* Status Header with Icon */}
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <SvgWidget
                        height={10}
                        width={10}
                        svgContent={`
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <circle cx="5" cy="5" r="4" fill="${statusColor}" />
                                ${isOnline ? `<circle cx="5" cy="5" r="5" stroke="${statusColor}" stroke-opacity="0.3" stroke-width="2" />` : ''}
                            </svg>
                        `}
                    />
                    <TextWidget
                        text={isOnline ? " ACTIVE NOW" : (lastSeen ? " LAST SEEN" : " CURRENTLY")}
                        style={{
                            fontSize: 10,
                            color: statusColor,
                            fontWeight: 'bold',
                            letterSpacing: 1,
                            marginLeft: 6,
                        }}
                    />
                </FlexWidget>

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
