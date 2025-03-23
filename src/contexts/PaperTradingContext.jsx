import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import api, { paperTradeApi } from "../config";

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

  const { currentUser } = useSelector((state) => state.user);

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

  // ✅ Calculate Profits & Invested Amount
  const calculateProfits = useCallback((prices, positionsArray, holdingsArray) => {
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
      const currentPrice = prices[holding.stockSymbol] || holding.lastTradedPrice || 0;
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
  }, []);
  

  // ✅ Fetch Paper Trading Data
  const fetchPaperTradingData = useCallback(async (isFirstLoad = false) => {
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
      const investedAmountFromDb = fundsResponse?.data?.data?.investedAmount || 0;
  
      setFunds(fundsData);
      setPositions(positionsArray);
      setTrades(tradesArray);
      setHoldings(holdingsArray);
      setOrders(ordersArray);
      setInvestedAmount(Number(investedAmountFromDb.toFixed(2)));

  
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
      if (isFirstLoad) {
        setLoading(false); // ✅ Stop loading only on first load
      }
    }
  }, [currentUser?.id, fetchRealtimePrices, calculateProfits]);
  
  
  

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
    if (currentUser?.id) {
      const fetchData = async () => {
        setLoading(true); // ✅ Show loading only for the first fetch
        await fetchPaperTradingData(true); // ✅ Pass true to indicate first load
      };
  
      fetchData(); // ✅ Initial fetch
  
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
  
      const dataInterval = setInterval(checkAndFetchData, 15000); // ✅ 15 sec interval
  
      return () => clearInterval(dataInterval);
    }
  }, [currentUser?.id, fetchPaperTradingData]);
  

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
