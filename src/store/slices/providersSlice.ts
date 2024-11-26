import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProviders } from '../../api/providersService';
import { ProviderType } from '../../types/providers';

// Define the initial state type
type ProvidersState = {
    providers: ProviderType[];
    status: string; // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null;
};

// Initial state
const initialState: ProvidersState = {
    providers: [],
    status: 'idle',
    error: null,
};

// Thunk to fetch providers
export const getProviders = createAsyncThunk<ProviderType[], void>(
    'providers/fetchProviders',
    async () => {
        const response = await fetchProviders();
        return response;
    }
);

// Slice
const providersSlice = createSlice({
    name: 'providers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProviders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getProviders.fulfilled, (state, action: PayloadAction<ProviderType[]>) => {
                state.status = 'succeeded';
                state.providers = action.payload;
            })
            .addCase(getProviders.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Failed to fetch providers';
            });
    },
});

export default providersSlice.reducer;
