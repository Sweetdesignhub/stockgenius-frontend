// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useSelector } from "react-redux"; // Assuming you're using Redux for user state
// import api from "../config"; // Your API configuration for axios or fetch

// // Create context
// const PaperTradingContext = createContext();

// // Provider component
// export function PaperTradingProvider({ children }) {
//   const [funds, setFunds] = useState({});
//   const [positions, setPositions] = useState([]);
//   const [trades, setTrades] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [orders, setOrders] = useState([]); // Add state for orders
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { currentUser } = useSelector((state) => state.user); // Get current user from Redux

//   // Fetch paper trading data
//   const fetchPaperTradingData = async () => {
//     try {
//       const userId = currentUser?.id; // Use user ID from the Redux state or other method
//       if (userId) {
//         const response = await api.get(`/api/v1/paper-trading/data/${userId}`);
//         const data = response.data.data;
//         // console.log(data);

//         setFunds(data.funds || {});
//         setPositions(data.positions || []);
//         setTrades(data.trades || []);
//         setHoldings(data.holdings || []);
//         setOrders(data.orders || []); // Update to set orders
//       } else {
//         setError("User not found");
//       }
//     } catch (error) {
//       setError("Error fetching paper trading data");
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data once currentUser is available
//   useEffect(() => {
//     if (currentUser) {
//       const fetchData = async () => {
//         setLoading(true); // Set loading to true when fetching starts
//         await fetchPaperTradingData();
//         setLoading(false); // Set loading to false once data is fetched
//       };

//       fetchData(); // Fetch data when the currentUser is available

//       const dataInterval = setInterval(() => {
//         fetchPaperTradingData();
//       }, 10000); // Fetch data every 5 seconds (you can adjust the interval)

//       return () => clearInterval(dataInterval); // Cleanup interval on unmount
//     }
//   }, [currentUser]); // This effect runs when currentUser changes

//   // Return context provider with the necessary data
//   return (
//     <PaperTradingContext.Provider
//       value={{
//         funds,
//         positions,
//         trades,
//         holdings,
//         orders, // Provide orders in the context
//         loading,
//         error,
//         fetchPaperTradingData,
//       }}
//     >
//       {children}
//     </PaperTradingContext.Provider>
//   );
// }

// // Custom hook to use PaperTradingContext
// export function usePaperTrading() {
//   return useContext(PaperTradingContext);
// }

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import api from "../config";

const PaperTradingContext = createContext();

export function PaperTradingProvider({ children }) {
  const [funds, setFunds] = useState({});
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realtimePrices, setRealtimePrices] = useState({});
  const [profitSummary, setProfitSummary] = useState({
    todaysProfit: 0,
    totalProfit: 0,
  });

  const { currentUser } = useSelector((state) => state.user);

  const fetchRealtimePrices = useCallback(async (symbols) => {
    try {
      const pricePromises = symbols.map((symbol) =>
        api
          .get(`/api/v1/stocks/price/${symbol}`)
          .then((response) => ({
            symbol,
            price: response.data.price,
          }))
          .catch((error) => ({
            symbol,
            price: null,
            error: true,
          }))
      );

      const prices = await Promise.all(pricePromises);
      const priceMap = prices.reduce((acc, { symbol, price }) => {
        if (price !== null) {
          acc[symbol] = price;
        }
        return acc;
      }, {});

      setRealtimePrices((prevPrices) => ({
        ...prevPrices,
        ...priceMap,
      }));

      return priceMap;
    } catch (error) {
      console.error("Error fetching real-time prices:", error);
      return {};
    }
  }, []);

  const calculateProfits = useCallback(
    (prices, positionsArray, holdingsArray) => {
      let todaysProfit = 0;
      let totalProfit = 0;

      if (Array.isArray(positionsArray)) {
        positionsArray.forEach((position) => {
          const currentPrice =
            prices[position.stockSymbol] || position.ltp || 0;
          const quantity = position.quantity || 0;
          const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;
          const positionProfit = (currentPrice - avgBuyPrice) * quantity;
          todaysProfit += positionProfit;
        });
      }

      if (Array.isArray(holdingsArray)) {
        holdingsArray.forEach((holding) => {
          const currentPrice =
            prices[holding.stockSymbol] || holding.lastTradedPrice || 0;

          const quantity = holding.quantity || 0;

          const avgBuyPrice = holding.averagePrice || 0;

          const holdingProfit = (currentPrice - avgBuyPrice) * quantity;
          totalProfit += holdingProfit;
        });
      }

      setProfitSummary({
        todaysProfit: Number(todaysProfit.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
      });
    },
    []
  );

  const fetchPaperTradingData = useCallback(async () => {
    try {
      const userId = currentUser?.id;
      if (!userId) {
        setError("User not found");
        return;
      }

      const response = await api.get(`/api/v1/paper-trading/data/${userId}`);
      const data = response.data.data;

      const positionsArray = data.positions?.netPositions || [];
      const holdingsArray = data.holdings?.holdings || [];

      setFunds(data.funds || {});
      setPositions(positionsArray);
      setHoldings(holdingsArray);
      setTrades(Array.isArray(data.trades) ? data.trades : []);
      setOrders(Array.isArray(data.orders) ? data.orders : []);

      const positionSymbols = positionsArray
        .map((p) => p.stockSymbol)
        .filter(Boolean);

      const holdingSymbols = holdingsArray
        .map((h) => h.stockSymbol)
        .filter(Boolean);

      const uniqueSymbols = [
        ...new Set([...positionSymbols, ...holdingSymbols]),
      ];

      if (uniqueSymbols.length > 0) {
        const prices = await fetchRealtimePrices(uniqueSymbols);
        calculateProfits(prices, positionsArray, holdingsArray);
      }
    } catch (error) {
      setError("Error fetching paper trading data");
      console.error("Error fetching data:", error);
    }
  }, [currentUser?.id, fetchRealtimePrices, calculateProfits]);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchData = async () => {
        setLoading(true);
        await fetchPaperTradingData();
        setLoading(false);
      };

      fetchData();

      const dataInterval = setInterval(fetchPaperTradingData, 20000);

      return () => {
        clearInterval(dataInterval);
      };
    }
  }, [currentUser?.id, fetchPaperTradingData]);

  const contextValue = {
    funds,
    positions,
    trades,
    holdings,
    orders,
    loading,
    error,
    realtimePrices,
    profitSummary,
    fetchPaperTradingData,
  };

  return (
    <PaperTradingContext.Provider value={contextValue}>
      {children}
    </PaperTradingContext.Provider>
  );
}

export function usePaperTrading() {
  return useContext(PaperTradingContext);
}
