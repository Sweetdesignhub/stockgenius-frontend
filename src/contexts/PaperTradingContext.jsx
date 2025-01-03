import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Assuming you're using Redux for user state
import api from "../config"; // Your API configuration for axios or fetch

// Create context
const PaperTradingContext = createContext();

// Provider component
export function PaperTradingProvider({ children }) {
  const [funds, setFunds] = useState({});
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux

  // Fetch paper trading data
  const fetchPaperTradingData = async () => {
    try {
      const userId = currentUser?.id; // Use user ID from the Redux state or other method
      if (userId) {
        const response = await api.get(`/api/v1/paper-trading/data/${userId}`);
        const data = response.data.data;

        setFunds(data.funds || {});
        setPositions(data.positions || []);
        setTrades(data.trades || []);
        setHoldings(data.holdings || []);
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError("Error fetching paper trading data");
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data once currentUser is available
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        setLoading(true); // Set loading to true when fetching starts
        await fetchPaperTradingData();
        setLoading(false); // Set loading to false once data is fetched
      };

      fetchData(); // Fetch data when the currentUser is available

      const dataInterval = setInterval(() => {
        fetchPaperTradingData();
      }, 5000); // Fetch data every 5 seconds (you can adjust the interval)

      return () => clearInterval(dataInterval); // Cleanup interval on unmount
    }
  }, [currentUser]); // This effect runs when currentUser changes

  // Return context provider with the necessary data
  return (
    <PaperTradingContext.Provider
      value={{
        funds,
        positions,
        trades,
        holdings,
        loading,
        error,
        fetchPaperTradingData,
      }}
    >
      {children}
    </PaperTradingContext.Provider>
  );
}

// Custom hook to use PaperTradingContext
export function usePaperTrading() {
  return useContext(PaperTradingContext);
}
