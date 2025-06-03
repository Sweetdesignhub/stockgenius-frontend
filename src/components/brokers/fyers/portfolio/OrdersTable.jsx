import React, { useEffect, useState, useRef } from "react";
import Loading from "../../../common/Loading";
//import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
//import { useSelector } from "react-redux";
import { useData } from "../../../../contexts/FyersDataContext.jsx";

const OrdersTable = ({ selectedColumns, setColumnNames }) => {
  // const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { currentUser } = useSelector((state) => state.user);


  // console.log("Inside Orders");


  const { orders = [], loading } = useData();
  const ordersData = orders || [];
  const prevColumnNames = useRef([]);

  // const getOrdersData = async () => {
  //   try {
  //     const fyersAccessToken = localStorage.getItem("fyers_access_token");
  //     // const fyersAccessToken ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjI4NjUyMjgsImV4cCI6MTcyMjkwNDIyOCwibmJmIjoxNzIyODY1MjI4LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbXNOWk1GeC0xWEFRaUNYWXVZS096V1hrcnhkV0d1REpUaTVlVWRkZUF5RkRYQTZtTGVENGJQWXRmQmppQVFnaE1RdU8tQlhPQzFMc2J2MFdwR3lDSldWVDY5dE9EMXZLZEFwVWRJZk9KMTdhR0U3VT0iLCJkaXNwbGF5X25hbWUiOiJBU1dJTkkgR0FKSkFMQSIsIm9tcyI6IksxIiwiaHNtX2tleSI6IjU1MmM0M2Y1OGMyMDdlMzQ4YzcxM2Q3Y2JjNmRjOTlhNDE3NDFjMDJjMmIwM2U0NTgzZmE2MjYxIiwiZnlfaWQiOiJZQTE0MjIxIiwiYXBwVHlwZSI6MTAyLCJwb2FfZmxhZyI6Ik4ifQ._V_l2_iIzKHNun5Yn2NJWGBBYV5NNA3eZrclXAYYT7o"
  //     if (!fyersAccessToken) {
  //       throw new Error(
  //         "No authorization token found. Please authenticate and try again."
  //       );
  //     }

  //     const headers = { Authorization: `Bearer ${fyersAccessToken}` };
  //     const response = await api.get(
  //       `/api/v1/fyers/ordersByUserId/${currentUser.id}`,
  //       { headers }
  //     );

  //     if (response.statusText === "OK") {
  //       const ordersData = response.data.orderBook;
  //       setOrders(ordersData);
  //       setCount(ordersData.length);

  //       const excludedColumns = ["message", "pan"];
  //       const allColumnNames = Object.keys(ordersData[0] || {}).filter(
  //         (columnName) => !excludedColumns.includes(columnName)
  //       );

  //       setColumnNames(allColumnNames);
  //     } else {
  //       throw new Error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //     setError(
  //       error.message ||
  //       "Failed to fetch orders. Please authenticate and try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getOrdersData();
  //   const interval = setInterval(getOrdersData, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (ordersData.length > 0) {
      const excludedColumns = ["ch", "chp"];
      const allColumnNames = Object.keys(ordersData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      if (JSON.stringify(allColumnNames) !== JSON.stringify(prevColumnNames.current)) {
        setColumnNames(allColumnNames);
        prevColumnNames.current = allColumnNames;
      }
    } else if (prevColumnNames.current.length > 0) {
      setColumnNames([]);
      prevColumnNames.current = [];
    }
  }, [ordersData, setColumnNames]);

  // useEffect(() => {
  //   if (ordersData.length > 0) {
  //     const excludedColumns = ["ch", "chp"]; // Added ch and chp to excluded columns
  //     const allColumnNames = Object.keys(ordersData[0] || {}).filter(
  //       (columnName) => !excludedColumns.includes(columnName)
  //     );
  //     setColumnNames(allColumnNames);
  //   } else {
  //     setColumnNames([]);
  //   }
  // }, [ordersData, setColumnNames]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!ordersData || ordersData.length === 0) {
    // return <div className="text-center p-4">There are no orders</div>;
    return (
      <NotAvailable
        dynamicText={"Unlock potential <strong>profits!</strong>"}
      />
    );
  }

  // const excludedColumns = ["message", "pan"];
  // const columnNames = Object.keys(orders[0]).filter(
  //   (columnName) => !excludedColumns.includes(columnName)
  // );

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {selectedColumns.map((columnName) => (
              <th
                key={columnName}
                className="px-4 whitespace-nowrap capitalize py-3 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ordersData.map((order, index) => (
            <tr key={index} className="text-center">
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className="px-4 whitespace-nowrap text-left font-semibold py-4"
                >
                  {order[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
