import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchInventoryData,
  fetchFinanceData,
  fetchProvidersData,
  fetchArticlesData,
  fetchInvoicesOverviewData,
  fetchRevenueExpensesData,
} from '../../api/dashboardService';

interface DashboardState {
  inventory: any[]; // Adjust types based on your API response
  finance: any; // Updated name to `finance` for consistency
  providers: any; // Updated name to `providers` for consistency
  articles: any; // Updated name to `articles` for consistency
  invoicesOverview: any[];
  revenueExpenses: { id: string; data: { x: string; y: number }[] }[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  inventory: [],
  finance: null,
  providers: null,
  articles: null,
  invoicesOverview: [],
  revenueExpenses: [],
  loading: false,
  error: null,
};

export const fetchRevenueExpenses = createAsyncThunk(
  'dashboard/fetchRevenueExpenses',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchRevenueExpensesData();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch revenue vs expenses data');
    }
  }
);


export const fetchInvoicesOverview = createAsyncThunk(
  'dashboard/fetchInvoicesOverview',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchInvoicesOverviewData();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch invoices overview data');
    }
  }
);

// Thunk for fetching inventory data
export const fetchInventory = createAsyncThunk('dashboard/fetchInventory', async (_, { rejectWithValue }) => {
  try {
    return await fetchInventoryData();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch inventory data');
  }
});

// Thunk for fetching finance data
export const fetchFinance = createAsyncThunk('dashboard/fetchFinance', async (_, { rejectWithValue }) => {
  try {
    return await fetchFinanceData();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch finance data');
  }
});

// Thunk for fetching providers data
export const fetchProviders = createAsyncThunk('dashboard/fetchProviders', async (_, { rejectWithValue }) => {
  try {
    return await fetchProvidersData();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch providers data');
  }
});

// Thunk for fetching articles data
export const fetchArticles = createAsyncThunk('dashboard/fetchArticles', async (_, { rejectWithValue }) => {
  try {
    return await fetchArticlesData();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch articles data');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.inventory = action.payload;
        state.loading = false;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Finance
      .addCase(fetchFinance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinance.fulfilled, (state, action) => {
        state.finance = action.payload;
        state.loading = false;
      })
      .addCase(fetchFinance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
        state.loading = false;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvoicesOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesOverview.fulfilled, (state, action) => {
        state.invoicesOverview = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvoicesOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRevenueExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueExpenses.fulfilled, (state, action) => {
        state.revenueExpenses = action.payload;
        state.loading = false;
      })
      .addCase(fetchRevenueExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
