import API from './axiosInstance';
import { ProviderType } from '../types/providers';

export const fetchProviders = async (): Promise<ProviderType[]> => {
    const response = await API.get<ProviderType[]>('/providers');
    return response.data;
};
