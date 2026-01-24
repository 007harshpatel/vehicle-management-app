import client from './client';

export interface Notification {
    title: string;
    message: string;
    dueDate?: string;
}

export const createNotification = async (data: Notification) => {
    const response = await client.post('/notifications', data);
    return response.data;
};

export const updateNotification = async (id: number, data: Partial<Notification>) => {
    const response = await client.patch(`/notifications/${id}`, data);
    return response.data;
};
