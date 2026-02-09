import client from './client';

export const login = async (email: string, password: string) => {
    const response = await client.post('/auth/login', { email, password });
    return response.data;
};

export const signup = async (userData: any) => {
    const response = await client.post('/users', userData);
    return response.data;
};
