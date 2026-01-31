import client from './client';

export interface Maintenance {
    id: number;
    vehicleId: number;
    vehicle?: {
        vehicleNumber: string;
    };
    maintenanceType: string;
    date: string;
    odometer: number;
    vendor: string;
    description: string;
    totalCost: number;
    nextServiceDue?: number;
    nextServiceDate?: string;
}

export const getMaintenance = async () => {
    const response = await client.get('/maintenance');
    return response.data;
};

export const createMaintenance = async (data: Omit<Maintenance, 'id'>) => {
    const response = await client.post('/maintenance', data);
    return response.data;
};

export const updateMaintenance = async (id: number, data: Partial<Omit<Maintenance, 'id'>>) => {
    const response = await client.patch(`/maintenance/${id}`, data);
    return response.data;
};
