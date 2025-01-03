import API from './axiosInstance';
import { ClientType } from '../types/clients';

export const fetchClients = async (): Promise<ClientType[]> => {
    const response = await API.get('/clients');
    return response.data;
};

export const addClient = async (client: ClientType): Promise<ClientType> => {
    const response = await API.post('/clients', client);
    return response.data;
};

export const deleteClient = async (id: any): Promise<ClientType> => {
    const response = await API.delete(`/clients/${id}`);
    return response.data;
}