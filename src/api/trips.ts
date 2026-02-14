import client from './client';

export interface Trip {
    id: number;
    driverId: number;
    driverName: string;
    partyId?: number; // Linked Ledger Party
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
    bill_file?: string;

    // Flattened Details
    momentDate: string;
    vehicleId: number;
    vehicleNumber: string;
    containerNo: string;
    fromLocation: string;
    viaLocation?: string;
    toLocation: string;
    weight: number;

    loLo: number;
    detention: number;

    // New Financial Fields
    diesel: number;
    driverExpense: number;
    toll: number;
    biltyCharge: number;
    weighBridge: number;
    extraCharge: number;
    transporter?: string;
    rate: number;
    extraMoney: number;
    receivedDate?: string;
    receivedAmount: number;
    pendingAmount: number;
    totalProfit: number;
    dealAmount?: number;
    ourCostNote?: string;
    partyBillNote?: string;
    billDueDate?: string;
}

export const getTrips = async (filters?: { partyId?: number }) => {
    const response = await client.get('/trips', { params: filters });
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
