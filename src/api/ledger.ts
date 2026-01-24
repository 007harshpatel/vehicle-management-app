import client from './client';

export interface Party {
    id: number;
    partyName: string;
    partyType: string;
    contact?: string;
    creditLimit?: number;
}

export interface LedgerEntry {
    id: number;
    partyId: number;
    entryType: string;
    amount: number;
    date: string;
    notes?: string;
}

export const getParties = async () => {
    const response = await client.get('/ledger/parties');
    return response.data;
};

export const createParty = async (partyData: Omit<Party, 'id'>) => {
    const response = await client.post('/ledger/party', partyData);
    return response.data;
};

export const updateParty = async (id: number, partyData: Partial<Omit<Party, 'id'>>) => {
    const response = await client.patch(`/ledger/party/${id}`, partyData);
    return response.data;
};

export const getLedgerEntries = async () => {
    const response = await client.get('/ledger/entries');
    return response.data;
};

export const createLedgerEntry = async (entryData: Omit<LedgerEntry, 'id'>) => {
    const response = await client.post('/ledger/entry', entryData);
    return response.data;
};

export const updateLedgerEntry = async (id: number, entryData: Partial<Omit<LedgerEntry, 'id'>>) => {
    const response = await client.patch(`/ledger/entry/${id}`, entryData);
    return response.data;
};
