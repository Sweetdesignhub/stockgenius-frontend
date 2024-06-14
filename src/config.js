import axios from 'axios';

export const BACKEND_URL = "https://stockgenius-backend.onrender.com";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
