import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAllCharges,
    createCharge,
    updateChargeById,
    deleteChargeById,
    fetchMadeBills,
    createMadeBill,
    updateMadeBill,
    deleteMadeBill,
    downloadInvoiceAPI,
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

// Define the MadeBill type
export interface MadeBill {
    clientName: any;
    invoiceNumber: any;
    invoiceType: string;
    totalPrice: number;
    id: string;
    provider: string;
    amount: number;
    method: string;
    date: string;
    status: string;
}

// Define the state interfaces
interface ChargesState {
    charges: Charge[];
    loading: boolean;
    error: string | null;
}

interface MadeBillsState {
    madeBills: MadeBill[];
    loading: boolean;
    error: string | null;
}

interface FinancialsState {
    chargesState: ChargesState;
    madeBillsState: MadeBillsState;
}

// Initial states
const initialChargesState: ChargesState = {
    charges: [],
    loading: false,
    error: null,
};

const initialMadeBillsState: MadeBillsState = {
    madeBills: [],
    loading: false,
    error: null,
};

// Async Thunks for Charges
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
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to delete charge');
    }
});

// Async Thunks for MadeBills
export const fetchAllMadeBills = createAsyncThunk('madeBills/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await fetchMadeBills();
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch made bills');
    }
});

export const createNewMadeBill = createAsyncThunk('madeBills/create', async (bill: MadeBill, { rejectWithValue }) => {
    try {
        return await createMadeBill(bill);
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to create made bill');
    }
});

export const updateExistingMadeBill = createAsyncThunk(
    'madeBills/update',
    async ({ id, updatedBill }: { id: string; updatedBill: MadeBill }, { rejectWithValue }) => {
        try {
            return await updateMadeBill(id, updatedBill);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update made bill');
        }
    }
);

export const removeMadeBill = createAsyncThunk('madeBills/delete', async (id: string, { rejectWithValue }) => {
    try {
        await deleteMadeBill(id);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to delete made bill');
    }
});

export const downloadInvoice = createAsyncThunk(
    'madeBills/downloadInvoice',
    async (id: string, { rejectWithValue }) => {
      try {
        const response = await downloadInvoiceAPI(id); // Call the service function
        const blob = new Blob([response], { type: 'application/pdf' });
  
        // Trigger the download in the browser
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error: any) {
        // Ensure the error is serialized
        return rejectWithValue(error.message || 'Failed to download invoice');
      }
    }
  );
  
// Create the slice
const financialsSlice = createSlice({
    name: 'financials',
    initialState: {
        chargesState: initialChargesState,
        madeBillsState: initialMadeBillsState,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Charges reducers
        builder
            .addCase(fetchCharges.pending, (state) => {
                state.chargesState.loading = true;
                state.chargesState.error = null;
            })
            .addCase(fetchCharges.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.chargesState.loading = false;
                state.chargesState.charges = action.payload;
            })
            .addCase(fetchCharges.rejected, (state, action: PayloadAction<any>) => {
                state.chargesState.loading = false;
                state.chargesState.error = action.payload;
            })
            .addCase(addCharge.fulfilled, (state, action: PayloadAction<any>) => {
                state.chargesState.charges.push(action.payload);
            })
            .addCase(updateCharge.fulfilled, (state, action: PayloadAction<any>) => {
                const index = state.chargesState.charges.findIndex((charge) => charge.id === action.payload.id);
                if (index !== -1) {
                    state.chargesState.charges[index] = action.payload;
                }
            })
            .addCase(deleteCharge.fulfilled, (state, action: PayloadAction<number>) => {
                state.chargesState.charges = state.chargesState.charges.filter(
                    (charge) => charge.id !== action.payload
                );
            });

        // MadeBills reducers
        builder
            .addCase(fetchAllMadeBills.pending, (state) => {
                state.madeBillsState.loading = true;
                state.madeBillsState.error = null;
            })
            .addCase(fetchAllMadeBills.fulfilled, (state, action: PayloadAction<MadeBill[]>) => {
                state.madeBillsState.loading = false;
                state.madeBillsState.madeBills = action.payload;
            })
            .addCase(fetchAllMadeBills.rejected, (state, action: PayloadAction<any>) => {
                state.madeBillsState.loading = false;
                state.madeBillsState.error = action.payload;
            })
            .addCase(createNewMadeBill.fulfilled, (state, action: PayloadAction<MadeBill>) => {
                state.madeBillsState.madeBills.push(action.payload);
            })
            .addCase(updateExistingMadeBill.fulfilled, (state, action: PayloadAction<MadeBill>) => {
                const index = state.madeBillsState.madeBills.findIndex((bill) => bill.id === action.payload.id);
                if (index !== -1) {
                    state.madeBillsState.madeBills[index] = action.payload;
                }
            })
            .addCase(removeMadeBill.fulfilled, (state, action: PayloadAction<string>) => {
                state.madeBillsState.madeBills = state.madeBillsState.madeBills.filter(
                    (bill) => bill.id !== action.payload
                );
            });
            builder.addCase(downloadInvoice.rejected, (state, action) => {
                state.madeBillsState.error = action.payload as string;
              });
              
    },
});

// Export actions and reducer
export default financialsSlice.reducer;
