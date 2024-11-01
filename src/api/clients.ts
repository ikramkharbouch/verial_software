// api/clients.ts
import axios from 'axios';

export const fetchClients = async () => {
  const response = await axios.get('http://localhost:3000/users');
  return response.data; // Assumes your server returns an array of clients
};