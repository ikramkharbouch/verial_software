import API from './axiosInstance'; // Adjust the path to your API instance

// Fetch inventory data
export const fetchInventoryData = async () => {
  const response = await API.get('/stats/inventory'); // Updated route
  return response.data;
};

// Fetch finance data
export const fetchFinanceData = async () => {
  const response = await API.get('/stats/finance/due-invoices'); // Updated route
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

// Add the new API call for fetching invoices overview data
export const fetchInvoicesOverviewData = async () => {
  const response = await API.get('/stats/finance/invoices-overview'); // Use the route we set up
  return response.data;
};

export const fetchRevenueExpensesData = async () => {
  const response = await API.get('/stats/finance/revenue-expenses');
  return response.data;
};

