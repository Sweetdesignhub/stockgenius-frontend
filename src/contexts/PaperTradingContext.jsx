import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { paperTradeApi, PAPER_TRADE_URL } from "../config";
import { io } from "socket.io-client";

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
  const [investedAmount, setInvestedAmount] = useState(0);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const formatSymbol = (symbol) => `${symbol}.NS`;

  const updateOrAddItem = useCallback((array, newItem) => {
    const exists = array.find(item => item._id === newItem._id);
    if (exists) {
      return array.map(item => (item._id === newItem._id ? newItem : item));
    }
    return [...array, newItem];
  }, []);

  // Socket connection and event handlers
  useEffect(() => {
    if (!currentUser?.id) return;

    const socket = io(PAPER_TRADE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: false,
      query: { userID: currentUser.id }
    });

    // Stock price updates
    const handleStockUpdate = (data) => {
      if (!data || typeof data !== 'object') return;
      // console.log();
      setRealtimePrices((prev) => ({ ...prev, ...data }));
    };
    
    socket.on("stock-update", handleStockUpdate);
    
    // Initial stock prices from backend
    socket.on(`initialStockPrices:${currentUser.id}`, (stockPriceMap) => {
      console.log("Stock order:", stockPriceMap);
      setRealtimePrices(prev => ({ ...prev, ...stockPriceMap }));
    });

    // Initial data handlers
    const handleInitialData = (data, setState, dataKey = null) => {
      if (!initialDataLoaded && data) {
        const dataToSet = dataKey ? data[0][dataKey] : data;
        if (dataToSet) {
          setState(dataToSet);
        }
      }
    };

    socket.on(`initialOrders:${currentUser.id}`, (data) => {
      console.log("Data order:", data[0]);
      handleInitialData(data, setOrders, 'orders');
    });

    socket.on(`initialTrades:${currentUser.id}`, (data) => {
      handleInitialData(data, setTrades, 'trades');
    });

    socket.on(`initialPositions:${currentUser.id}`, (data) => {
      handleInitialData(data, setPositions, 'netPositions');
    });

    socket.on(`initialHoldings:${currentUser.id}`, (data) => {
      handleInitialData(data, setHoldings, 'holdings');
    });

    socket.on(`initialFunds:${currentUser.id}`, (data) => {
      if (data && data[0]) {
        setFunds(data[0]);
        setInvestedAmount(data[0].investedAmount || 0);
      }
    });

    // Real-time update handlers
    socket.on(`newOrder:${currentUser.id}`, (newOrder) => {
      // console.log("New Order Recieved from newOrder: ", newOrder);
      setOrders(newOrder.orders);
      // setOrders(prev => updateOrAddItem(prev, newOrder));
    });

    socket.on(`newTrade:${currentUser.id}`, (newTradeDoc) => {

      setTrades(prev => newTradeDoc.trades || prev);
    });

    socket.on(`newPosition:${currentUser.id}`, (newPosition) => {
      setPositions(newPosition.netPositions);
    });
    socket.on(`newHolding:${currentUser.id}`, (newHolding) => {
      // console.log("New Holding Recieved from newHolding: ", newHolding);
      setHoldings(newHolding.holdings);
    });

    socket.on(`newFunds:${currentUser.id}`, (newFund) => {
      console.log("New Funds Recieved from newFund: ", newFund);
      setFunds(newFund);
      if (newFund.investedAmount !== undefined) {
        setInvestedAmount(newFund.investedAmount);
      }
    });

    return () => {
      socket.off("stock-update", handleStockUpdate);
      socket.off(`initialStockPrices:${currentUser.id}`);
      socket.disconnect();
    };
  }, [currentUser?.id, initialDataLoaded, updateOrAddItem]);

  const calculateProfits = useCallback((prices, positionsArray, holdingsArray) => {
    if (!prices || typeof prices !== 'object') return;

    let todaysProfit = 0;
    let totalProfit = 0;
    let totalInvested = 0;
    
    positionsArray.forEach((position) => {
      const symbol = position.stockSymbol;
      if (!symbol) return;

      const key = formatSymbol(symbol);
      const currentPrice = prices[key];
      const finalPrice = currentPrice !== undefined ? currentPrice : position.ltp || 0;
      const quantity = position.quantity || 0;
      const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;

      if (quantity > 0 && finalPrice > 0 && avgBuyPrice > 0) {
        todaysProfit += (finalPrice - avgBuyPrice) * quantity;
        totalInvested += avgBuyPrice * quantity;
      }
    });

    holdingsArray.forEach((holding) => {
      const symbol = holding.stockSymbol;
      if (!symbol) return;

      const key = formatSymbol(symbol);
      const currentPrice = prices[key];
      const finalPrice = currentPrice !== undefined ? currentPrice : holding.lastTradedPrice || 0;
      const quantity = holding.quantity || 0;
      const avgBuyPrice = holding.averagePrice || 0;

      if (quantity > 0 && finalPrice > 0 && avgBuyPrice > 0) {
        totalProfit += (finalPrice - avgBuyPrice) * quantity;
        totalInvested += avgBuyPrice * quantity;
      }
    });

    setProfitSummary({
      todaysProfit: Number(todaysProfit.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
    });
  }, []);

  useEffect(() => {
    if (loading || !initialDataLoaded) return;
    if (Object.keys(realtimePrices).length === 0) return;
    if (positions.length === 0 && holdings.length === 0) return;

    const timeout = setTimeout(() => {
      calculateProfits(realtimePrices, positions, holdings);
    }, 500);

    return () => clearTimeout(timeout);
  }, [realtimePrices, positions, holdings, initialDataLoaded, loading, calculateProfits]);

  const fetchPaperTradingData = useCallback(async (isFirstLoad = false) => {
    try {
      const userId = currentUser?.id;
      if (!userId) {
        setError("User not found");
        return;
      }

      if (isFirstLoad) setLoading(true);

      // Only fetch via REST if socket hasn't provided data yet
      const shouldFetchViaRest = isFirstLoad && !initialDataLoaded;

      if (shouldFetchViaRest) {
        const [
          fundsResponse,
          positionsResponse,
          tradesResponse,
          holdingsResponse,
          ordersResponse,
        ] = await Promise.all([
          paperTradeApi.get(`/api/v1/paper-trading/funds/${userId}`),
          paperTradeApi.get(`/api/v1/paper-trading/positions/${userId}`),
          paperTradeApi.get(`/api/v1/paper-trading/trades/${userId}`),
          paperTradeApi.get(`/api/v1/paper-trading/holdings/${userId}`),
          paperTradeApi.get(`/api/v1/paper-trading/orders/${userId}`),
        ]);
        console.log("Positions Response: ", positionsResponse);
        // Only set state if we don't already have data from sockets
        if (positions.length === 0) {
          setPositions(positionsResponse?.data?.data?.netPositions || []);
        }
        if (trades.length === 0) {
          setTrades(tradesResponse?.data?.data?.[0]?.trades || []);
        }
        if (holdings.length === 0) {
          setHoldings(holdingsResponse?.data?.data || []);
        }
        if (orders.length === 0) {
          setOrders(ordersResponse?.data?.orders?.[0]?.orders || []);
        }
        if (Object.keys(funds).length === 0) {
          setFunds(fundsResponse?.data?.data || {});
          setInvestedAmount(fundsResponse?.data?.data?.investedAmount || 0);
        }
      }

      // Removed the fetchRealtimePrices call since we're getting prices via socket.io

      if (isFirstLoad) {
        setInitialDataLoaded(true);
      }

    } catch (error) {
      console.error("Error fetching paper trading data:", error);
      setError("Error fetching paper trading data");
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  }, [currentUser?.id, positions, trades, holdings, orders, funds, initialDataLoaded]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchData = async () => {
      await fetchPaperTradingData(true);
    };

    fetchData();

    const dataInterval = setInterval(() => {
      fetchPaperTradingData(false);
    }, 15000);

    return () => clearInterval(dataInterval);
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
    investedAmount,
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


// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { useSelector } from "react-redux";
// import { paperTradeApi, PAPER_TRADE_URL } from "../config";
// import { io } from "socket.io-client";

// const PaperTradingContext = createContext();

// export function PaperTradingProvider({ children }) {
//   const [funds, setFunds] = useState({});
//   const [positions, setPositions] = useState([]);
//   const [trades, setTrades] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [realtimePrices, setRealtimePrices] = useState({});
//   const [profitSummary, setProfitSummary] = useState({
//     todaysProfit: 0,
//     totalProfit: 0,
//   });
//   const [investedAmount, setInvestedAmount] = useState(0);
//   const [firstCalculationDone, setFirstCalculationDone] = useState(false);

//   const { currentUser } = useSelector((state) => state.user);


//   useEffect(() => {
//     if (!currentUser?.id) return;
//     const userID = currentUser.id;
//     console.log("Trying to connect", userID)

//     console.log("Backend URL to connect", PAPER_TRADE_URL)
//     // Create socket connection with userID query param
//     const socket = io(PAPER_TRADE_URL, {
//       transports: ["websocket", "polling"], // Optional: makes fallback explicit
//       withCredentials: false, // No auth token needed
//       query: { userID }
//     });

//     // --- Existing stock update listener (do not change) ---
//     const handleStockUpdate = (data) => {
//       if (!data || typeof data !== 'object') return;
//       setRealtimePrices((prev) => ({ ...prev, ...data }));
//     };
//     socket.on("stock-update", handleStockUpdate);

//     // --- New: Listen for initial data ---
//     socket.on(`initialOrders:${userID}`, (data) => {
//       console.log("Recienving orders", data[0].orders);
//       setOrders(data[0].orders);
//     });
//     socket.on(`initialTrades:${userID}`, (data) => {
//       console.log("Recienving trade", data);
//       setTrades(data);

//     });
//     socket.on(`initialPositions:${userID}`, (data) => {
//       console.log("Recienving position", data[0].netPositions);
//       setPositions(data[0].netPositions);
//     });
//     socket.on(`initialHoldings:${userID}`, (data) => {
//       console.log("Holdings are:", data[0].holdings);
//       setHoldings(data[0].holdings);
//     });
//     socket.on(`initialFunds:${userID}`, (data) => {
//       console.log("Funds are:", data[0]);
//       setFunds(data[0]);
//       setInvestedAmount(data[0].investedAmount)
//     });

//     // --- New: Listen for live updates ---
//     socket.on(`newOrder:${userID}`, (newOrder) => {
//       setOrders((prev) => {
//         const exists = prev.find(o => o._id === newOrder._id);
//         if (exists) {
//           return prev.map(o => (o._id === newOrder._id ? newOrder : o));
//         }
//         return [...prev, newOrder];
//       });
//     });

//     socket.on(`newTrade:${userID}`, (newTradeDoc) => {
//       setTrades(newTradeDoc.trades || []);
//     });

//     socket.on(`newPosition:${userID}`, (newPosition) => {
//       setPositions((prev) => {
//         const exists = prev.find(p => p._id === newPosition._id);
//         if (exists) {
//           return prev.map(p => (p._id === newPosition._id ? newPosition : p));
//         }
//         return [...prev, newPosition];
//       });
//     });

//     socket.on(`newHolding:${userID}`, (newHolding) => {
//       setHoldings((prev) => {
//         const exists = prev.find(h => h._id === newHolding._id);
//         if (exists) {
//           return prev.map(h => (h._id === newHolding._id ? newHolding : h));
//         }
//         return [...prev, newHolding];
//       });
//     });

//     socket.on(`newFunds:${userID}`, (newFund) => {
//       setFunds((prev) => {
//         const exists = prev.find(f => f._id === newFund._id);
//         if (exists) {
//           return prev.map(f => (f._id === newFund._id ? newFund : f));
//         }
//         return [...prev, newFund];
//       });
//     });

//     return () => {
//       socket.off("stock-update", handleStockUpdate);
//       socket.disconnect();
//     };
//   }, [currentUser?.id]);


//   const formatSymbol = (symbol) => `${symbol}.NS`;

//   const fetchRealtimePrices = useCallback(async (symbols) => {
//     if (!symbols || !symbols.length) return {};

//     try {
//       const pricePromises = symbols.map(async (symbol) => {
//         try {
//           const response = await paperTradeApi.get(`/api/v1/stocks/price/${symbol}`);
//           return { symbol, price: response.data.price };
//         } catch (error) {
//           return { symbol, price: null };
//         }
//       });

//       const prices = await Promise.all(pricePromises);
//       const priceMap = prices.reduce((acc, { symbol, price }) => {
//         if (price !== null && price !== undefined) {
//           acc[formatSymbol(symbol)] = price;
//         }
//         return acc;
//       }, {});

//       setRealtimePrices((prev) => ({ ...prev, ...priceMap }));
//       return priceMap;
//     } catch (error) {
//       console.error("Error fetching real-time prices:", error);
//       return {};
//     }
//   }, []);

//   const calculateProfits = useCallback((prices, positionsArray, holdingsArray) => {
//     if (!prices || typeof prices !== 'object') return;
//     console.log("Position Array is:", positionsArray);
//     let todaysProfit = 0;
//     let totalProfit = 0;
//     let totalInvested = 0;

//     positionsArray.forEach((position) => {
//       const symbol = position.stockSymbol;
//       if (!symbol) return;

//       const key = formatSymbol(symbol);
//       const currentPrice = prices[key];
//       const finalPrice = currentPrice !== undefined ? currentPrice : position.ltp || 0;
//       const quantity = position.quantity || 0;
//       const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;

//       if (quantity > 0 && finalPrice > 0 && avgBuyPrice > 0) {
//         todaysProfit += (finalPrice - avgBuyPrice) * quantity;
//         totalInvested += avgBuyPrice * quantity;
//       }
//     });

//     holdingsArray.forEach((holding) => {
//       const symbol = holding.stockSymbol;
//       if (!symbol) return;

//       const key = formatSymbol(symbol);
//       const currentPrice = prices[key];
//       const finalPrice = currentPrice !== undefined ? currentPrice : holding.lastTradedPrice || 0;
//       const quantity = holding.quantity || 0;
//       const avgBuyPrice = holding.averagePrice || 0;

//       if (quantity > 0 && finalPrice > 0 && avgBuyPrice > 0) {
//         totalProfit += (finalPrice - avgBuyPrice) * quantity;
//         totalInvested += avgBuyPrice * quantity;
//       }
//     });

//     setProfitSummary({
//       todaysProfit: Number(todaysProfit.toFixed(2)),
//       totalProfit: Number(totalProfit.toFixed(2)),
//     });
//   }, []);

//   useEffect(() => {
//     if (loading && !firstCalculationDone) return;
//     if (Object.keys(realtimePrices).length === 0) return;
//     if (positions.length === 0 && holdings.length === 0) return;

//     const timeout = setTimeout(() => {
//       calculateProfits(realtimePrices, positions, holdings);
//     }, 500);

//     return () => clearTimeout(timeout);
//   }, [realtimePrices, positions, holdings, firstCalculationDone, loading, calculateProfits]);

//   const fetchPaperTradingData = useCallback(async (isFirstLoad = false) => {
//     try {
//       const userId = currentUser?.id;
//       if (!userId) {
//         setError("User not found");
//         return;
//       }

//       if (isFirstLoad) setLoading(true);

//       // Only fetch via REST if socket hasn't provided data yet
//     const shouldFetchViaRest = isFirstLoad && 
//       (positions.length === 0 || 
//        trades.length === 0 || 
//        holdings.length === 0 || 
//        orders.length === 0);

//     if (shouldFetchViaRest) {
//       const [
//         fundsResponse,
//         positionsResponse,
//         tradesResponse,
//         holdingsResponse,
//         ordersResponse,
//       ] = await Promise.all([
//         paperTradeApi.get(`/api/v1/paper-trading/funds/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/positions/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/trades/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/holdings/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/orders/${userId}`),
//       ]);


//       const fundsData = fundsResponse.data.data || {};
//       const positionsArray = positionsResponse?.data.data?.netPositions || [];
//       const tradesArray = tradesResponse?.data?.data[0]?.trades || [];
//       const holdingsArray = holdingsResponse?.data?.data || [];
//       const ordersArray = ordersResponse?.data?.orders[0]?.orders || [];
//       const investedAmountFromDb = fundsResponse?.data?.data?.investedAmount || 0;

//       setFunds(fundsData);
//       setPositions(positionsArray);
//       setTrades(tradesArray);
//       setHoldings(holdingsArray);
//       setOrders(ordersArray);
//       setInvestedAmount(Number(investedAmountFromDb.toFixed(2)));

//       const positionSymbols = positionsArray.map((p) => p.stockSymbol).filter(Boolean);
//       const holdingSymbols = holdingsArray.map((h) => h.stockSymbol).filter(Boolean);
//       const uniqueSymbols = [...new Set([...positionSymbols, ...holdingSymbols])];

//       if (uniqueSymbols.length > 0) {
//         if (isFirstLoad) {
//           const updatedPrices = await fetchRealtimePrices(uniqueSymbols);
//           setTimeout(() => {
//             calculateProfits(updatedPrices, positionsArray, holdingsArray);
//             setFirstCalculationDone(true);
//           }, 100);
//         }
//       } else {
//         setFirstCalculationDone(true);
//       }

//     } catch (error) {
//       console.error("Error fetching paper trading data:", error);
//       setError("Error fetching paper trading data");
//     } finally {
//       if (isFirstLoad) setLoading(false);
//     }
//   }, [currentUser?.id, fetchRealtimePrices, calculateProfits]);

//   useEffect(() => {
//     if (!currentUser?.id) return;

//     const fetchData = async () => {
//       await fetchPaperTradingData(true);
//     };

//     fetchData();

//     const checkAndFetchData = () => {
//       const now = new Date();
//       const day = now.getDay();
//       const hours = now.getHours();
//       const minutes = now.getMinutes();

//       const isWeekday = day >= 1 && day <= 5;
//       const isTradingHours = (hours === 9 && minutes >= 15) || (hours > 9 && hours < 16);

//       if (isWeekday && isTradingHours) {
//         fetchPaperTradingData(false);
//       } else {
//         fetchPaperTradingData(false);
//         clearInterval(dataInterval);
//       }
//     };

//     const dataInterval = setInterval(checkAndFetchData, 15000);

//     return () => clearInterval(dataInterval);
//   }, [currentUser?.id, fetchPaperTradingData]);

//   const contextValue = {
//     funds,
//     positions,
//     trades,
//     holdings,
//     orders,
//     loading,
//     error,
//     realtimePrices,
//     profitSummary,
//     investedAmount,
//     // fetchPaperTradingData,
//   };

//   return (
//     <PaperTradingContext.Provider value={contextValue}>
//       {children}
//     </PaperTradingContext.Provider>
//   );
// }

// export function usePaperTrading() {
//   return useContext(PaperTradingContext);
// }

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { useSelector } from "react-redux";
// import api, { paperTradeApi, paperTradeSocket } from "../config";

// const PaperTradingContext = createContext();

// export function PaperTradingProvider({ children }) {
//   const [funds, setFunds] = useState({});
//   const [positions, setPositions] = useState([]);
//   const [trades, setTrades] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [realtimePrices, setRealtimePrices] = useState({});
//   const [profitSummary, setProfitSummary] = useState({
//     todaysProfit: 0,
//     totalProfit: 0,
//   });
//   const [investedAmount, setInvestedAmount] = useState(0);
//   const [firstCalculationDone, setFirstCalculationDone] = useState(false);

//   const { currentUser } = useSelector((state) => state.user);

//   // ✅ WebSocket handler with enhanced logging
//   useEffect(() => {
//     if (!currentUser?.id) {
//       console.log("❌ WebSocket: No current user, skipping setup");
//       return;
//     }

//     console.log("🔌 WebSocket: Setting up connection for user:", currentUser.id);

//     const handleStockUpdate = (data) => {
//       console.log("📊 WebSocket: Received stock update:", data);
//       console.log("📊 WebSocket: Data type:", typeof data, "Keys:", Object.keys(data || {}));
      
//       if (!data || typeof data !== 'object') {
//         console.warn("⚠️ WebSocket: Invalid data format received");
//         return;
//       }

//       setRealtimePrices((prev) => {
//         const updated = { ...prev, ...data };
//         console.log("📈 WebSocket: Updated prices state:", updated);
//         console.log("📈 WebSocket: Previous prices:", prev);
//         console.log("📈 WebSocket: New data merged:", data);
//         return updated;
//       });
//     };

//     paperTradeSocket.on("stock-update", handleStockUpdate);

//     return () => {
//       console.log("🔌 WebSocket: Cleaning up connection");
//       paperTradeSocket.off("stock-update", handleStockUpdate);
//     };
//   }, [currentUser?.id]);

//   const formatSymbol = (symbol) => {
//     const formatted = `${symbol}.NS`;
//     console.log(`🔄 Symbol formatting: ${symbol} → ${formatted}`);
//     return formatted;
//   };

//   // ✅ Enhanced fetchRealtimePrices with better logging
//   const fetchRealtimePrices = useCallback(async (symbols) => {
//     console.log("🌐 API: Fetching realtime prices for symbols:", symbols);
    
//     if (!symbols || !symbols.length) {
//       console.log("❌ API: No symbols provided for price fetch");
//       return {};
//     }

//     try {
//       const pricePromises = symbols.map(async (symbol) => {
//         console.log(`🌐 API: Fetching price for ${symbol}`);
//         try {
//           const response = await paperTradeApi.get(`/api/v1/stocks/price/${symbol}`);
//           const price = response.data.price;
//           console.log(`✅ API: Got price for ${symbol}: ${price}`);
//           return { symbol, price };
//         } catch (error) {
//           console.error(`❌ API: Failed to fetch price for ${symbol}:`, error.message);
//           return { symbol, price: null };
//         }
//       });

//       const prices = await Promise.all(pricePromises);
//       console.log("🌐 API: All price responses:", prices);

//       const priceMap = prices.reduce((acc, { symbol, price }) => {
//         if (price !== null && price !== undefined) {
//           const formattedSymbol = formatSymbol(symbol);
//           acc[formattedSymbol] = price;
//           console.log(`💰 API: Added price ${formattedSymbol}: ${price}`);
//         } else {
//           console.warn(`⚠️ API: Skipping invalid price for ${symbol}: ${price}`);
//         }
//         return acc;
//       }, {});

//       console.log("💰 API: Final price map:", priceMap);

//       setRealtimePrices((prev) => {
//         const updated = { ...prev, ...priceMap };
//         console.log("📈 API: Updated realtime prices state:", updated);
//         return updated;
//       });

//       return priceMap;
//     } catch (error) {
//       console.error("❌ API: Error fetching real-time prices:", error);
//       return {};
//     }
//   }, []);

//   // ✅ Enhanced calculateProfits with comprehensive validation and logging
//   const calculateProfits = useCallback((prices, positionsArray, holdingsArray) => {
//     console.log("🧮 CALC: Starting profit calculation");
//     console.log("🧮 CALC: Input prices:", prices);
//     console.log("🧮 CALC: Input positions:", positionsArray);
//     console.log("🧮 CALC: Input holdings:", holdingsArray);

//     // Validate inputs
//     if (!prices || typeof prices !== 'object') {
//       console.warn("⚠️ CALC: Invalid prices object, skipping calculation");
//       return;
//     }

//     if (!Array.isArray(positionsArray)) {
//       console.warn("⚠️ CALC: Invalid positions array, using empty array");
//       positionsArray = [];
//     }

//     if (!Array.isArray(holdingsArray)) {
//       console.warn("⚠️ CALC: Invalid holdings array, using empty array");
//       holdingsArray = [];
//     }

//     let todaysProfit = 0;
//     let totalProfit = 0;
//     let totalInvested = 0;

//     console.log("🧮 CALC: Processing positions...");
//     positionsArray.forEach((position, index) => {
//       console.log(`📍 CALC: Position ${index + 1}:`, position);
      
//       const symbol = position.stockSymbol;
//       if (!symbol) {
//         console.warn(`⚠️ CALC: Position ${index + 1} missing stockSymbol`);
//         return;
//       }

//       const key = formatSymbol(symbol);
//       const currentPrice = prices[key];
//       const fallbackPrice = position.ltp;
//       const finalPrice = currentPrice !== undefined ? currentPrice : fallbackPrice || 0;
      
//       console.log(`💰 CALC: Position ${symbol} (${key}):`);
//       console.log(`  - Current price from prices: ${currentPrice}`);
//       console.log(`  - Fallback price (ltp): ${fallbackPrice}`);
//       console.log(`  - Final price used: ${finalPrice}`);

//       const quantity = position.quantity || 0;
//       const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;

//       console.log(`  - Quantity: ${quantity}`);
//       console.log(`  - Avg buy price: ${avgBuyPrice}`);

//       if (quantity > 0 && finalPrice > 0 && avgBuyPrice > 0) {
//         const positionProfit = (finalPrice - avgBuyPrice) * quantity;
//         const invested = avgBuyPrice * quantity;
        
//         console.log(`  - Position profit: (${finalPrice} - ${avgBuyPrice}) × ${quantity} = ${positionProfit}`);
//         console.log(`  - Invested amount: ${avgBuyPrice} × ${quantity} = ${invested}`);
        
//         todaysProfit += positionProfit;
//         totalInvested += invested;
//       } else {
//         console.warn(`⚠️ CALC: Skipping position ${symbol} - invalid values (qty: ${quantity}, price: ${finalPrice}, avg: ${avgBuyPrice})`);
//       }
//     });

//     console.log("🧮 CALC: Processing holdings...");
//     holdingsArray.forEach((holding, index) => {
//       console.log(`🏠 CALC: Holding ${index + 1}:`, holding);
      
//       const symbol = holding.stockSymbol;
//       if (!symbol) {
//         console.warn(`⚠️ CALC: Holding ${index + 1} missing stockSymbol`);
//         return;
//       }

//       const key = formatSymbol(symbol);
//       const currentPrice = prices[key];
//       const fallbackPrice = holding.lastTradedPrice;
//       const finalPrice = currentPrice !== undefined ? currentPrice : fallbackPrice || 0;
      
//       console.log(`💰 CALC: Holding ${symbol} (${key}):`);
//       console.log(`  - Current price from prices: ${currentPrice}`);
//       console.log(`  - Fallback price (lastTradedPrice): ${fallbackPrice}`);
//       console.log(`  - Final price used: ${finalPrice}`);

//       const quantity = holding.quantity || 0;
//       const avgBuyPrice = holding.averagePrice || 0;

//       console.log(`  - Quantity: ${quantity}`);
//       console.log(`  - Avg buy price: ${avgBuyPrice}`);

//       if (quantity > 0 && finalPrice > 0 && avgBuyPrice > 0) {
//         const holdingProfit = (finalPrice - avgBuyPrice) * quantity;
//         const invested = avgBuyPrice * quantity;
        
//         console.log(`  - Holding profit: (${finalPrice} - ${avgBuyPrice}) × ${quantity} = ${holdingProfit}`);
//         console.log(`  - Invested amount: ${avgBuyPrice} × ${quantity} = ${invested}`);
        
//         totalProfit += holdingProfit;
//         totalInvested += invested;
//       } else {
//         console.warn(`⚠️ CALC: Skipping holding ${symbol} - invalid values (qty: ${quantity}, price: ${finalPrice}, avg: ${avgBuyPrice})`);
//       }
//     });

//     const finalTodaysProfit = Number(todaysProfit.toFixed(2));
//     const finalTotalProfit = Number(totalProfit.toFixed(2));

//     console.log("🧮 CALC: Final calculations:");
//     console.log(`  - Today's profit: ${finalTodaysProfit}`);
//     console.log(`  - Total profit: ${finalTotalProfit}`);
//     console.log(`  - Total invested: ${totalInvested}`);

//     setProfitSummary({
//       todaysProfit: finalTodaysProfit,
//       totalProfit: finalTotalProfit,
//     });

//     console.log("✅ CALC: Profit calculation completed and state updated");
//   }, []);

//   // ✅ Enhanced effect for recalculating profits with better timing
//   useEffect(() => {
//     console.log("🔄 EFFECT: Profit recalculation effect triggered");
//     console.log("🔄 EFFECT: firstCalculationDone:", firstCalculationDone);
//     console.log("🔄 EFFECT: loading:", loading);
//     console.log("🔄 EFFECT: realtimePrices keys:", Object.keys(realtimePrices));
//     console.log("🔄 EFFECT: positions length:", positions.length);
//     console.log("🔄 EFFECT: holdings length:", holdings.length);

//     // Skip if we're still in initial loading and haven't done first calculation
//     if (loading && !firstCalculationDone) {
//       console.log("⏳ EFFECT: Skipping - still in initial loading");
//       return;
//     }

//     // Check if we have the necessary data
//     const hasPrices = Object.keys(realtimePrices).length > 0;
//     const hasPositionsOrHoldings = positions.length > 0 || holdings.length > 0;

//     if (!hasPrices) {
//       console.log("❌ EFFECT: No realtime prices available, skipping calculation");
//       return;
//     }

//     if (!hasPositionsOrHoldings) {
//       console.log("❌ EFFECT: No positions or holdings, skipping calculation");
//       return;
//     }

//     console.log("✅ EFFECT: All conditions met, scheduling profit calculation");

//     const timeout = setTimeout(() => {
//       console.log("⏰ EFFECT: Timeout reached, executing profit calculation");
//       calculateProfits(realtimePrices, positions, holdings);
//     }, 500); // Reduced timeout for better responsiveness

//     return () => {
//       console.log("🧹 EFFECT: Cleaning up timeout");
//       clearTimeout(timeout);
//     };
//   }, [realtimePrices, positions, holdings, firstCalculationDone, loading, calculateProfits]);

//   // ✅ Enhanced fetchPaperTradingData with better flow control
//   const fetchPaperTradingData = useCallback(async (isFirstLoad = false) => {
//     console.log("🌐 DATA: Starting data fetch, isFirstLoad:", isFirstLoad);
    
//     try {
//       const userId = currentUser?.id;
//       if (!userId) {
//         console.error("❌ DATA: No user ID found");
//         setError("User not found");
//         return;
//       }

//       console.log("🌐 DATA: Fetching data for user:", userId);

//       if (isFirstLoad) {
//         console.log("🌐 DATA: First load - setting loading state");
//         setLoading(true);
//       }

//       const [
//         fundsResponse,
//         positionsResponse,
//         tradesResponse,
//         holdingsResponse,
//         ordersResponse,
//       ] = await Promise.all([
//         paperTradeApi.get(`/api/v1/paper-trading/funds/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/positions/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/trades/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/holdings/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/orders/${userId}`),
//       ]);

//       console.log("🌐 DATA: API responses received");
//       console.log("🌐 DATA: Funds response:", fundsResponse.data);
//       console.log("🌐 DATA: Positions response:", positionsResponse.data);
//       console.log("🌐 DATA: Holdings response:", holdingsResponse.data);

//       const fundsData = fundsResponse.data.data || {};
//       const positionsArray = positionsResponse?.data.data?.netPositions || [];
//       const tradesArray = tradesResponse?.data?.data[0]?.trades || [];
//       const holdingsArray = holdingsResponse?.data?.data || [];
//       const ordersArray = ordersResponse?.data?.orders[0]?.orders || [];
//       const investedAmountFromDb = fundsResponse?.data?.data?.investedAmount || 0;

//       console.log("🌐 DATA: Parsed data:");
//       console.log("  - Positions:", positionsArray.length, "items");
//       console.log("  - Holdings:", holdingsArray.length, "items");
//       console.log("  - Invested amount:", investedAmountFromDb);

//       // Update state
//       setFunds(fundsData);
//       setPositions(positionsArray);
//       setTrades(tradesArray);
//       setHoldings(holdingsArray);
//       setOrders(ordersArray);
//       setInvestedAmount(Number(investedAmountFromDb.toFixed(2)));

//       // Get unique symbols for price fetching
//       const positionSymbols = positionsArray.map((p) => p.stockSymbol).filter(Boolean);
//       const holdingSymbols = holdingsArray.map((h) => h.stockSymbol).filter(Boolean);
//       const uniqueSymbols = [...new Set([...positionSymbols, ...holdingSymbols])];

//       console.log("📊 DATA: Unique symbols for price fetch:", uniqueSymbols);

//       if (uniqueSymbols.length > 0) {
//         if (isFirstLoad) {
//           console.log("🌐 DATA: First load - fetching fresh prices");
//           const updatedPrices = await fetchRealtimePrices(uniqueSymbols);
//           console.log("🌐 DATA: Fresh prices fetched:", updatedPrices);
          
//           // Wait a bit for state to update, then calculate
//           setTimeout(() => {
//             console.log("🧮 DATA: Calculating profits with fresh prices");
//             calculateProfits(updatedPrices, positionsArray, holdingsArray);
//             setFirstCalculationDone(true);
//           }, 100);
//         } else {
//           console.log("🌐 DATA: Subsequent load - using existing prices");
//           // For subsequent loads, the useEffect will handle recalculation
//         }
//       } else {
//         console.log("❌ DATA: No symbols to fetch prices for");
//         setFirstCalculationDone(true);
//       }

//     } catch (error) {
//       console.error("❌ DATA: Error fetching paper trading data:", error);
//       setError("Error fetching paper trading data");
//     } finally {
//       if (isFirstLoad) {
//         console.log("🌐 DATA: First load complete - clearing loading state");
//         setLoading(false);
//       }
//     }
//   }, [currentUser?.id, fetchRealtimePrices, calculateProfits]);

//   // ✅ Main data fetching effect
//   useEffect(() => {
//     if (!currentUser?.id) {
//       console.log("❌ MAIN: No current user, skipping data fetch");
//       return;
//     }

//     console.log("🚀 MAIN: Starting initial data fetch and setting up intervals");

//     const fetchData = async () => {
//       console.log("🚀 MAIN: Executing initial data fetch");
//       await fetchPaperTradingData(true);
//     };

//     fetchData();

//     const checkAndFetchData = () => {
//       const now = new Date();
//       const day = now.getDay();
//       const hours = now.getHours();
//       const minutes = now.getMinutes();

//       const isWeekday = day >= 1 && day <= 5;
//       const isTradingHours = (hours === 9 && minutes >= 15) || (hours > 9 && hours < 16);

//       console.log("⏰ INTERVAL: Checking trading hours:", {
//         day,
//         hours,
//         minutes,
//         isWeekday,
//         isTradingHours
//       });

//       if (isWeekday && isTradingHours) {
//         console.log("✅ INTERVAL: Trading hours - fetching data");
//         fetchPaperTradingData(false);
//       } else {
//         console.log("❌ INTERVAL: Outside trading hours - fetching once and clearing interval");
//         fetchPaperTradingData(false);
//         clearInterval(dataInterval);
//       }
//     };

//     const dataInterval = setInterval(checkAndFetchData, 15000);

//     return () => {
//       console.log("🧹 MAIN: Cleaning up data interval");
//       clearInterval(dataInterval);
//     };
//   }, [currentUser?.id, fetchPaperTradingData]);

//   // ✅ Context Value
//   const contextValue = {
//     funds,
//     positions,
//     trades,
//     holdings,
//     orders,
//     loading,
//     error,
//     realtimePrices,
//     profitSummary,
//     investedAmount,
//     fetchPaperTradingData,
//   };

//   return (
//     <PaperTradingContext.Provider value={contextValue}>
//       {children}
//     </PaperTradingContext.Provider>
//   );
// }

// export function usePaperTrading() {
//   return useContext(PaperTradingContext);
// }




// ---------------------------------------------------------------------
// ---------------------------------------------------------------------



// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { useSelector } from "react-redux";
// import api, { paperTradeApi, paperTradeSocket } from "../config";

// const PaperTradingContext = createContext();


// export function PaperTradingProvider({ children }) {
//   const [funds, setFunds] = useState({});
//   const [positions, setPositions] = useState([]);
//   const [trades, setTrades] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [realtimePrices, setRealtimePrices] = useState({});
//   const [profitSummary, setProfitSummary] = useState({
//     todaysProfit: 0,
//     totalProfit: 0,
//   });
//   const [investedAmount, setInvestedAmount] = useState(0);

//   const { currentUser } = useSelector((state) => state.user);


//   useEffect(() => {
//   if (!currentUser?.id) return;

//   // ✅ Listener for real-time price updates
//     const handleStockUpdate = (data) => {
//     // console.log("Getting the Update: ", data);
//       const { ticker, price } = data;
      
//     setRealtimePrices((prevPrices) => {
//       const newPrices = {
//         ...prevPrices,
//         [ticker]: price,
//       };
//       // console.log("Updating to:", newPrices); // This will show the correct value
//       return newPrices;
//     });
//     // console.log("Real Time UseEffect:", realtimePrices);
//   };

//   paperTradeSocket.on("stock-update", handleStockUpdate);

//   return () => {
//     paperTradeSocket.off("stock-update", handleStockUpdate);
//   };
// }, [currentUser?.id]);


//   // ✅ Fetch Real-time Prices for Stocks
//   const fetchRealtimePrices = useCallback(async (symbols) => {
//     if (!symbols.length) return {};

//     try {
//       const pricePromises = symbols.map((symbol) =>
//         paperTradeApi
//           .get(`/api/v1/stocks/price/${symbol}`)
//           .then((response) => ({ symbol, price: response.data.price }))
//           .catch(() => ({ symbol, price: null }))
//       );

//       const prices = await Promise.all(pricePromises);
//       const priceMap = prices.reduce((acc, { symbol, price }) => {
//         if (price !== null) acc[symbol] = price;
//         return acc;
//       }, {});

//       setRealtimePrices((prev) => ({ ...prev, ...priceMap }));
//       return priceMap;
//     } catch (error) {
//       console.error("Error fetching real-time prices:", error);
//       return {};
//     }
//   }, []);

//   // ✅ Calculate Profits & Invested Amount
//   const calculateProfits = useCallback((prices, positionsArray, holdingsArray) => {
//     let todaysProfit = 0;
//     let totalProfit = 0;
//     let totalInvested = 0;
//   console.log("Prices are ", prices);
//     // ✅ Iterate through positions (active trades)
//     positionsArray.forEach((position) => {
//       const currentPrice = prices[position.stockSymbol] || position.ltp || 0;
//       // if (!prices[position.stockSymbol])
//        console.log(`Price not found the ${position.stockSymbol} ticker ${prices[position.stockSymbol]} `);
//       const quantity = position.quantity || 0; // Ensure this is the remaining quantity
//       const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;
      
//       // ✅ Ensure calculation only considers remaining quantity
//       if (quantity > 0) {
//         const positionProfit = (currentPrice - avgBuyPrice) * quantity;
//         todaysProfit += positionProfit;
//         totalInvested += avgBuyPrice * quantity; 
//       }
//     });
  
//     // ✅ Iterate through holdings (stocks owned)
//     holdingsArray.forEach((holding) => {
//       const currentPrice = prices[holding.stockSymbol] || holding.lastTradedPrice || 0;
//        console.log(`Price not found the ${holding.stockSymbol} ticker ${prices[holding.stockSymbol]} `);
//       const quantity = holding.quantity || 0;
//       const avgBuyPrice = holding.averagePrice || 0;
  
//       if (quantity > 0) {
//         const holdingProfit = (currentPrice - avgBuyPrice) * quantity;
//         totalProfit += holdingProfit;
//         totalInvested += avgBuyPrice * quantity;
//       }
//     });
  
//     setProfitSummary({
//       todaysProfit: Number(todaysProfit.toFixed(2)),
//       totalProfit: Number(totalProfit.toFixed(2)),
//     });
  
//     // setInvestedAmount(Number(totalInvested.toFixed(2)));
//   }, []);
  

//   // ✅ Fetch Paper Trading Data
//   const fetchPaperTradingData = useCallback(async (isFirstLoad = false) => {
//     try {
//       const userId = currentUser?.id;
//       if (!userId) {
//         setError("User not found");
//         return;
//       }
  
//       if (isFirstLoad) {
//         setLoading(true); // ✅ Only set loading on the first load
//       }
  
//       const [
//         fundsResponse,
//         positionsResponse,
//         tradesResponse,
//         holdingsResponse,
//         ordersResponse,
//       ] = await Promise.all([
//         paperTradeApi.get(`/api/v1/paper-trading/funds/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/positions/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/trades/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/holdings/${userId}`),
//         paperTradeApi.get(`/api/v1/paper-trading/orders/${userId}`),
//       ]);
  
//       const fundsData = fundsResponse.data.data || {};
//       const positionsArray = positionsResponse?.data.data?.netPositions || [];
//       const tradesArray = tradesResponse?.data?.data[0]?.trades || [];
//       const holdingsArray = holdingsResponse?.data?.data || [];
//       const ordersArray = ordersResponse?.data?.orders[0]?.orders || [];
//       const investedAmountFromDb = fundsResponse?.data?.data?.investedAmount || 0;
  
//       setFunds(fundsData);
//       setPositions(positionsArray);
//       setTrades(tradesArray);
//       setHoldings(holdingsArray);
//       setOrders(ordersArray);
//       setInvestedAmount(Number(investedAmountFromDb.toFixed(2)));

  
//       const positionSymbols = positionsArray.map((p) => p.stockSymbol).filter(Boolean);
//       const holdingSymbols = holdingsArray.map((h) => h.stockSymbol).filter(Boolean);
//       const uniqueSymbols = [...new Set([...positionSymbols, ...holdingSymbols])];
  
//       if (uniqueSymbols.length > 0) {
//         // const prices = await fetchRealtimePrices(uniqueSymbols);
//         // calculateProfits(prices, positionsArray, holdingsArray);
//         console.log("Real Time prices:", realtimePrices);
//         calculateProfits( { ...realtimePrices }, positionsArray, holdingsArray);

//       } else {
//         calculateProfits({}, positionsArray, holdingsArray);
//       }
//     } catch (error) {
//       setError("Error fetching paper trading data");
//       console.error("Error fetching data:", error);
//     } finally {
//       if (isFirstLoad) {
//         setLoading(false); // ✅ Stop loading only on first load
//       }
//     }
//   }, [currentUser?.id, fetchRealtimePrices, calculateProfits]);
  
  
  

//   // // ✅ Auto-fetch Data Every 10 Seconds
//   // useEffect(() => {
//   //   if (currentUser?.id) {
//   //     const fetchData = async () => {
//   //       setLoading(true); // ✅ Show loading only for the first fetch
//   //       await fetchPaperTradingData(true); // ✅ Pass true to indicate first load
//   //     };
  
//   //     fetchData();
  
//   //     const dataInterval = setInterval(() => {
//   //       fetchPaperTradingData(false); // ✅ Subsequent fetches won't trigger loading state
//   //     }, 10000);
  
//   //     return () => clearInterval(dataInterval);
//   //   }
//   // }, [currentUser?.id, fetchPaperTradingData]);
//   //  // Removed fetchPaperTradingData from dependencies to avoid unnecessary re-renders

//   useEffect(() => {
//     if (currentUser?.id) {
//       const fetchData = async () => {
//         setLoading(true); // ✅ Show loading only for the first fetch
//         await fetchPaperTradingData(true); // ✅ Pass true to indicate first load
//       };
  
//       fetchData(); // ✅ Initial fetch
  
//       const checkAndFetchData = () => {
//         const now = new Date();
//         const day = now.getDay(); // 0 = Sunday, 6 = Saturday
//         const hours = now.getHours();
//         const minutes = now.getMinutes();
  
//         const isWeekday = day >= 1 && day <= 5; // Monday to Friday
//         const isTradingHours =
//           (hours === 9 && minutes >= 15) || (hours > 9 && hours < 16); // 9:15 AM - 4:00 PM
  
//         if (isWeekday && isTradingHours) {
//           fetchPaperTradingData(false); // ✅ Hit every 15 sec in trading hours
//         } else {
//           fetchPaperTradingData(false); // ✅ Hit once on weekends or after trading hours
//           clearInterval(dataInterval); // ✅ Stop repeated calls
//         }
//       };
  
//       const dataInterval = setInterval(checkAndFetchData, 15000); // ✅ 15 sec interval
  
//       return () => clearInterval(dataInterval);
//     }
//   }, [currentUser?.id, fetchPaperTradingData]);
  

//   // ✅ Context Value
//   const contextValue = {
//     funds,
//     positions,
//     trades,
//     holdings,
//     orders, // ✅ Orders now have the correct structure
//     loading,
//     error,
//     realtimePrices,
//     profitSummary,
//     investedAmount,
//     fetchPaperTradingData,
//   };

//   return (
//     <PaperTradingContext.Provider value={contextValue}>
//       {children}
//     </PaperTradingContext.Provider>
//   );
// }

// export function usePaperTrading() {
//   return useContext(PaperTradingContext);
// }
