import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";

const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  // Fetching holdings data from the context
  const { holdings = { holdings: [] }, loading } = usePaperTrading();
  const holdingsData = holdings.holdings || [];

  // Dynamically set the column names based on the holdings data
  useEffect(() => {
    if (holdingsData.length > 0) {
      const excludedColumns = []; // List any excluded columns if necessary
      const allColumnNames = Object.keys(holdingsData[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, []);

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
    return (
      <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
    );
  }

  return (
    <div className="h-[55vh] overflow-auto"  style={{
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
      }}>
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
          {holdingsData.map((holding, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""}`}
                >
                  {/* Handling empty or zero values */}
                  {holding[columnName] !== undefined && holding[columnName] !== null ? holding[columnName] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsPT;
