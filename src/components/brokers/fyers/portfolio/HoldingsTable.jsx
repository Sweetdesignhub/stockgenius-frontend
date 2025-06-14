import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
//import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
//import { useSelector } from "react-redux";
import { useData } from "../../../../contexts/FyersDataContext.jsx";

const HoldingsTable = ({ selectedColumns, setColumnNames }) => {
  // const [holdings, setHoldings] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //  const { currentUser } = useSelector((state) => state.user);

  // const getHoldingsData = async () => {
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
  //       `/api/v1/fyers/holdingsByUserId/${currentUser?.id}`,
  //       { headers }
  //     );
  //     // console.log(response.data.holdings);

  //     if (response.data && Array.isArray(response.data.holdings)) {
  //       const holdingsData = response.data.holdings;
  //       setHoldings(holdingsData);
  //       setCount(holdingsData.length);

  //       if (holdingsData.length > 0) {
  //         const excludedColumns = ["message", "pan"];
  //         const allColumnNames = Object.keys(holdingsData[0]).filter(
  //           (columnName) => !excludedColumns.includes(columnName)
  //         );
  //         setColumnNames(allColumnNames);
  //       }
  //     } else {
  //       throw new Error("Invalid holdings data received");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching holdings:", error);
  //     setError(
  //       error.message ||
  //       "Failed to fetch holdings. Please authenticate and try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getHoldingsData();
  //   const interval = setInterval(getHoldingsData, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const { holdings = { holdings: [] }, loading } = useData();
  const holdingsData = holdings.holdings || [];

  useEffect(() => {
    if (holdingsData.length > 0) {
      const excludedColumns = [];
      const allColumnNames = Object.keys(holdingsData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [holdingsData, setColumnNames]);

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

  if (!holdingsData || holdingsData.length === 0) {
    // return <div className="text-center p-4">There are no holdings</div>;
    return (
      <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
    );
  }

  // const excludedColumns = ["holdingType"];
  // let columnNames = Object.keys(holdings[0] || {}).filter(
  //   (columnName) => !excludedColumns.includes(columnName)
  // );

  // columnNames = ["symbol", ...columnNames.filter((col) => col !== "symbol")];

  return (    <div className="relative h-[50vh] overflow-auto pt-5 pl-5 scrollbar-hide rounded-xl dark:glow 
      
      shadow-[0px_15px_34px_0px_rgba(0,0,0,0.12)] 
      dark:shadow-[0px_10px_30px_0px_rgba(73,123,255,0.7)_inset,0px_10px_40px_0px_rgba(63,74,175,0.5)]
      border border-transparent
      dark:backdrop-blur-[20px]
      ">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {selectedColumns.map((columnName) => (
              <th
                key={columnName}
                className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm font-[poppins] font-normal dark:text-[#FFFFFF99] text-left capitalize whitespace-nowrap overflow-hidden"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdingsData.map((holding, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (                <td
                  key={`${columnName}-${index}`}
                  className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap overflow-hidden font-semibold ${
                    columnName === "symbol" ? "text-[#6FD4FF]" : ""
                  } ${
                    columnName === "pl" 
                      ? Number(holding[columnName]) < 0 
                        ? "text-[rgba(252,69,69,1)]" 
                        : Number(holding[columnName]) > 0 
                          ? "text-[rgba(126,243,107,1)]" 
                          : ""
                      : ""
                  }`}
                >
                  {columnName === "pl" || columnName === "marketVal"
                    ? Number(holding[columnName]).toFixed(2)
                    : holding[columnName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
