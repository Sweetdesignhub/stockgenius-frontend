import React, { useEffect, useState } from "react";
import { fetchHoldings } from "../api";
import Loading from "../../../common/Loading";

const HoldingsTable = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getHoldingsData = async () => {
      try {
        const response = await fetchHoldings();
        if (response.s === "ok") {
          setHoldings(response.holdings);
          setLoading(false); 
        } else {
          setError(response.message); 
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching holdings:", error);
        setError("Failed to fetch holdings. Please authenticate and try again....."); 
        setLoading(false); 
      }
    };

    getHoldingsData();
  }, []);

  if (loading) {
    return <div className="text-center p-4"><Loading/></div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!holdings || holdings.length === 0) {
    return <div className="text-center p-4">There are no holdings</div>;
  }

  // Columns to exclude
  const excludedColumns = ["holdingType"];

  let columnNames = Object.keys(holdings[0]).filter(
    (columnName) => !excludedColumns.includes(columnName)
  );

  // Ensure 'symbol' is the first column
  columnNames = ["symbol", ...columnNames.filter((col) => col !== "symbol")];

  return (
    <div className="h-[55vh] overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columnNames.map((columnName) => (
              <th
                key={columnName}
                className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal text-[#FFFFFF99] text-left"
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
