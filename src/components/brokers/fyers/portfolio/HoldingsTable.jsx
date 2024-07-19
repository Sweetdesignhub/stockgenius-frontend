import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import api from "../../../../config.js";

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getHoldingsData = async () => {
      console.log('entered holdings');
      try {
        const fyersAccessToken = localStorage.getItem("fyers_access_token");
        if (!fyersAccessToken) {
          setError("No authorization token found. Please authenticate and try again.");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${fyersAccessToken}` };
        const response = await api.get("/api/v1/fyers/fetchHoldings", { headers });
        console.log('response : ',response);
        if (response.data.s === "ok") {
          setHoldings(response.data.holdings);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching holdings:", error);
        setError("Failed to fetch holdings. Please authenticate and try again.");
      } finally {
        setLoading(false);
      }
    };

    getHoldingsData();
  }, []);

  if (loading) {
    return <div className="flex h-40 items-center justify-center p-4"><Loading/></div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!holdings || holdings.length === 0) {
    return <div className="text-center p-4">There are no holdings</div>;
  }

  const excludedColumns = ["holdingType"];
  let columnNames = Object.keys(holdings[0]).filter(
    (columnName) => !excludedColumns.includes(columnName)
  );

  columnNames = ["symbol", ...columnNames.filter((col) => col !== "symbol")];

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columnNames.map((columnName) => (
              <th
                key={columnName}
                className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index}>
              {columnNames.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "symbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {holding[columnName]}
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
