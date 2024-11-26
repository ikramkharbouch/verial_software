import { AxiosInstance } from 'axios';
import API from './axiosInstance'; // Assuming this is your API instance

// Define the Charge type
export interface Charge {
    id: number;
    chargeType: string;
    providerClient: string;
    invoiceNumber: string;
    paymentMethod: string;
    chargeDate: string;
    amount: number;
    description: string;
}

// Fetch all charges
export const fetchAllCharges = async (): Promise<Charge[]> => {
    const response = await API.get('/charges');
    return response.data;
};

// Add a new charge
export const createCharge = async (charge: Omit<Charge, 'id'>): Promise<Charge> => {
    const response = await API.post('/charges', charge);
    return response.data;
};

// Update an existing charge
export const updateChargeById = async (id: number, charge: Omit<Charge, 'id'>): Promise<Charge> => {
    const response = await API.put(`/charges/${id}`, charge);
    return response.data;
};

// Delete a charge by ID
export const deleteChargeById = async (id: number): Promise<void> => {
    await API.delete(`/charges/${id}`);
};
