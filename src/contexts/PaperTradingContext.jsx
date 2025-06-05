// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { useSelector } from "react-redux";
// import api, { paperTradeApi } from "../config";

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

//     // ✅ Iterate through positions (active trades)
//     positionsArray.forEach((position) => {
//       const currentPrice = prices[position.stockSymbol] || position.ltp || 0;
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
//         const prices = await fetchRealtimePrices(uniqueSymbols);
//         calculateProfits(prices, positionsArray, holdingsArray);
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
    isCalculated: false,
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

      setRealtimePrices((prev) => ({ ...prev, ...data }));
    };

    socket.on("stock-update", handleStockUpdate);

    // Initial stock prices from backend
    socket.on(`initialStockPrices:${currentUser.id}`, (stockPriceMap) => {
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
      console.log("New Order Recieved from newTrade: ", newTradeDoc);
      setTrades(newTradeDoc.trades);
    });

    socket.on(`newPosition:${currentUser.id}`, (newPosition) => {
      setPositions(newPosition.netPositions);
    });
    socket.on(`newHolding:${currentUser.id}`, (newHolding) => {
      // console.log("New Holding Recieved from newHolding: ", newHolding);
      setHoldings(newHolding.holdings);
    });

    socket.on(`newFunds:${currentUser.id}`, (newFund) => {
      // console.log("New Funds Recieved from newFund: ", newFund);
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

    // Check for empty or null positionsArray or holdingsArray
    if (!Array.isArray(positionsArray) || positionsArray.length === 0) return;
    if (!Array.isArray(holdingsArray) || holdingsArray.length === 0) return;

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
      isCalculated: true,
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
      console.log("Paper Trading Initial Fetch:", isFirstLoad);

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

        if (
          positionsResponse?.data?.data?.netPositions &&
          holdingsResponse?.data?.data
        ) {
          calculateProfits(
            realtimePrices,
            positions,
            holdings
          );
        } else {
          console.warn("⚠️ Either positions or holdings not fetched. Skipping profit calculation.");
        }
      }



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

