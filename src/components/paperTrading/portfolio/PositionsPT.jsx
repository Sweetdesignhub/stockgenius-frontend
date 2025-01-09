// import React, { useEffect, useState, useMemo } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";

// const PositionsPT = ({ selectedColumns, setColumnNames }) => {
//   const [error, setError] = useState(null);

//   const { positions, loading, realtimePrices } = usePaperTrading();
//   const { theme } = useTheme();

//   // Memoize the filtered columns to prevent unnecessary recalculations
//   const getColumnNames = useMemo(() => {
//     if (!positions || positions.length === 0) return [];

//     const excludedColumns = [
//       "realizedPnL",
//       "unrealizedPnL",
//       "sellQty",
//       "sellAvgPrice",
//     ];

//     return Object.keys(positions[0] || {}).filter(
//       (columnName) => !excludedColumns.includes(columnName)
//     );
//   }, [positions]);

//   // Update column names when they change
//   useEffect(() => {
//     setColumnNames(getColumnNames);
//   }, [getColumnNames, setColumnNames]);

//   if (loading) {
//     return (
//       <div className="flex h-40 items-center justify-center p-4">
//         <Loading />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">{error}</div>;
//   }

//   if (!positions || positions.length === 0) {
//     return (
//       <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
//     );
//   }

//   return (
//     <div
//       className="h-[55vh] overflow-auto"
//       style={{
//         background:
//           theme === "light"
//             ? "#ffffff"
//             : "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         borderRadius: "8px",
//       }}
//     >
//       <table className="w-full border-collapse">
//         <thead>
//           <tr>
//             {selectedColumns.map((columnName) => (
//               <th
//                 key={columnName}
//                 className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
//               >
//                 {columnName}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {positions.map((position, index) => {
//             // Get the real-time price for the stock symbol
//             const realTimePrice = realtimePrices[position.stockSymbol];
//             const updatedLtp = realTimePrice || position.ltp;

//             return (
//               <tr key={index}>
//                 {selectedColumns.map((columnName) => (
//                   <td
//                     key={`${columnName}-${index}`}
//                     className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
//                       columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
//                     }`}
//                   >
//                     {columnName === "ltp"
//                       ? updatedLtp
//                       : position[columnName] || ""}
//                   </td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PositionsPT;

import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { X } from "lucide-react";
import api from "../../../config.js";
import { useSelector } from "react-redux";

const PositionsPT = ({ selectedColumns, setColumnNames }) => {
  const [exitingPosition, setExitingPosition] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { positions, loading, realtimePrices } = usePaperTrading();
  const { theme } = useTheme();

  const getColumnNames = useMemo(() => {
    if (!positions || positions.length === 0) return [];

    const excludedColumns = [
      "realizedPnL",
      "unrealizedPnL",
      "sellQty",
      "sellAvgPrice",
    ];

    return [
      ...Object.keys(positions[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      ),
      "actions",
    ];
  }, [positions]);

  useEffect(() => {
    setColumnNames(getColumnNames);
  }, [getColumnNames, setColumnNames]);

  const handleExitPosition = async (stockSymbol, quantity) => {
    try {
      setExitingPosition(stockSymbol);
      setError(null);

      console.log("Sending request with data:", {
        userId: currentUser.id,
        stockSymbol,
        quantity,
      });

      const response = await api.post("/api/v1/paper-trading/positions/exit", {
        userId: currentUser.id,
        stockSymbol,
        quantity,
      });
    } catch (err) {
      console.error("Error exiting position:", err);
      setError(err.response?.data?.message || "Failed to exit position");
    } finally {
      setExitingPosition(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (!positions || positions.length === 0) {
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}
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
          {positions.map((position, index) => {
            const realTimePrice = realtimePrices[position.stockSymbol];
            const updatedLtp = realTimePrice || position.ltp;

            return (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                {selectedColumns.map((columnName) => {
                  if (columnName === "actions") {
                    return (
                      <td key={`${columnName}-${index}`} className="px-4 py-4">
                        <button
                          onClick={() =>
                            handleExitPosition(
                              position.stockSymbol,
                              position.quantity
                            )
                          }
                          disabled={exitingPosition === position.stockSymbol}
                          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors
                            ${
                              exitingPosition === position.stockSymbol
                                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                        >
                          {exitingPosition === position.stockSymbol ? (
                            <span>Exiting...</span>
                          ) : (
                            <>
                              <X size={16} />
                              <span>Exit</span>
                            </>
                          )}
                        </button>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={`${columnName}-${index}`}
                      className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                        columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                      }`}
                    >
                      {columnName === "ltp"
                        ? updatedLtp
                        : position[columnName] || ""}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsPT;
