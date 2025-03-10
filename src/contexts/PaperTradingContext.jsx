import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import api from "../config";
import axios from "axios";
import { fetchAllPaperTradingData } from "../paperTradingApi.js";

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
  // console.log(investedAmount);

  const { currentUser } = useSelector((state) => state.user);

  const fetchRealtimePrices = useCallback(async (symbols) => {
    try {
      console.log("Inside Fetch Real Time Prices");
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
      console.log("Working", priceMap);
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
      let totalInvested = 0; // Track the total invested amount

      if (Array.isArray(positionsArray)) {
        positionsArray.forEach((position) => {
          const currentPrice =
            prices[position.stockSymbol] || position.ltp || 0;
          const quantity = position.quantity || 0;
          const avgBuyPrice = position.avgPrice || position.buyAvgPrice || 0;
          const positionProfit = (currentPrice - avgBuyPrice) * quantity;
          todaysProfit += positionProfit;

          // console.log("avg", avgBuyPrice);
          // console.log("qty", quantity);

          // console.log("total",avgBuyPrice * quantity );

          // Calculate the invested amount for the position
          const investedInPosition = avgBuyPrice * quantity;
          totalInvested += investedInPosition;
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

          // Calculate the invested amount for the holding
          const investedInHolding = avgBuyPrice * quantity;
          totalInvested += investedInHolding;
        });
      }

      setProfitSummary({
        todaysProfit: Number(todaysProfit.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
      });

      setInvestedAmount(Number(totalInvested.toFixed(2))); // Set the total invested amount
    },
    []
  );

  const fetchPaperTradingData = useCallback(async () => {
    try {
      // console.log("Inside fetchPaperTradingData");
      const userId = currentUser?.id;
      // const userId = "66fb6e900665edf9447ca673";
      // console.log("user Id: ", userId);
      if (!userId) {
        setError("User not found");
        return;
      }

      const dataPaperTrading = await fetchAllPaperTradingData(userId);
      // console.log("Paper Trading Data from the context: ", dataPaperTrading);

      const data = dataPaperTrading.data;
      // console.log(
      //   "Data fetched dataPaperTrading.data is :",
      //   dataPaperTrading.funds
      // );
      const positionsArray = dataPaperTrading.positions || [];
      const holdingsArray = dataPaperTrading.holdings.data || [];

      setFunds(dataPaperTrading.funds || {});
      setPositions(dataPaperTrading.positions);
      setHoldings(dataPaperTrading.holdings.data);
      setTrades(
        Array.isArray(dataPaperTrading.trades.data[0].trades)
          ? dataPaperTrading.trades.data[0].trades
          : []
      );
      setOrders(
        Array.isArray(dataPaperTrading.orders?.orders)
          ? dataPaperTrading.orders?.orders
          : []
      );

      // console.log("Positions are: ", positions);

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

        // console.log("Unique Symbols: ", uniqueSymbols);
        // console.log("Prices Symbols: ", prices);
        // Calculate profits after updating data
        calculateProfits(prices, positionsArray, holdingsArray);
      } else {
        // Handle cases with no symbols, clear profits
        calculateProfits({}, positionsArray, holdingsArray);
      }
    } catch (error) {
      setError("Error fetching paper trading data");
      console.error("Error fetching data:", error);
    }
  }, [currentUser?.id, fetchRealtimePrices, calculateProfits]);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchData = async () => {
        // setLoading(true);
        await fetchPaperTradingData();
        // setLoading(false);
      };

      fetchData();

      const dataInterval = setInterval(fetchPaperTradingData, 10000);

      return () => {
        clearInterval(dataInterval);
      };
    }
  }, [currentUser?.id, fetchPaperTradingData]);

  // useEffect(() => {
  //   if (funds) {
  //     const invested = positions.reduce((acc, position) => {
  //       const investedInPosition = position.avgPrice * position.quantity;
  //       return acc + investedInPosition;
  //     }, 0);
  //     setInvestedAmount(Number(invested.toFixed(2)));
  //   }
  // }, [funds, positions]);

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
