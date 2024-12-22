import API from './axiosInstance'; // Adjust the path to your API instance

// Fetch inventory data
export const fetchInventoryData = async () => {
  const response = await API.get('/stats/inventory'); // Updated route
  return response.data;
};

// Fetch finance data
export const fetchFinanceData = async () => {
  const response = await API.get('/stats/finance'); // Updated route
  return response.data;
};

// Fetch providers data
export const fetchProvidersData = async () => {
  const response = await API.get('/stats/providers'); // Updated route
  return response.data;
};

// Fetch articles data
export const fetchArticlesData = async () => {
  const response = await API.get('/stats/articles'); // Updated route
  return response.data;
};
