import axios from "axios";

const API_BASE_URL = "https://chatbot.stockgenius.ai";

// Define API endpoints
const endpoints = {
  newsHighlights: `${API_BASE_URL}/NewsHighlights/`,
  profileOverview: `${API_BASE_URL}/ProfileOverview/`,
  tickerPerformance: `${API_BASE_URL}/TickerPerformance/`,
};

// Generic API call function
export const fetchTickerData = async (endpoint, ticker) => {
  try {
    const response = await axios.post(endpoint, { ticker });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  }
};

export default endpoints;
