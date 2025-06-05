/**
 * File: FyersDataContext
 * Description: The FyersDataContext is a context provider that manages the fetching and storing of various Fyers-related data such as user profile, holdings, funds, positions, trades, and orders. This data is fetched from the backend API and provided to child components through React's Context API.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
*/

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import api, { BACKEND_URL } from "../config";

const FyersDataContext = createContext();

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [funds, setFunds] = useState({});
  const [positions, setPositions] = useState({});
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.user);
  const currentUserIdRef = useRef(currentUser?.id);
  const socketRef = useRef(null);

  // Stable reference to fetchData - only recreate when userId actually changes
  const fetchData = useCallback(async ({ initial = false } = {}) => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      const userId = currentUserIdRef.current;

      if (userId && fyersAccessToken) {
        const headers = { Authorization: `Bearer ${fyersAccessToken}` };
        const response = await api.get(
          `/api/v1/fyers/fetchAllFyersUserDetails/${userId}`,
          { headers }
        );

        const data = response.data[0] || {};
        console.log("Data from the initial fetch", data);
        setProfile(data.profile || null);
        setFunds(data.funds || {});
        setHoldings(data.holdings || []);
        
        if (initial) {
          setOrders(Array.isArray(data.orders.orderBook) ? data.orders.orderBook : []);
          setTrades(Array.isArray(data.trades.tradeBook) ? data.trades.tradeBook : []);
          console.log("initial fetch positions are:", data.positions.netPositions);
          setPositions(data.positions.netPositions || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []); // No dependencies - use ref for userId

  // Update ref when currentUser changes
  useEffect(() => {
    currentUserIdRef.current = currentUser?.id;
  }, [currentUser?.id]);

  const updateOrders = useCallback((newOrder) => {
    console.log("WebSocket update:  Order received:", newOrder);
    if (!newOrder || typeof newOrder !== 'object') return;

    setOrders(prev => {
      // Create a Set of existing IDs for faster lookup
      const existingIds = new Set(
        prev.flatMap(order => [
          order.id,
          order.orderTag
        ].filter(Boolean))
      );

      const newId = newOrder.id || newOrder.orderTag;
      if (!newId || existingIds.has(newId)) {
        console.log("Duplicate detected - ignoring");
        return prev;
      }

      console.log("Adding new order");
      return [...prev, newOrder];
    });
  }, []);

  const updateTrades = useCallback((newTrade) => {
    console.log("WebSocket update: Current Position", trades);

    console.log("WebSocket update:  Trade received:", newTrade);
    if (!newTrade || typeof newTrade !== 'object') return;

    setTrades(prev => {
      // Create a Set of existing trade identifiers
      const existingIdentifiers = new Set(
        prev.flatMap(trade => [
          trade.id,
        ].filter(Boolean)) // Remove undefined/null values
      );

      // Check if trade exists using all possible identifiers
      const tradeExists = [
        newTrade.id,
      ].some(id => id && existingIdentifiers.has(id));

      if (tradeExists) {
        console.log("Duplicate trade detected - ignoring");
        return prev;
      }

      console.log("Adding new trade");
      return [...prev, newTrade];
    });
  }, []);
  const updatePositions = useCallback((newPosition) => {
    console.log("WebSocket update: Current Position", positions);
    console.log("WebSocket update: New Position", newPosition);

    // Validate the incoming position
    if (!newPosition || typeof newPosition !== 'object' || Array.isArray(newPosition)) {
      console.warn("Invalid position format received");
      return;
    }

    setPositions(prev => {
      if (!Array.isArray(prev)) return [newPosition];

      const index = prev.findIndex(pos => pos.symbol === newPosition.symbol);

      if (index !== -1) {
        // Update existing position
        const updated = [...prev];
        updated[index] = newPosition;
        return updated;
      } else {
        // Append new position
        return [...prev, newPosition];
      }
    });
  }, []);


  // const updatePositions = useCallback((newPosition) => {
  //   console.log("WebSocket update: Current Position", positions);

  //   console.log("WebSocket update: New Position", newPosition);

  //   // Validate the incoming position
  //   if (!newPosition || typeof newPosition !== 'object' || Array.isArray(newPosition)) {
  //     console.warn("Invalid position format received");
  //     return;
  //   }

  //   setPositions(prev => {
  //     // If previous state is an array (legacy format), convert to object
  //     if (Array.isArray(prev)) {
  //       console.warn("Converting legacy array positions to object format");
  //       const positionMap = {};
  //       prev.forEach(pos => {
  //         const key = pos.symbol || pos.id;
  //         if (key) positionMap[key] = pos;
  //       });
  //       return {
  //         ...positionMap,
  //         [newPosition.symbol]: newPosition
  //       };
  //     }

  //     // Normal case - merge with existing positions object
  //     return {
  //       ...(prev || {}),
  //       [newPosition.symbol]: newPosition
  //     };
  //   });
  // }, []);
  
  // WebSocket management with cleanup
  useEffect(() => {
    let isMounted = true;

    const initWebSocket = () => {
      const userId = currentUserIdRef.current;
      if (!userId) return;

      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      const wsUrl = `${BACKEND_URL.replace(/^http/, "ws")}?userId=${encodeURIComponent(userId)}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ Connected to backend via WebSocket");
      };

      socket.onmessage = (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket update:", data);
          
          fetchData({ initial: false });

          switch (data.type) {
            case `fyers-orders-new-update:${userId}`:
              console.log("Postionss", data.payload);
              updateOrders(data.payload);
              break;
            case `fyers-trades-new-update:${userId}`:
              console.log("Current Trades", trades);
              console.log("Tradess", data.payload);
              updateTrades(data.payload);
              break;
            case `fyers-positions-new-update:${userId}`:
              console.log("Postionss", data.payload);
              updatePositions(data.payload);
              break;
            default:
              console.warn("Unknown WebSocket event type:", data.type);
          }
        } catch (err) {
          console.error("❌ Failed to parse WebSocket message", err);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      socket.onclose = (event) => {
        console.log("🔌 WebSocket connection closed", event.code, event.reason);

        // Attempt to reconnect after a delay if not intentionally closed
        if (isMounted && event.code !== 1000 && currentUserIdRef.current) {
          console.log("🔄 Attempting to reconnect WebSocket in 3 seconds...");
          setTimeout(() => {
            if (isMounted && currentUserIdRef.current) {
              initWebSocket();
            }
          }, 3000);
        }
      };
    };

    const init = async () => {
      if (currentUserIdRef.current) {
        await fetchData({ initial: true });
        if (isMounted) {
          setLoading(false);
          initWebSocket();
        }
      } else {
        setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [currentUser?.id, fetchData, updateOrders, updateTrades, updatePositions]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    // console.log("Refresh function hit");
    return fetchData({ initial: false });
  }, [fetchData]);

  return (
    <FyersDataContext.Provider
      value={{
        profile,
        holdings,
        funds,
        positions,
        trades,
        orders,
        loading: false,
        refreshData // Expose manual refresh
      }}
    >
      {children}
    </FyersDataContext.Provider>
  );
}

export function useData() {
  const context = useContext(FyersDataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
