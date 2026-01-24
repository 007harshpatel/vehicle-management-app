import client from './client';
import { Vehicle } from './vehicles';
import { Driver } from './drivers';

export interface Expense {
    id: number;
    date: string;
    category: string;
    amount: number;
    paymentMode: string;
    vehicleId?: number;
    vehicle?: Vehicle;
    driverId?: number;
    driver?: Driver;
    notes?: string;
}

export const getExpenses = async () => {
    const response = await client.get('/expenses');
    return response.data;
};

export const createExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const response = await client.post('/expenses', expenseData);
    return response.data;
};

export const updateExpense = async (id: number, expenseData: Partial<Omit<Expense, 'id'>>) => {
    const response = await client.patch(`/expenses/${id}`, expenseData);
    return response.data;
};
