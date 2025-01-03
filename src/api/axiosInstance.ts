import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000', // Adjust for your server URL
    timeout: 10000,
});

export default API;