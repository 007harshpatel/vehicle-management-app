import client from './client';

export interface Vehicle {
    id: number;
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    insuranceExpiry?: string;
    pucExpiry?: string;
    fitnessExpiry?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    status?: string;
}

export const getVehicles = async () => {
    const response = await client.get('/vehicles');
    return response.data;
};

export const createVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    const response = await client.post('/vehicles', vehicleData);
    return response.data;
};

export const updateVehicle = async (id: number, vehicleData: Partial<Omit<Vehicle, 'id'>>) => {
    const response = await client.patch(`/vehicles/${id}`, vehicleData);
    return response.data;
};
