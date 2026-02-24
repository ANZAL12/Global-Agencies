import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const safeStorage = {
    getItem: async (key: string) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
            return;
        }
        await AsyncStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
            return;
        }
        await AsyncStorage.removeItem(key);
    }
};

type AuthContextType = {
    isAuthenticated: boolean;
    role: string | null;
    isLoading: boolean;
    login: (access: string, refresh: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    role: null,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const token = await safeStorage.getItem('access');
            const storedRole = await safeStorage.getItem('role');

            if (token && storedRole) {
                setIsAuthenticated(true);
                setRole(storedRole);
            } else {
                setIsAuthenticated(false);
                setRole(null);
            }
        } catch (error) {
            console.error('Error checking session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (access: string, refresh: string, userRole: string) => {
        try {
            await safeStorage.setItem('access', access);
            await safeStorage.setItem('refresh', refresh);
            await safeStorage.setItem('role', userRole);
            setRole(userRole);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error saving session:', error);
        }
    };

    const logout = async () => {
        try {
            await safeStorage.removeItem('access');
            await safeStorage.removeItem('refresh');
            await safeStorage.removeItem('role');
            setRole(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
