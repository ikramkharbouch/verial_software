import create from 'zustand';

interface Client {
  id: number;
  name: string;
  // Other client properties
}

interface ClientsState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  fetchClients: () => Promise<void>; // Add a method for fetching clients
}

const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),

  fetchClients: async () => {
    try {
      const response = await fetch('/api/clients'); // Adjust your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      set({ clients: data }); // Update global state
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  },
}));

export default useClientsStore;
