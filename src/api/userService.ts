import API from './axiosInstance'; // Adjust the path to your existing `api` instance

// Fetch user profile
export const fetchUserProfile = async () => {
  const response = await API.get('/user/profile'); // Adjust the endpoint as per your backend
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profile: any) => {
  const response = await API.put('/user/profile', profile); // Adjust the endpoint as needed
  return response.data;
};

// You can add more methods here if needed
