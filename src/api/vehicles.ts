import client from './client';

export interface Vehicle {
    id: number;
    userId: number;
    driverId?: number;
    driver?: { name: string };
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    rcDetails?: string;
    insuranceExpiry?: string;
    pucExpiry?: string;
    fitnessExpiry?: string;
    purchaseDate?: string;
    purchasePrice?: number;
    status?: string;
    insuranceFile?: string;
    pucFile?: string;
    fitnessFile?: string;
    rcBookFile?: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
    const response = await client.get('/vehicles');
    return response.data;
};

export const createVehicle = async (data: any) => {
    // React Native FormData check
    const isFormData = data instanceof FormData || (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, '_parts'));
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
    // NOTE: 'multipart/form-data' without boundary might fail in some axios versions, 
    // but React Native's XHR/Axios adapter usually handles it if we pass the object. 
    // SAFEST: Let Axios handle it by passing undefined, but ensure we override the default JSON.

    const config = {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    };

    // Actually, setting 'multipart/form-data' manually is often problematic because of the boundary.
    // But clearly 'undefined' didn't work and fell back to urlencoded? 
    // Wait, the log showed "content-type": "application/x-www-form-urlencoded". 
    // This implies axios transformed it.

    // Let's try to be explicit.
    const response = await client.post('/vehicles', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
            return data; // Prevent axios from transforming FormData
        }
    });

    return response.data;
};

export const updateVehicle = async (id: number, data: any) => {
    const response = await client.patch(`/vehicles/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
            return data;
        }
    });

    return response.data;
};
