// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005/cart', // Ganti dengan URL API Anda
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

export default axiosInstance;