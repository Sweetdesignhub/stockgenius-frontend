import axios from "axios";
import { io } from "socket.io-client";

// Define backend URLs based on environment
export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.stockgenius.ai";

export const PAPER_TRADE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "https://papertrading.stockgenius.ai";

export const PAPER_TRADE_USA_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://papertradingusa.stockgenius.ai";

// Create Axios instance for main backend
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


// // Initialize socket connection
// const paperTradeSocket = io(PAPER_TRADE_URL, {
//   transports: ["websocket", "polling"], // Optional: makes fallback explicit
//   withCredentials: false, // No auth token needed
// });

// // Initialize socket connection
// const mainBackendSocket = new WebSocket(`${BACKEND_URL.replace(/^http/, 'ws')}`);

// mainBackendSocket.emit("test-message", { message: "hi from frontend" });


// Create Axios instance for paper trading (India)
const paperTradeApi = axios.create({
  baseURL: PAPER_TRADE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Create Axios instance for paper trading (USA)
const paperTradeUsaApi = axios.create({
  baseURL: PAPER_TRADE_USA_URL,
  headers: { "Content-Type": "application/json" },
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
export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/api/v1/auth/refresh-token");
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

// Attach access token to requests
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (window.location.pathname === "/sign-in") {
        return Promise.reject(error);
      }

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            const { accessToken } = await refreshAccessToken();
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            paperTradeApi.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            paperTradeUsaApi.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            localStorage.setItem("accessToken", accessToken);
            processQueue(null, accessToken);
            return instance(originalRequest);
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
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to all instances
addAuthInterceptor(api);
addAuthInterceptor(paperTradeApi);
addAuthInterceptor(paperTradeUsaApi);

// Export all instances
export default api;
export { paperTradeApi, paperTradeUsaApi,  }; // mainBackendSocket paperTradeSocket
 