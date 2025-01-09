import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { formatDate } from "../../../utils/formatDate";
import { useTheme } from "../../../contexts/ThemeContext.jsx";

const TradesPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  const { trades = [], loading } = usePaperTrading();
  const tradesData = trades || [];
  const { theme } = useTheme();

  useEffect(() => {
    if (tradesData.length > 0) {
      const excludedColumns = ["fees", "tags"];
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
          {tradesData.map((trade, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {["tradeDateTime", "createdAt", "updatedAt"].includes(
                    columnName
                  )
                    ? formatDate(trade[columnName])
                    : trade[columnName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradesPT;
