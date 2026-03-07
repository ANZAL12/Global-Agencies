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
    mustChangePassword: boolean;
    updateMustChangePassword: (status: boolean) => Promise<void>;
    login: (access: string, refresh: string, role: string, mustChangePassword?: boolean) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    role: null,
    isLoading: true,
    mustChangePassword: false,
    updateMustChangePassword: async () => { },
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const token = await safeStorage.getItem('access');
            const storedRole = await safeStorage.getItem('role');
            const storedMustChange = await safeStorage.getItem('must_change_password');

            if (token && storedRole) {
                setIsAuthenticated(true);
                setRole(storedRole);
                setMustChangePassword(storedMustChange === 'true');
            } else {
                setIsAuthenticated(false);
                setRole(null);
                setMustChangePassword(false);
            }
        } catch (error) {
            console.error('Error checking session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateMustChangePassword = async (status: boolean) => {
        try {
            await safeStorage.setItem('must_change_password', status ? 'true' : 'false');
            setMustChangePassword(status);
        } catch (error) {
            console.error('Error updating must_change_password:', error);
        }
    };

    const login = async (access: string, refresh: string, userRole: string, mustChange: boolean = false) => {
        try {
            await safeStorage.setItem('access', access);
            await safeStorage.setItem('refresh', refresh);
            await safeStorage.setItem('role', userRole);
            await safeStorage.setItem('must_change_password', mustChange ? 'true' : 'false');
            setRole(userRole);
            setMustChangePassword(mustChange);
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
            await safeStorage.removeItem('must_change_password');
            setRole(null);
            setMustChangePassword(false);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, isLoading, mustChangePassword, updateMustChangePassword, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
