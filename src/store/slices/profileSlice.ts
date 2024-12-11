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
  Profile, // Return type of the thunk
  string, // Argument type (userId)
  { rejectValue: string } // Rejected value type
>('profile/fetchProfile', async (userId, { rejectWithValue }) => {
  try {
    // Fetch profile data from the API
    const response = await fetchProfileData(userId); // Ensure fetchProfileData is correctly typed

    console.log('Raw profile data:', response.data);

    // Update the profilePicture URL if it exists
    const updatedProfile: Profile = {
      ...response.data,
      profilePicture: response.data.profilePicture
        ? `http://localhost:3000/profile/uploads/${response.data.profilePicture}`
        : null,
    };

    console.log('Updated profile with full image path:', updatedProfile);

    return updatedProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);

    // Handle error typing explicitly
    if (error instanceof Error && error.message) {
      return rejectWithValue(error.message);
    } else if (typeof error === 'object' && error && 'response' in error && error.response?.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('Failed to fetch profile');
    }
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
