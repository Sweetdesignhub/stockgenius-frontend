import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import api, { paperTradeUsaApi } from "../config";

const UsaPaperTradingContext = createContext();

export function UsaPaperTradingProvider({ children }) {
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

  const [userId, setUserId] = useState(null);

  // ✅ Safe retrieval of `currentUser`
  const currentUser = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    if (currentUser?.id) {
      setUserId(currentUser.id); // ✅ Set userId only when Redux is available
    }
  }, [currentUser]);

  // ✅ Fetch Real-time Prices for Stocks
  const fetchRealtimePrices = useCallback(async (symbols) => {
    if (!symbols.length) return {};

    try {
      const pricePromises = symbols.map((symbol) =>
        paperTradeUsaApi
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

  // ✅ Calculate Profits & Invested Amount
  const calculateProfits = useCallback((prices, positionsArray, holdingsArray) => {
    let todaysProfit = 0;
    let totalProfit = 0;
    let totalInvested = 0;

    positionsArray.forEach((position) => {
      const currentPrice = prices[position.stockSymbol] || position.ltp || 0;
      const quantity = position.quantity || 0;
      const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;
      const positionProfit = (currentPrice - avgBuyPrice) * quantity;
      todaysProfit += positionProfit;
      totalInvested += avgBuyPrice * quantity;
    });

    holdingsArray.forEach((holding) => {
      const currentPrice = prices[holding.stockSymbol] || holding.lastTradedPrice || 0;
      const quantity = holding.quantity || 0;
      const avgBuyPrice = holding.averagePrice || 0;
      const holdingProfit = (currentPrice - avgBuyPrice) * quantity;
      totalProfit += holdingProfit;
      totalInvested += avgBuyPrice * quantity;
    });

    setProfitSummary({
      todaysProfit: Number(todaysProfit.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
    });

    setInvestedAmount(Number(totalInvested.toFixed(2)));
  }, []);

  // ✅ Fetch Paper Trading Data
  const fetchPaperTradingData = useCallback(async (isFirstLoad = false) => {
    try {
      if (!userId) {
        setError("User not found");
        return;
      }

      if (isFirstLoad) setLoading(true); // ✅ Only set loading on the first load

      const [
        fundsResponse,
        positionsResponse,
        tradesResponse,
        holdingsResponse,
        ordersResponse,
      ] = await Promise.all([
        paperTradeUsaApi.get(`/api/v1/paper-trading/funds/${userId}`),
        paperTradeUsaApi.get(`/api/v1/paper-trading/positions/${userId}`),
        paperTradeUsaApi.get(`/api/v1/paper-trading/trades/${userId}`),
        paperTradeUsaApi.get(`/api/v1/paper-trading/holdings/${userId}`),
        paperTradeUsaApi.get(`/api/v1/paper-trading/orders/${userId}`),
      ]);

      const fundsData = fundsResponse.data.data || {};
      const positionsArray = positionsResponse?.data.data?.netPositions || [];
      const tradesArray = tradesResponse?.data?.data[0]?.trades || [];
      const holdingsArray = holdingsResponse?.data?.data || [];
      const ordersArray = ordersResponse?.data?.orders[0]?.orders || [];

      setFunds(fundsData);
      setPositions(positionsArray);
      setTrades(tradesArray);
      setHoldings(holdingsArray);
      setOrders(ordersArray);

      const positionSymbols = positionsArray.map((p) => p.stockSymbol).filter(Boolean);
      const holdingSymbols = holdingsArray.map((h) => h.stockSymbol).filter(Boolean);
      const uniqueSymbols = [...new Set([...positionSymbols, ...holdingSymbols])];

      if (uniqueSymbols.length > 0) {
        const prices = await fetchRealtimePrices(uniqueSymbols);
        calculateProfits(prices, positionsArray, holdingsArray);
      } else {
        calculateProfits({}, positionsArray, holdingsArray);
      }
    } catch (error) {
      setError("Error fetching paper trading data");
      console.error("Error fetching data:", error);
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  }, [userId, fetchRealtimePrices, calculateProfits]);

  // ✅ Auto-fetch Data Every 10 Seconds
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setLoading(true);
        await fetchPaperTradingData(true);
      };

      fetchData();

      const dataInterval = setInterval(() => {
        fetchPaperTradingData(false);
      }, 10000);

      return () => clearInterval(dataInterval);
    }
  }, [userId, fetchPaperTradingData]);

  // ✅ Context Value
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
    <UsaPaperTradingContext.Provider value={contextValue}>
      {children}
    </UsaPaperTradingContext.Provider>
  );
}

export function useUsaPaperTrading() {
  return useContext(UsaPaperTradingContext);
}
