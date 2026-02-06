import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widget-task-handler';

// Register the widget task handler for Android home screen widgets
registerWidgetTaskHandler(widgetTaskHandler);
