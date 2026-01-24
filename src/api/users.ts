import client from './client';

export interface User {
    id: number;
    name: string;
    mobile: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
}

export const getUsers = async (userId?: number) => {
    const params = userId ? { userId } : {};
    const response = await client.get('/users', { params });
    return response.data;
};

export const createUser = async (userData: Omit<User, 'id'> & { password?: string }) => {
    const response = await client.post('/users', userData);
    return response.data;
};

export const updateUser = async (id: number, userData: Partial<Omit<User, 'id'>> & { password?: string }) => {
    const response = await client.patch(`/users/${id}`, userData);
    return response.data;
};
