import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchClients, addClient, deleteClient } from '../../api/clientsService';
import { ClientType } from '../../types/clients';

// Define the shape of the state
type ClientsState = {
    clients: ClientType[];
    status: string; // Can be 'idle', 'loading', 'succeeded', or 'failed'
    error: string | null;
};

// Initial state with defined types
const initialState: ClientsState = {
    clients: [],
    status: 'idle',
    error: null,
};

// Thunk to fetch clients
export const getClients = createAsyncThunk<ClientType[], void>(
    'clients/fetchClients',
    async () => {
        const response = await fetchClients();
        return response;
    }
);

// Thunk to create a new client
export const createClient = createAsyncThunk<ClientType, ClientType>(
    'clients/createClient',
    async (client: any) => {
        const response = await addClient(client);
        return response;
    }
);

// Async thunk for deleting a client
export const removeClient = createAsyncThunk(
    'clients/deleteClient',
    async (clientId: number, { rejectWithValue }) => {
        const response = await deleteClient(clientId);
        return response;
    }
);

// Components can dispatch getClients or createClient to interact with the API.

// that's how we call these functions elsewhere
// dispatch(getClients());
// dispatch(createClient(newClient));

// that's how we access the state const { clients, status, error } = useSelector((state: RootState) => state.clients);


// Slice definition
const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder
            // Handle getClients lifecycle
            .addCase(getClients.pending, (state: any) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getClients.fulfilled, (state: any, action: PayloadAction<ClientType[]>) => {
                state.status = 'succeeded';
                state.clients = action.payload;
            })
            .addCase(getClients.rejected, (state: any) => {
                state.status = 'failed';
                state.error = 'Failed to fetch clients';
            })
            // Handle createClient lifecycle
            .addCase(createClient.pending, (state: any) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state: any, action: PayloadAction<ClientType>) => {
                state.status = 'succeeded';
                state.clients.push(action.payload);
            })
            .addCase(createClient.rejected, (state: any) => {
                state.status = 'failed';
                state.error = 'Failed to create client';
            })
            .addCase(removeClient.pending, (state: any) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeClient.fulfilled, (state: any, action: PayloadAction<number>) => {
                state.loading = false;
                state.clients = state.clients.filter((client: any) => client.id !== action.payload);
            })
            .addCase(removeClient.rejected, (state: any, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete client';
            });
    },
});

export default clientsSlice.reducer;
