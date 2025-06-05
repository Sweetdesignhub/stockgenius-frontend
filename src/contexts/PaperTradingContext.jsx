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
