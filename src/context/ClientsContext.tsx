// // context/ClientsContext.tsx

// import React, {
//   createContext,
//   useContext,
//   ReactNode,
//   useState,
//   useEffect,
// } from 'react';
// import {
//   useQuery,
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query';
// // import { fetchClients } from '@api/clients';

// interface Client {
//   id: string;
//   companyName: string;
//   nif: string;
//   clientName: string;
//   typeOfClient: string;
//   phoneNumber1: string;
//   phoneNumber2?: string;
//   phoneNumber3?: string;
//   iceo: string;
//   country: string;
//   province: string;
//   postalCode: string;
//   email1: string;
//   email2?: string;
//   email3?: string;
// }

// interface ClientsContextType {
//   clients: Client[] | undefined;
//   isLoading: boolean;
//   error: unknown;
// }

// const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// export const ClientsProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const {
//     data: initialClients,
//     isLoading,
//     error,
//   } = useQuery<Client[]>({
//     queryKey: ['clients'],
//     queryFn: [],
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });

//   const [clients, setClients] = useState<Client[]>(initialClients || []);

//   return (
//     <ClientsContext.Provider value={{ clients, isLoading, error }}>
//       {children}
//     </ClientsContext.Provider>
//   );
// };

// export const useClients = (): ClientsContextType => {
//   const context = useContext(ClientsContext);
//   if (!context) {
//     throw new Error('useClients must be used within a ClientsProvider');
//   }
//   return context;
// };

// // Query client instance, used to wrap the app with QueryClientProvider
// const queryClient = new QueryClient();

// export const QueryProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => (
//   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// );
