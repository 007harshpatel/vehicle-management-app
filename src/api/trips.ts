import client from './client';

export interface TripDetail {
    id?: number;
    momentDate: string;
    vehicleId: number;
    vehicleNumber: string;
    containerNo: string;

    fromLocation: string;
    viaLocation?: string;
    toLocation: string;
    weight: number;
    frs: number;
    loLo: number;
    detention: number;
    amount: number;
}

export interface Trip {
    id: number;
    driverId: number;
    driverName: string;
    supplyTo: string;
    billNo: string;
    startDatetime: string;
    refNo: string;
    panNo: string;
    docNo: string;
    subTotal: number;
    lessAdvance: number;
    totalAmount: number;
    notes?: string;
    tripStatus?: string;
    details: TripDetail[];
}

export const getTrips = async () => {
    const response = await client.get('/trips');
    return response.data;
};

export const createTrip = async (tripData: FormData | any) => {
    const response = await client.post('/trips', tripData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateTrip = async (id: number, tripData: FormData | any) => {
    const response = await client.patch(`/trips/${id}`, tripData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
