import axios from "axios";

export const BACKEND_URL =
  // process.env.NODE_ENV === 'development'? "http://localhost:8080":
  //  "https://stockgenius-backend.onrender.com";
  // "https://api.stockgenius.ai"
  "http://localhost:8080";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
