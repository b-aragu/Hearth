import { Redirect } from 'expo-router';

// Default redirect for rituals - go to daily question
export default function RitualsIndex() {
    return <Redirect href="/rituals/daily-question" />;
}
