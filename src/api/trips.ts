import client from './client';

export interface Trip {
    id: number;
    vehicleId: number;
    driverId: number;
    fromLocation: string;
    toLocation: string;
    startDatetime: string;
    distance: number;
    loadType: string;
    weight: number;
    fuelLiters: number;
    fuelPrice: number;
    tollCharges: number;
    otherCharges: number;
    billAmount: number;
    advanceGiven: number;
    endDatetime?: string;
    notes?: string;
    tripStatus?: string;
}

export const getTrips = async () => {
    const response = await client.get('/trips');
    return response.data;
};

export const createTrip = async (tripData: Omit<Trip, 'id'>) => {
    const response = await client.post('/trips', tripData);
    return response.data;
};

export const updateTrip = async (id: number, tripData: Partial<Omit<Trip, 'id'>>) => {
    const response = await client.patch(`/trips/${id}`, tripData);
    return response.data;
};
