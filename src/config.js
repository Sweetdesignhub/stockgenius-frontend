// import axios from 'axios';

// export const BACKEND_URL =
//   process.env.NODE_ENV === 'development' ? "http://localhost:8080" : "https://your-production-url.com";

// const api = axios.create({
//   baseURL: BACKEND_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue = [];
// let redirecting = false; // To prevent multiple redirects

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (token) {
//       prom.resolve(token);
//     } else {
//       prom.reject(error);
//     }
//   });
//   failedQueue = [];
// };

// const refreshAccessToken = async () => {
//   try {
//     const response = await api.post('/api/v1/auth/refresh-token');
//     return response.data;
//   } catch (err) {
//     console.error('Failed to refresh token:', err);
//     clearSessionAndRedirect();
//     throw err;
//   }
// };

// // Clear session and redirect to sign-in page
// const clearSessionAndRedirect = () => {
//   if (!redirecting) {
//     redirecting = true;
//     // Clear local storage/session/cookies
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
//     // Prevent redirection for the sign-in page
//     if (window.location.pathname !== '/sign-in') {
//       window.location.href = '/sign-in';
//     }
//   }
// };

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent refresh loop on the sign-in page
//     if (window.location.pathname === '/sign-in') {
//       return Promise.reject(error);
//     }

//     // Handle 401 error and token refresh
//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         originalRequest._retry = true;

//         try {
//           const { accessToken } = await refreshAccessToken();
//           api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//           localStorage.setItem('accessToken', accessToken); // Store new access token
//           processQueue(null, accessToken);
//           return api(originalRequest);
//         } catch (refreshError) {
//           processQueue(refreshError, null);
//           clearSessionAndRedirect();
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then((token) => {
//         originalRequest.headers['Authorization'] = `Bearer ${token}`;
//         return api(originalRequest);
//       }).catch((err) => Promise.reject(err));
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

// api.js

import axios from 'axios';

// Define backend URL based on environment
export const BACKEND_URL =
  // process.env.NODE_ENV === 'development'? "http://localhost:8080":
  //  "https://stockgenius-backend.onrender.com";
  // 'https://api.stockgenius.ai';
'http://localhost:8080';

// Create an Axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/session management
});

let isRefreshing = false;
let failedQueue = [];
let redirecting = false; // Prevent multiple redirects

// Function to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const response = await api.post('/api/v1/auth/refresh-token');
    return response.data;
  } catch (err) {
    console.error('Failed to refresh token:', err);
    clearSessionAndRedirect();
    throw err;
  }
};

// Function to clear session and redirect to sign-in page
const clearSessionAndRedirect = () => {
  if (!redirecting) {
    redirecting = true;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Dispatch event to show session expired modal
    const event = new Event('sessionExpired');
    window.dispatchEvent(event);
  }
};

// Request interceptor to add access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle session expired redirect
    if (window.location.pathname === '/sign-in') {
      return Promise.reject(error);
    }

    // Handle 401 error and token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const { accessToken } = await refreshAccessToken();
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          localStorage.setItem('accessToken', accessToken); // Store new access token
          processQueue(null, accessToken);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearSessionAndRedirect();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      }).catch((err) => Promise.reject(err));
    }

    return Promise.reject(error);
  }
);

export default api;
