import axios from './axiosInstance'; // Assuming you have a pre-configured Axios instance

// Define the types for the profile data
interface Profile {
  id: string;
  profilePicture: string;
  name: string;
  email: string;
  phoneNumber: string;
  role?: string; // Optional field
}

// Fetch profile data from the backend with userId in the request body
export const fetchProfileData = async (userId: string): Promise<{ data: Profile }> => {
    return axios.post('/profile', { userId }); // Use POST to include userId
};    

// Update profile data to the backend
export const updateProfileData = async (
  updatedData: Partial<Profile & { password?: string }>
): Promise<{ data: Profile }> => {
  return axios.put('/profile', updatedData); // Replace '/profile' with your API endpoint
};
