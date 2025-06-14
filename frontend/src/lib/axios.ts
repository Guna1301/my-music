import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.MODE==='development' ? 'http://localhost:5000' : '/api',
}) 