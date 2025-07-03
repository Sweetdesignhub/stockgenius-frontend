import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import api, { PAPER_TRADE_URL, paperTradeApi } from "../config";
import io from "socket.io-client";

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
  const [stocks, setStocks] = useState([]);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const fallbackIntervalRef = useRef(null);
  const socketRef = useRef(null); // Optional: To track socket instance globally

  const { currentUser } = useSelector((state) => state.user);
  const region = useSelector((state) => state?.region) || "india";

  // ✅ Fetch Real-time Prices for Stocks
  const fetchRealtimePrices = useCallback(async (symbols) => {
    if (!symbols.length) return {};

    try {
      const pricePromises = symbols.map((symbol) =>
        paperTradeApi
          .get(`/api/v1/stocks/price/${symbol}`)
          .then((response) => ({ symbol, price: response.data.price }))
          .catch(() => ({ symbol, price: null }))
      );

      const prices = await Promise.all(pricePromises);
      const priceMap = prices.reduce((acc, { symbol, price }) => {
        if (price !== null) acc[symbol] = price;
        return acc;
      }, {});

      setRealtimePrices((prev) => ({ ...prev, ...priceMap }));
      return priceMap;
    } catch (error) {
      console.error("Error fetching real-time prices:", error);
      return {};
    }
  }, []);

  useEffect(() => {
    if (region !== "india") return;

    const dataSourceURL = PAPER_TRADE_URL;
    const socket = io(dataSourceURL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000, // Add connection timeout
    });

    socketRef.current = socket;

    const emitAddress = `stockData-${region}`;

    const startFallback = () => {
      if (fallbackIntervalRef.current) return; // ✅ already running

      console.warn("🕔 Starting fallback API polling every 5s...");
      fallbackIntervalRef.current = setInterval(async () => {
        const symbols = [
          ...new Set([
            ...positions.map((p) => p.stockSymbol),
            ...holdings.map((h) => h.stockSymbol),
          ]),
        ].filter(Boolean);

        if (symbols.length > 0) {
          await fetchRealtimePrices(symbols);
        }
      }, 10000);
    };

    const stopFallback = () => {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
        console.info("✅ Fallback polling stopped");
      }
    };

    const onStockData = (data) => {
      setIsSocketConnected(true);
      stopFallback(); // ✅ socket working, stop fallback

      setStocks(data);
      const pricesObject = data.reduce((acc, { ticker, price }) => {
        if (ticker && price != null) acc[ticker] = price;
        return acc;
      }, {});
      setRealtimePrices(pricesObject);
    };

    socket.on(emitAddress, onStockData);

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsSocketConnected(true);
      stopFallback();
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
      setIsSocketConnected(false);
      startFallback();
    });

    // ✅ Handle successful reconnection
    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setIsSocketConnected(true);
      stopFallback();
    });
    // ✅ Handle reconnection failures
    socket.on("reconnect_failed", () => {
      console.error("❌ Socket reconnection failed permanently");
      setIsSocketConnected(false);
      startFallback();
    });

    socket.on("connect_error", (err) => {
      console.error("🚫 Socket connection error:", err);
      setIsSocketConnected(false);
      startFallback();
    });

    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.disconnect();
      stopFallback();
      socketRef.current = null;
    };
  }, [region]); // , positions, holdings, fetchRealtimePrices

  // ✅ Calculate Profits & Invested Amount

  const calculateProfits = useCallback(
    (prices, positionsArray, holdingsArray) => {
      let todaysProfit = 0;
      let totalProfit = 0;
      let totalInvested = 0;

      // ✅ Iterate through positions (active trades)
      positionsArray.forEach((position) => {
        const currentPrice = prices[position.stockSymbol] || position.ltp || 0;
        const quantity = position.quantity || 0; // Ensure this is the remaining quantity
        const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;

        // ✅ Ensure calculation only considers remaining quantity
        if (quantity > 0) {
          const positionProfit = (currentPrice - avgBuyPrice) * quantity;
          todaysProfit += positionProfit;
          totalInvested += avgBuyPrice * quantity;
        }
      });

      // ✅ Iterate through holdings (stocks owned)
      holdingsArray.forEach((holding) => {
        const currentPrice =
          prices[holding.stockSymbol] || holding.lastTradedPrice || 0;
        const quantity = holding.quantity || 0;
        const avgBuyPrice = holding.averagePrice || 0;

        if (quantity > 0) {
          const holdingProfit = (currentPrice - avgBuyPrice) * quantity;
          totalProfit += holdingProfit;
          totalInvested += avgBuyPrice * quantity;
        }
      });

      setProfitSummary({
        todaysProfit: Number(todaysProfit.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
      });

      // setInvestedAmount(Number(totalInvested.toFixed(2)));
    },
    []
  );

  // ✅ Fetch Paper Trading Data
  const fetchPaperTradingData = useCallback(
    async (isFirstLoad = false) => {
      if (region !== "india") return; // ✅ Skip API calls if not India
      try {
        const userId = currentUser?.id;
        if (!userId) {
          setError("User not found");
          return;
        }

        if (isFirstLoad) {
          setLoading(true); // ✅ Only set loading on the first load
        }

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

        const fundsData = fundsResponse.data.data || {};
        const positionsArray = positionsResponse?.data.data?.netPositions || [];
        const tradesArray = tradesResponse?.data?.data[0]?.trades || [];
        const holdingsArray = holdingsResponse?.data?.data || [];
        const ordersArray = ordersResponse?.data?.orders[0]?.orders || [];
        const investedAmountFromDb =
          fundsResponse?.data?.data?.investedAmount || 0;

        setFunds(fundsData);
        setPositions(positionsArray);
        setTrades(tradesArray);
        setHoldings(holdingsArray);
        setOrders(ordersArray);
        setInvestedAmount(Number(investedAmountFromDb.toFixed(2)));

        const positionSymbols = positionsArray
          .map((p) => p.stockSymbol)
          .filter(Boolean);
        const holdingSymbols = holdingsArray
          .map((h) => h.stockSymbol)
          .filter(Boolean);
        const uniqueSymbols = [
          ...new Set([...positionSymbols, ...holdingSymbols]),
        ];

        if (uniqueSymbols.length > 0 && isFirstLoad) {
          const prices = await fetchRealtimePrices(uniqueSymbols);
          calculateProfits(prices, positionsArray, holdingsArray);
        }
        // else {
        //   calculateProfits({}, positionsArray, holdingsArray);
        // }
      } catch (error) {
        setError("Error fetching paper trading data");
        console.error("Error fetching data:", error);
      } finally {
        if (isFirstLoad) {
          setLoading(false); // ✅ Stop loading only on first load
        }
      }
    },
    [currentUser?.id, calculateProfits, region] // fetchRealTimePrices
  );

  // // ✅ Auto-fetch Data Every 10 Seconds
  // useEffect(() => {
  //   if (currentUser?.id) {
  //     const fetchData = async () => {
  //       setLoading(true); // ✅ Show loading only for the first fetch
  //       await fetchPaperTradingData(true); // ✅ Pass true to indicate first load
  //     };

  //     fetchData();

  //     const dataInterval = setInterval(() => {
  //       fetchPaperTradingData(false); // ✅ Subsequent fetches won't trigger loading state
  //     }, 10000);

  //     return () => clearInterval(dataInterval);
  //   }
  // }, [currentUser?.id, fetchPaperTradingData]);
  //  // Removed fetchPaperTradingData from dependencies to avoid unnecessary re-renders

  useEffect(() => {
    if (currentUser?.id && region === "india") {
      const fetchData = async () => {
        setLoading(true); // ✅ Show loading only for the first fetch
        await fetchPaperTradingData(true); // ✅ Pass true to indicate first load
      };

      fetchData(); // ✅ Initial fetch
      let dataInterval;
      const checkAndFetchData = () => {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        const hours = now.getHours();
        const minutes = now.getMinutes();

        const isWeekday = day >= 1 && day <= 5; // Monday to Friday
        const isTradingHours =
          (hours === 9 && minutes >= 15) || (hours > 9 && hours < 16); // 9:15 AM - 4:00 PM

        if (isWeekday && isTradingHours) {
          fetchPaperTradingData(false); // ✅ Hit every 15 sec in trading hours
        } else {
          fetchPaperTradingData(false); // ✅ Hit once on weekends or after trading hours
          clearInterval(dataInterval); // ✅ Stop repeated calls
        }
      };

      dataInterval = setInterval(checkAndFetchData, 15000);

      return () => clearInterval(dataInterval);
    }
  }, [currentUser?.id, region, fetchPaperTradingData]);

  useEffect(() => {
    if (positions.length || holdings.length) {
      calculateProfits(realtimePrices, positions, holdings);
    }
  }, [realtimePrices, positions, holdings]);

  // ✅ Context Value
  const contextValue = {
    funds,
    positions,
    trades,
    holdings,
    orders, // ✅ Orders now have the correct structure
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
