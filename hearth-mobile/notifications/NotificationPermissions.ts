import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert, Linking } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

// Check current permission status
export async function checkNotificationPermission(): Promise<PermissionStatus> {
    if (!Device.isDevice) {
        return 'denied';
    }

    const { status } = await Notifications.getPermissionsAsync();

    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    return 'undetermined';
}

// Request notification permission with UI flow
export async function requestNotificationPermission(): Promise<boolean> {
    if (!Device.isDevice) {
        Alert.alert(
            'Physical Device Required',
            'Push notifications are not available on simulators. Please use a physical device.',
            [{ text: 'OK' }]
        );
        return false;
    }

    const currentStatus = await checkNotificationPermission();

    if (currentStatus === 'granted') {
        return true;
    }

    if (currentStatus === 'denied') {
        // Permissions were previously denied, need to go to settings
        Alert.alert(
            'Notifications Disabled',
            'To receive updates from your partner, please enable notifications in Settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () => {
                        if (Platform.OS === 'ios') {
                            Linking.openURL('app-settings:');
                        } else {
                            Linking.openSettings();
                        }
                    }
                },
            ]
        );
        return false;
    }

    // Status is undetermined, request permission
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

// Get human-readable permission status description
export function getPermissionDescription(status: PermissionStatus): string {
    switch (status) {
        case 'granted':
            return 'Enabled';
        case 'denied':
            return 'Disabled';
        case 'undetermined':
            return 'Not set';
        default:
            return 'Unknown';
    }
}

// Check if notifications can be requested
export function canRequestPermission(status: PermissionStatus): boolean {
    return status === 'undetermined';
}

export default {
    checkNotificationPermission,
    requestNotificationPermission,
    getPermissionDescription,
    canRequestPermission,
};
