import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchClients } from '../api/clientsService';
import { ClientType } from '../types/clients';

/**
 * Custom hook for fetching clients using React Query.
 */
export const useClients = (): UseQueryResult<ClientType[], Error> => {
    return useQuery<ClientType[], Error>({
        queryKey: ['clients'], // Query key
        queryFn: fetchClients, // Query function
    });
};
