import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi } from '../api/auth';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    phone?: string;
}

interface AuthContextType {
    accessToken: string | null;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const userData = await AsyncStorage.getItem('user');
                if (token) {
                    setAccessToken(token);
                }
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error('Failed to load token', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await loginApi(email, password);
            if (data.access_token) {
                setAccessToken(data.access_token);
                await AsyncStorage.setItem('accessToken', data.access_token);

                if (data.user) {
                    setUser(data.user);
                    await AsyncStorage.setItem('user', JSON.stringify(data.user));
                }
            }
        } catch (error) {
            console.error('Login error', error);
            throw error;
        }
    };

    const signup = async (userData: any) => {
        try {
            // Option 1: Just create user, then user must login manually
            // Option 2: Create user and auto-login if backend returned token (it doesn't currently)
            // Backend `create` returns user object usually.
            // So we just create user.
            const data = await import('../api/auth').then(m => m.signup(userData));
            return data;
        } catch (error) {
            console.error('Signup error', error);
            throw error;
        }
    };

    const logout = async () => {
        setAccessToken(null);
        setUser(null);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                isLoading,
                login,
                signup,
                logout,
                isAuthenticated: !!accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
