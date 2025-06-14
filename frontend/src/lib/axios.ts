import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `https://my-music-backend.onrender.com/api`,
}) 