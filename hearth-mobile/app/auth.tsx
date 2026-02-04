import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    async function handleAuth() {
        setLoading(true);
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            setLoading(false);
            return;
        }

        try {
            console.log("[Auth] Starting authentication process...");

            if (isLogin) {
                console.log("[Auth] Attempting Login with:", email);
                const { error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    console.error("[Auth] Login Error:", error);
                    throw error;
                }

                console.log("[Auth] Login Success! Redirecting to /");
                router.replace('/');
            } else {
                console.log("[Auth] Attempting Signup with:", email);
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) {
                    console.error("[Auth] Signup Error:", error);
                    throw error;
                }

                if (data.session) {
                    console.log("[Auth] Auto-Signup Session Active. Redirecting to /");
                    // Auto-logged in (Email confirmation disabled)
                    router.replace('/');
                } else {
                    console.log("[Auth] Signup Success. Waiting for Email Confirmation.");
                    Alert.alert('Check your email', 'We sent you a confirmation link! Click it to log in.');
                    setIsLogin(true); // Switch to login mode
                }
            }
        } catch (error: any) {
            console.error(error); // Log full error to console

            let message = error.message;
            if (error.message.includes("User already registered")) {
                message = "This email is already taken. Try logging in.";
            } else if (error.message.includes("Invalid login credentials")) {
                message = "Wrong email or password.";
            } else if (error.message.includes("rate limit") || error.status === 429) {
                message = "Too many attempts! Supabase limits signups to prevent spam. Please wait a moment or create the user manually in the dashboard.";
            }

            Alert.alert('Authentication Failed', message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-cream relative">
            <StatusBar style="dark" />

            {/* Background Gradients */}
            <View className="absolute inset-0 pointer-events-none">
                <LinearGradient
                    colors={['#FFB7B2', '#FFF9F0']}
                    style={{ width: '100%', height: '50%' }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    className="opacity-30"
                />
            </View>

            <View className="flex-1 justify-center px-8">
                <View className="items-center mb-10">
                    <Text className="text-6xl mb-4">🏠</Text>
                    <Text className="font-outfit font-bold text-3xl text-charcoal">Hearth</Text>
                    <Text className="font-dmsans text-charcoal/60 mt-2">Your shared digital home.</Text>
                </View>

                <View className="bg-white/60 p-6 rounded-[32px] border border-white shadow-sm">
                    <Text className="font-dmsans font-bold text-charcoal/50 text-xs uppercase tracking-widest mb-2 ml-1">Email</Text>
                    <TextInput
                        className="bg-white p-4 rounded-2xl border border-charcoal/5 mb-4 font-dmsans text-charcoal"
                        placeholder="love@hearth.app"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    <Text className="font-dmsans font-bold text-charcoal/50 text-xs uppercase tracking-widest mb-2 ml-1">Password</Text>
                    <TextInput
                        className="bg-white p-4 rounded-2xl border border-charcoal/5 mb-8 font-dmsans text-charcoal"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable
                        onPress={handleAuth}
                        disabled={loading}
                        className={`w-full bg-charcoal py-4 rounded-full items-center shadow-lg active:scale-95 transition-transform ${loading ? 'opacity-80' : ''}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-cream font-outfit font-bold text-lg">
                                {isLogin ? 'Welcome Home' : 'Create Account'}
                            </Text>
                        )}
                    </Pressable>
                </View>

                <Pressable onPress={() => setIsLogin(!isLogin)} className="mt-6 items-center p-4">
                    <Text className="text-charcoal/60 font-dmsans">
                        {isLogin ? "Don't have a key? " : "Already have a key? "}
                        <Text className="font-bold text-coral underline">{isLogin ? 'Sign Up' : 'Log In'}</Text>
                    </Text>
                </Pressable>

            </View>
        </View>
    );
}