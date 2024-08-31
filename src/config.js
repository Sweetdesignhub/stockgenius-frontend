import axios from 'axios';

export const BACKEND_URL =
  // process.env.NODE_ENV === 'development'? "http://localhost:8080":
  //  "https://stockgenius-backend.onrender.com";
  // "https://api.stockgenius.ai"
  'http://localhost:8080';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
// const refreshAccessToken = async () => {
//   const response = await api.post('api/v1/auth/refresh-token');
//   return response.data;
// };

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await refreshAccessToken();
//       } catch (refreshError) {
//         console.error('Failed to refresh token:', refreshError);
//         window.location.href = '/sign-in';

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
