import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../config";

const FyersDataContext = createContext();

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [funds, setFunds] = useState([]);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.user);

  const fetchData = async () => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");

      if (currentUser && fyersAccessToken) {
        const headers = { Authorization: `Bearer ${fyersAccessToken}` };
        const response = await api.get(
          `/api/v1/fyers/fetchAllFyersUserDetails/${currentUser.id}`,
          { headers }
        );
        const data = response.data[0];

        setProfile(data.profile);
        setFunds(data.funds || {});
        setHoldings(data.holdings || []);
        setPositions(data.positions || {});
        setTrades(data.trades || []);
        setOrders(data.orders || []);
      }
      // const headers = { Authorization: `Bearer ${fyersAccessToken}` };
      //     const response = await api.get(
      //       `/api/v1/fyers/fetchAllFyersUserDetails/${currentUser.id}`,
      //       { headers }
      //     );
      //     const data = response.data[0];

      //     setProfile(data.profile);
      //     setFunds(data.funds || {});
      //     setHoldings(data.holdings || []);
      //     setPositions(data.positions || {});
      //     setTrades(data.trades || []);
      //     setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optional: Notify the user of the error
    }
  };


  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData();
      setLoading(false);
    };

    fetchAllData();

    const dataInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <FyersDataContext.Provider
      value={{ profile, holdings, funds, positions, trades, orders, loading }}
    >
      {children}
    </FyersDataContext.Provider>
  );
}

export function useData() {
  return useContext(FyersDataContext);
}
