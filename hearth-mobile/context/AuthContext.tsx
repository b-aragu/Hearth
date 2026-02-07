import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ... imports
interface Profile {
    id: string;
    display_name: string | null;
    avatar_text: string | null;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null; // Added profile
    loading: boolean;
    refreshProfile: () => Promise<void>; // Added refresh
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null); // State for profile
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        console.log("[Auth] Fetching profile for:", userId);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error("[Auth] Profile fetch error:", error);
                return;
            }
            if (data) {
                console.log("[Auth] Profile found:", data.display_name);
                setProfile(data);
            }
        } catch (e) {
            console.error("[Auth] Exception in fetchProfile:", e);
        }
    };

    useEffect(() => {
        console.log("[Auth] Initializing AuthContext...");
        // 1. Check for initial session
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log("[Auth] Initial session check:", session ? "User found" : "No user");
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                    // Register for push notifications
                    try {
                        const { registerForPushNotificationsAsync } = await import('../lib/notifications');
                        const token = await registerForPushNotificationsAsync();
                        if (token) {
                            await supabase.from('profiles').update({ push_token: token }).eq('id', session.user.id);
                            console.log("[Auth] Push token saved to profile");
                        }
                    } catch (e) {
                        console.error("[Auth] Failed to register push token:", e);
                    }
                }
            } catch (error) {
                console.error('[Auth] Error getting session:', error);
            } finally {
                console.log("[Auth] Loading set to false (init)");
                setLoading(false);
            }
        };

        checkSession();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("[Auth] Auth state changed:", event, session ? "User found" : "No user");
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id);
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
