import axios from 'axios';

export const BACKEND_URL =
  // process.env.NODE_ENV === 'development'? "http://localhost:8080":
  //  "https://stockgenius-backend.onrender.com";
  // 'https://api.stockgenius.ai';
'http://localhost:8080';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

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

const refreshAccessToken = async () => {
  try {
    const response = await api.post('api/v1/auth/refresh-token');
    return response.data;
  } catch (err) {
    console.error('Failed to refresh token:', err);
    window.location.href = '/sign-in';
    throw err;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const { accessToken } = await refreshAccessToken();
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
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

// export default api;


