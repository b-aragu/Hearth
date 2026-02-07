import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';

interface Action {
    id: string;
    type: 'SEND_MESSAGE' | 'SEND_SURPRISE';
    payload: any;
    timestamp: number;
}

interface ActionQueueContextType {
    queueAction: (type: Action['type'], payload: any) => Promise<void>;
    queue: Action[];
    isOnline: boolean;
}

const ActionQueueContext = createContext<ActionQueueContextType | undefined>(undefined);

export function ActionQueueProvider({ children }: { children: React.ReactNode }) {
    const [queue, setQueue] = useState<Action[]>([]);
    const [isOnline, setIsOnline] = useState(true);

    // Load queue on startup
    useEffect(() => {
        AsyncStorage.getItem('action_queue').then(data => {
            if (data) setQueue(JSON.parse(data));
        });

        // Listen for connection changes
        const unsubscribe = NetInfo.addEventListener(state => {
            const online = state.isConnected && state.isInternetReachable;
            setIsOnline(!!online);
            if (online) {
                processQueue();
            }
        });

        return () => unsubscribe();
    }, []);

    // Persist queue whenever it changes
    useEffect(() => {
        AsyncStorage.setItem('action_queue', JSON.stringify(queue));
    }, [queue]);

    const queueAction = async (type: Action['type'], payload: any) => {
        const newAction: Action = {
            id: Math.random().toString(36).substring(7),
            type,
            payload,
            timestamp: Date.now()
        };

        console.log(`[Queue] Adding action: ${type}`);
        setQueue(prev => [...prev, newAction]);

        // Try to process immediately if online
        if (isOnline) {
            // giving a small delay to allow state update or ensure connection is stable
            setTimeout(processQueue, 500);
        }
    };

    const processQueue = async () => {
        if (queue.length === 0) return;

        console.log(`[Queue] Processing ${queue.length} items...`);

        // Process sequentially
        const remainingQueue = [...queue];

        for (const action of queue) {
            try {
                console.log(`[Queue] Processing action: ${action.type}`);
                if (action.type === 'SEND_MESSAGE') {
                    const { error } = await supabase.from('messages').insert(action.payload);
                    if (error) throw error;
                } else if (action.type === 'SEND_SURPRISE') {
                    const { error } = await supabase.from('surprises').insert(action.payload);
                    if (error) throw error;
                }

                // If successful, remove from remaining
                const index = remainingQueue.findIndex(a => a.id === action.id);
                if (index > -1) remainingQueue.splice(index, 1);

            } catch (e) {
                console.error(`[Queue] Failed to process action ${action.id}:`, e);
                // Stop processing if one fails? Or continue? 
                // For now, keep it in queue to retry later, but maybe move to end?
                // We'll just stop processing to preserve order for now.
                break;
            }
        }

        setQueue(remainingQueue);
    };

    return (
        <ActionQueueContext.Provider value={{ queueAction, queue, isOnline }}>
            {children}
        </ActionQueueContext.Provider>
    );
}

export function useActionQueue() {
    const context = useContext(ActionQueueContext);
    if (!context) throw new Error('useActionQueue must be used within ActionQueueProvider');
    return context;
}
