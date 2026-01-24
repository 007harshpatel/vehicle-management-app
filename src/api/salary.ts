import client from './client';
import { Driver } from './drivers';

export interface Salary {
    id: number;
    driverId: number;
    salaryType: string;
    amount: number;
    salaryDate: string;
    advance?: number;
    deduction?: number;
    driver?: Driver;
}
export const getSalaries = async () => {
    const response = await client.get('/salary');
    return response.data;
};

export const createSalary = async (salaryData: Omit<Salary, 'id'>) => {
    const response = await client.post('/salary', salaryData);
    return response.data;
};

export const updateSalary = async (id: number, salaryData: Partial<Omit<Salary, 'id'>>) => {
    const response = await client.patch(`/salary/${id}`, salaryData);
    return response.data;
};
