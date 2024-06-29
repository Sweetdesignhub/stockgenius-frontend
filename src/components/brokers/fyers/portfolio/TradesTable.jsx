import React, { useEffect, useState } from "react";
import { fetchTrades } from "../api";
import Loading from "../../../common/Loading";

const TradesTable = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTradesData = async () => {
      try {
        const response = await fetchTrades();
        if (response.s === "ok") {
          setTrades(response.tradeBook);
          setLoading(false); // Set loading to false once data is fetched
        } else {
          setError(response.message); // Set error message if API request fails
          setLoading(false); // Set loading to false in case of error
        }
      } catch (error) {
        console.error("Error fetching trades:", error);
        setError("Failed to fetch trades. Please authenticate and try again....."); // Set error message for network or other errors
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchTradesData();
  }, []);

  if (loading) {
    return <div className="text-center p-4"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!trades || trades.length === 0) {
    return <div className="text-center p-4">There are no trades</div>;
  }

  // Extract column names dynamically from the first trade object
  const columnNames = Object.keys(trades[0]);

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columnNames.map((columnName) => (
              <th
                key={columnName}
                className="px-4 whitespace-nowrap capitalize py-3 font-[poppins] text-sm font-normal text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index} className="text-center">
              {columnNames.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className="px-4 whitespace-nowrap text-left font-semibold py-4"
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
