import client from './client';

export interface Driver {
    id: number;
    name: string;
    mobile: string;
    licenseNumber: string;
    licenseExpiry?: string;
    aadhaar?: string;
    salaryType?: string;
    salaryAmount?: number;
    joiningDate?: string;
    status?: string;
    aadhaarFile?: string;
    licenseFile?: string;
    photo?: string;
}

export const getDrivers = async () => {
    const response = await client.get('/drivers');
    return response.data;
};

export const createDriver = async (driverData: any) => {
    const response = await client.post('/drivers', driverData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateDriver = async (id: number, driverData: any) => {
    const response = await client.patch(`/drivers/${id}`, driverData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
    return response.data;
};

export const getDriverTransactions = async (driverId: number) => {
    try {
        const response = await client.get(`/drivers/${driverId}/transactions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching driver transactions:', error);
        throw error;
    }
};
