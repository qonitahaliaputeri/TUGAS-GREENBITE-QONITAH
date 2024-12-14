// src/services/apiService.js
import axios from 'axios';

const apiService = axios.create({
    baseURL: 'http://localhost:3005/cart',
    timeout: 1000,
});

export const fetchData = async (endpoint) => {
    const response = await apiService.get(endpoint);
    return response.data;
};

// Tambahkan fungsi lain sesuai kebutuhan