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
}

export const getDrivers = async () => {
    const response = await client.get('/drivers');
    return response.data;
};

export const createDriver = async (driverData: Omit<Driver, 'id'>) => {
    const response = await client.post('/drivers', driverData);
    return response.data;
};

export const updateDriver = async (id: number, driverData: Partial<Omit<Driver, 'id'>>) => {
    const response = await client.patch(`/drivers/${id}`, driverData);
    return response.data;
};
