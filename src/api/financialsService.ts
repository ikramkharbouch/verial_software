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
  console.log(charge);
    const response = await API.put(`/charges/${id}`, charge);
    return response.data;
};

// Delete a charge by ID
export const deleteChargeById = async (id: number): Promise<void> => {
    await API.delete(`/charges/${id}`);
};


export const getPayments = async () => {
  const response = await API.get("/payments");
  return response.data;
};

export const addPayment = async (payment: any) => {
  const response = await API.post("/payments", payment);
  return response.data;
};

export const updatePayment = async (id: string, payment: any) => {
  const response = await API.put(`/payments/${id}`, payment);
  return response.data;
};

export const deletePayment = async (id: string) => {
  const response = await API.delete(`/payments/${id}`);
  return response.data;
};

export const getCharges = async () => {
  try {
    const response = await API.get("/charges"); // Replace with your endpoint URL
    return response.data; // Assumes the response contains the array of charges
  } catch (error) {
    console.error("Error fetching charges:", error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};


export const fetchMadeBills = async () => {
  const response = await API.get('/madeBills');
  return response.data;
};

export const createMadeBill = async (bill: any) => {
  const response = await API.post('/madeBills', bill);
  return response.data;
};

export const updateMadeBill = async (id: string, updatedBill: any) => {
  const response = await API.put(`/madeBills/${id}`, updatedBill);
  return response.data;
};

export const deleteMadeBill = async (id: string) => {
  const response = await API.delete(`/madeBills/${id}`);
  return response.data;
};

export const downloadInvoiceAPI = async (id: string): Promise<Blob> => {
  const response = await API.get(`/madeBills/${id}/download`, {
    responseType: 'blob', // Ensures the response is treated as binary data
  });

  return response.data;
};