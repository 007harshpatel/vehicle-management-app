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
    billFile?: string;
}

export const getMaintenance = async () => {
    const response = await client.get('/maintenance');
    return response.data;
};

export const createMaintenance = async (data: any) => {
    const response = await client.post('/maintenance', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
            return data;
        }
    });
    return response.data;
};

export const updateMaintenance = async (id: number, data: any) => {
    const response = await client.patch(`/maintenance/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
            return data;
        }
    });
    return response.data;
};
