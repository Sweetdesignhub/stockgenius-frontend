import axios from 'axios';

// Update the backend URL for deployment
export const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? "https://stockgenius-backend.onrender.com"
  : "http://localhost:8080";


const api = axios.create({
  baseURL: BACKEND_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export default api;
