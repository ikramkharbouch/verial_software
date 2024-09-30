import { useQuery } from 'react-query';

export function useFetchItems() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/users?limit=2',
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}

export function useGetClient(data: any) {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await fetch(
        process.env.REACT_APP_API_URI + '/users?limit=2',
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
}

export const useCreateClient = async (data: any) => {
  // make type for the client
  // Perform the mutation logic, e.g., make an API request to update the user
  const response = await fetch('http://localhost:3000/users/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
};
