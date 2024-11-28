import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    fetchAllCharges,
    createCharge,
    updateChargeById,
    deleteChargeById,
} from '../../api/financialsService';

// Define the Charge type
export interface Charge {
    invoice_number: any;
    provider_client: any;
    id: number;
    chargeType: string;
    providerClient: string;
    invoiceNumber: string;
    paymentMethod: string;
    chargeDate: string;
    amount: number;
    description: string;
}

// Define the initial state
interface FinancialsState {
    charges: Charge[];
    loading: boolean;
    error: string | null;
}

const initialState: FinancialsState = {
    charges: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchCharges = createAsyncThunk('financials/fetchCharges', async (_, { rejectWithValue }) => {
    try {
        return await fetchAllCharges();
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch charges');
    }
});

export const addCharge = createAsyncThunk('financials/addCharge', async (charge: Omit<Charge, 'id'>, { rejectWithValue }) => {
    try {
        return await createCharge(charge);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to add charge');
    }
});

export const updateCharge = createAsyncThunk(
    'financials/updateCharge',
    async ({ id, charge }: { id: number; charge: Omit<Charge, 'id'> }, { rejectWithValue }) => {
        try {
            return await updateChargeById(id, charge);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update charge');
        }
    }
);

export const deleteCharge = createAsyncThunk('financials/deleteCharge', async (id: number, { rejectWithValue }) => {
    try {
        await deleteChargeById(id);
        return id; // Return the ID of the deleted charge
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to delete charge');
    }
});

// Create the slice
const financialsSlice = createSlice({
    name: 'financials',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharges.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.charges = action.payload;
            })
            .addCase(fetchCharges.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCharge.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCharge.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.charges.push(action.payload);
            })
            .addCase(addCharge.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCharge.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCharge.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const index = state.charges.findIndex((charge) => charge.id === action.payload.id);
                if (index !== -1) {
                    state.charges[index] = action.payload;
                }
            })
            .addCase(updateCharge.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCharge.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCharge.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.charges = state.charges.filter((charge) => charge.id !== action.payload);
            })
            .addCase(deleteCharge.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export default financialsSlice.reducer;
