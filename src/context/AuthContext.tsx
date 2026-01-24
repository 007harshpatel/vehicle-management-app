import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi } from '../api/auth';

interface AuthContextType {
    accessToken: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    setAccessToken(token);
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
            }
        } catch (error) {
            console.error('Login error', error);
            throw error;
        }
    };

    const logout = async () => {
        setAccessToken(null);
        await AsyncStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isLoading,
                login,
                logout,
                isAuthenticated: !!accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
