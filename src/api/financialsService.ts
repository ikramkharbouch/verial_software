import API from './axiosInstance';
import { FinancialRecordType } from '@types';

export const fetchFinancials = async (): Promise<FinancialRecordType[]> => {
    const response = await API.get<FinancialRecordType[]>('/providers');
    return response.data;
};
