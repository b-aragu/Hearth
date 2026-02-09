import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widget-task-handler';

import { Platform } from 'react-native';

// Register the widget task handler for Android home screen widgets
if (Platform.OS === 'android') {
    registerWidgetTaskHandler(widgetTaskHandler);
}
