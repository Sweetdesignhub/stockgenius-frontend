import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
//import api from "../../../../config.js";
import NotAvailable from "../../../common/NotAvailable.jsx";
//import { useSelector } from "react-redux";
import { useData } from "../../../../contexts/FyersDataContext.jsx";

const TradesTable = ({ selectedColumns, setColumnNames }) => {
  //  const [trades, setTrades] = useState([]);
  // console.log("trades", trades);

  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { currentUser } = useSelector((state) => state.user);

  // const getTradesData = async () => {
  //   try {
  //     const fyersAccessToken = localStorage.getItem("fyers_access_token");
  //     if (!fyersAccessToken) {
  //       throw new Error(
  //         "No authorization token found. Please authenticate and try again."
  //       );
  //     }

  //     const headers = { Authorization: `Bearer ${fyersAccessToken}` };
  //     const response = await api.get(
  //       `/api/v1/fyers/tradesByUserId/${currentUser.id}`,
  //       { headers }
  //     );

  //     if (response.statusText === "OK") {
  //       // setTrades(response.data.tradeBook);
  //       const tradesData = response.data.tradeBook;
  //       setTrades(tradesData);

  //       const excludedColumns = [];
  //       const allColumnNames = Object.keys(tradesData[0] || {}).filter(
  //         (columnName) => !excludedColumns.includes(columnName)
  //       );
  //       setColumnNames(allColumnNames);
  //     } else {
  //       throw new Error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching trades:", error);
  //     setError(
  //       error.message ||
  //       "Failed to fetch trades. Please authenticate and try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getTradesData(); // Initial call when component mounts
  //   const interval = setInterval(getTradesData, 5000);
  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // }, []);

  const { trades = { tradeBook: [] }, loading } = useData();
  const tradesData = trades.tradeBook || [];

  useEffect(() => {
    if (tradesData.length > 0) {
      const excludedColumns = [];
      const allColumnNames = Object.keys(tradesData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [tradesData, setColumnNames]);

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

  if (!tradesData || tradesData.length === 0) {
    // return <div className="text-center p-4">There are no trades</div>;
    return (
      <NotAvailable
        dynamicText={"The <strong>best</strong> time to start is now!"}
      />
    );
  }

  // const excludedColumns = [];
  // const columnNames = Object.keys(trades[0]).filter(
  //   (columnName) => !excludedColumns.includes(columnName)
  // );

  return (
       <div className="relative h-[50vh] overflow-auto pt-5 pl-5 scrollbar-hide rounded-xl dark:glow 
      
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
                className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap capitalize font-[poppins] font-normal dark:text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tradesData.map((trade, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap text-left font-semibold ${
                    columnName === "symbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {trade[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesTable;
