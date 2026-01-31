import client from './client';

export interface DashboardStats {
    income: number;
    expense: number;
    profit: number;
    recentTrips?: any[];
}

export const getDashboardStats = async (date?: string) => {
    const params = date ? { date } : {};
    const response = await client.get('/dashboard/stats', { params });
    return response.data;
};
