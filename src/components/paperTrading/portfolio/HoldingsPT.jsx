import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";

const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  // Get holdings and real-time prices directly from context
  const { holdings, loading, realtimePrices } = usePaperTrading();
  const { theme } = useTheme();

  // Memoize the column names calculation to prevent unnecessary recalculations
  const getColumnNames = useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    const excludedColumns = ["unrealizedPnL"]; // Add any columns you want to exclude
    return Object.keys(holdings[0] || {}).filter(
      (columnName) => !excludedColumns.includes(columnName)
    );
  }, [holdings]);

  // Update column names when they change
  useEffect(() => {
    setColumnNames(getColumnNames);
  }, [getColumnNames, setColumnNames]);

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

  if (!holdings || holdings.length === 0) {
    return (
      <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
    );
  }

  return (
    <div
      className="h-[55vh] overflow-auto"
      style={{
        background:
          theme === "light"
            ? "#ffffff"
            : "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {selectedColumns.map((columnName) => (
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
          {holdings.map((holding, index) => {
            // Get the real-time price for the stock symbol
            const realTimePrice = realtimePrices[holding.stockSymbol];
            const updatedLastTradedPrice =
              realTimePrice || holding.lastTradedPrice; // Use real-time price if available

            return (
              <tr key={index}>
                {selectedColumns.map((columnName) => (
                  <td
                    key={`${columnName}-${index}`}
                    className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                      columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                    }`}
                  >
                    {columnName === "lastTradedPrice"
                      ? updatedLastTradedPrice
                      : holding[columnName] !== undefined &&
                        holding[columnName] !== null
                      ? holding[columnName]
                      : "-"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsPT;
