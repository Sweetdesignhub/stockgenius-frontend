// import axios from "axios";

// // Define backend URL based on environment
// export const BACKEND_URL =
//   // process.env.NODE_ENV === 'development'? "http://localhost:8080":
//   //  "https://stockgenius-backend.onrender.com";
//   // "https://api.stockgenius.ai";
// 'http://localhost:8080', 'http://localhost:8081';

// // Create an Axios instance
// const api = axios.create({
//   baseURL: BACKEND_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue = [];
// let redirecting = false; // Prevent multiple redirects

// // Function to process queued requests
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

// // Function to refresh access token
// const refreshAccessToken = async () => {
//   try {
//     const response = await api.post("/api/v1/auth/refresh-token");
//     return response.data;
//   } catch (err) {
//     console.error("Failed to refresh token:", err);
//     clearSessionAndRedirect();
//     throw err;
//   }
// };

// // Function to clear session and redirect to sign-in page
// const clearSessionAndRedirect = () => {
//   if (!redirecting) {
//     redirecting = true;
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     document.cookie =
//       "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//     // Dispatch event to show session expired modal
//     const event = new Event("sessionExpired");
//     window.dispatchEvent(event);
//   }
// };

// // Request interceptor to add access token to headers
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle 401 errors and refresh tokens
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Handle session expired redirect
//     if (window.location.pathname === "/sign-in") {
//       return Promise.reject(error);
//     }

//     // Handle 401 error and token refresh
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         originalRequest._retry = true;

//         try {
//           const { accessToken } = await refreshAccessToken();
//           api.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${accessToken}`;
//           localStorage.setItem("accessToken", accessToken); // Store new access token
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
//       })
//         .then((token) => {
//           originalRequest.headers["Authorization"] = `Bearer ${token}`;
//           return api(originalRequest);
//         })
//         .catch((err) => Promise.reject(err));
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";

// Define backend and microservice URLs
const BACKEND_MAIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.stockgenius.ai";

const BACKEND_MICROSERVICE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "https://microservice.stockgenius.ai";

// Create a single Axios instance
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let redirecting = false;

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
    const response = await axios.post(`${BACKEND_MAIN_URL}/api/v1/auth/refresh-token`);
    return response.data;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    clearSessionAndRedirect();
    throw err;
  }
};

// Function to clear session and redirect to sign-in page
const clearSessionAndRedirect = () => {
  if (!redirecting) {
    redirecting = true;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    const event = new Event("sessionExpired");
    window.dispatchEvent(event);
  }
};

// Request Interceptor: Dynamically set baseURL and add access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Dynamically set baseURL based on request path
    if (config.url.startsWith("/microservice")) {
      config.baseURL = BACKEND_MICROSERVICE_URL;
      config.url = config.url.replace("/microservice", ""); // Remove prefix
    } else {
      config.baseURL = BACKEND_MAIN_URL;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors & refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (window.location.pathname === "/sign-in") {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const { accessToken } = await refreshAccessToken();
          api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          localStorage.setItem("accessToken", accessToken);
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
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    return Promise.reject(error);
  }
);

export default api;
