import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile as fetchUserProfileService, updateUserProfile as updateUserProfileService } from '../../api/userService';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
};

// Thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    return await fetchUserProfileService();
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
  }
});

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async (profile: UserProfile, { rejectWithValue }) => {
  try {
    return await updateUserProfileService(profile);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to update user profile');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
