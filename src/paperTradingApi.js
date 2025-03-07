import axios from "axios";

// Define backend URL for the Paper Trading microservice
export const PAPER_TRADING_BACKEND_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8081'
    : import.meta.env.VITE_PAPER_TRADING_MS;

// Create an Axios instance
const paperTradingApi = axios.create({
    baseURL: PAPER_TRADING_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let redirecting = false;

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
        const response = await paperTradingApi.post("/api/v1/auth/refresh-token");
        return response.data;
    } catch (err) {
        console.error("Failed to refresh token:", err);
        clearSessionAndRedirect();
        throw err;
    }
};

const clearSessionAndRedirect = () => {
    if (!redirecting) {
        redirecting = true;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        const event = new Event("sessionExpired");
        window.dispatchEvent(event);
    }
};

paperTradingApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

paperTradingApi.interceptors.response.use(
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
                    paperTradingApi.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                    localStorage.setItem("accessToken", accessToken);
                    processQueue(null, accessToken);
                    return paperTradingApi(originalRequest);
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
                    return paperTradingApi(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        return Promise.reject(error);
    }
);
export const fetchAllPaperTradingData = async (userId) => {
    try {
        console.log("Fetching all paper trading data for user:", userId);

        const [fundsRes, positionsRes, holdingsRes, tradesRes, ordersRes] = await Promise.all([
            paperTradingApi.get(`/api/v1/paper-trading/funds/${userId}`),
            paperTradingApi.get(`/api/v1/paper-trading/positions/${userId}`),
            paperTradingApi.get(`/api/v1/paper-trading/holdings/${userId}`),
            paperTradingApi.get(`/api/v1/paper-trading/trades/${userId}`),
            paperTradingApi.get(`/api/v1/paper-trading/orders/${userId}`),
        ]);

        // console.log("Funds Response:", fundsRes.data?.data?.availableFunds);
        // console.log("Positions Response:", positionsRes.data?.data?.netPositions);
        // console.log("Holdings Response:", holdingsRes.data.data);
        // console.log("Trades Response:", tradesRes.data.data[0]?.trades);
        // console.log("Orders Response:", ordersRes.data?.orders[0]?.orders);

        return {
            funds: fundsRes.data?.data?.availableFunds || "200000",
            positions: positionsRes.data?.data?.netPositions || [],
            holdings: holdingsRes.data || [],
            trades: Array.isArray(tradesRes.data.data[0]?.trades) ? tradesRes.data : [],
            orders: Array.isArray(ordersRes.data?.orders[0]?.orders) ? ordersRes.data : [],
        };
    } catch (error) {
        console.error("Error fetching paper trading data:", error);
        return { funds: {}, positions: [], holdings: [], trades: [], orders: [] };
    }
};


export const placeOrder = async (userId, orderData) => {
    try {
        const response = await paperTradingApi.post(`/api/v1/paper-trading/orders/placeOrder/${userId}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
};

export const placeOrderBot = async (userId, orderData) => {
    try {
        const response = await paperTradingApi.post(`/api/v1/paper-trading/orders/placeOrderBot/${userId}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error placing order via bot:', error);
        throw error;
    }
};

export const placeMultipleOrders = async (userId, orders) => {
    try {
        const response = await paperTradingApi.post(`/api/v1/paper-trading/orders/placeMultipleOrders/${userId}`, { orders });
        return response.data;
    } catch (error) {
        console.error('Error placing multiple orders:', error);
        throw error;
    }
};

export const modifyOrder = async (userId, orderId, orderData) => {
    try {
        const response = await paperTradingApi.put(`/api/v1/paper-trading/orders/modify/${userId}/${orderId}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error modifying order:', error);
        throw error;
    }
};


// API Endpoints
export const healthCheck = () => paperTradingApi.get("/");
export const getUserFunds = (userId) => paperTradingApi.get(`/api/v1/paper-trading/funds/${userId}`);
export const getUserHoldings = (userId) => paperTradingApi.get(`/api/v1/paper-trading/holdings/${userId}`);
export const getUserOrders = (userId) => paperTradingApi.get(`/api/v1/paper-trading/orders/${userId}`);
export const getOrdersByDate = (userId) => paperTradingApi.get(`/api/v1/paper-trading/orders/currentDay/${userId}`);
export const getUserPositions = (userId) => paperTradingApi.get(`/api/v1/paper-trading/positions/${userId}`);
export const getUserTrades = (userId) => paperTradingApi.get(`/api/v1/paper-trading/trades/${userId}`);

export default paperTradingApi;
