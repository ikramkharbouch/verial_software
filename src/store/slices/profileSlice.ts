import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProfileData, updateProfileData } from '../../api/profileService';

// Define the shape of the profile state
interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

// Define the shape of the profile object
interface Profile {
  id: string;
  profilePicture: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string; // Optional field
}

// Initial state
const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Updated Async thunk for fetching profile data with userId
export const fetchProfile = createAsyncThunk<
  Profile,
  string, // Accepts userId as an argument
  { rejectValue: string }
>('profile/fetchProfile', async (userId, { rejectWithValue }) => {
  try {
    const response = await fetchProfileData(userId); // Pass userId to fetchProfileData
    console.log('fetch profile in profileSlice', response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch profile');
  }
});


// Async thunk for updating profile data, including password
export const updateProfile = createAsyncThunk<
  Profile,
  Partial<Profile & { password?: string }>,
  { rejectValue: string }
>('profile/updateProfile', async (updatedData, { rejectWithValue }) => {
  try {
    const response = await updateProfileData(updatedData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to update profile');
  }
});

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred';
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred';
      });
  },
});

export default profileSlice.reducer;
