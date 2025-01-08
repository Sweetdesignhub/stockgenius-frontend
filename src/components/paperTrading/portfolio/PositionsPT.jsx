// import React, { useEffect, useState } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";

// const PositionsPT = ({ selectedColumns, setColumnNames }) => {
//   const [error, setError] = useState(null);

//   const { positions = { netPositions: [] }, loading } = usePaperTrading();
//   const positionsData = positions.netPositions || [];

//   useEffect(() => {
//     if (positionsData.length > 0) {
//       const excludedColumns = [
//         "realizedPnL",
//         "unrealizedPnL",
//         "sellQty",
//         "sellAvgPrice",
//       ];
//       const allColumnNames = Object.keys(positionsData[0] || {}).filter(
//         (columnName) => !excludedColumns.includes(columnName)
//       );

//       setColumnNames(allColumnNames);
//     } else {
//       setColumnNames([]);
//     }
//   }, [positionsData, setColumnNames]);

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

//   if (!positionsData || positionsData.length === 0) {
//     return (
//       <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
//     );
//   }

//   return (
//     <div
//       className="h-[55vh] overflow-auto"
//       style={{
//         background:
//           "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
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
//           {positionsData.map((position, index) => (
//             <tr key={index}>
//               {selectedColumns.map((columnName) => (
//                 <td
//                   key={`${columnName}-${index}`}
//                   className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
//                     columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
//                   }`}
//                 >
//                   {position[columnName] || ""}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PositionsPT;

// // import React, { useEffect, useState } from "react";
// // import Loading from "../../common/Loading";
// // import NotAvailable from "../../common/NotAvailable.jsx";
// // import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// // import api from "../../../config.js";

// // const PositionsPT = ({ selectedColumns, setColumnNames }) => {
// //   const [error, setError] = useState(null);
// //   const [totalProfit, setTotalProfit] = useState(0);
// //   const [loading, setLoading] = useState(true); // For overall loading state
// //   const [prices, setPrices] = useState({}); // To store the fetched prices

// //   const { positions = { netPositions: [] }, loading: contextLoading } =
// //     usePaperTrading();
// //   const positionsData = positions.netPositions || [];

// //   // Fetch stock price for a given symbol
// //   const fetchStockPrice = async (stockSymbol) => {
// //     try {
// //       const response = await api.get(`/api/v1/stocks/price/${stockSymbol}`);
// //       if (response.data.success) {
// //         return response.data.price;
// //       }
// //       return null;
// //     } catch (error) {
// //       console.error(`Error fetching price for ${stockSymbol}:`, error);
// //       return null;
// //     }
// //   };

// //   // Fetch stock prices for all positions
// //   const fetchStockPrices = async () => {
// //     const stockSymbols = positionsData.map((position) => position.stockSymbol);

// //     const prices = {};

// //     for (let i = 0; i < stockSymbols.length; i++) {
// //       const stockSymbol = stockSymbols[i];
// //       const price = await fetchStockPrice(stockSymbol);
// //       if (price) {
// //         prices[stockSymbol] = price;
// //       }
// //     }
// //     console.log("prices", prices);

// //     setPrices(prices);
// //     setLoading(false); // Set loading false once all prices are fetched
// //   };

// //   // Calculate total profit
// //   const calculateTotalProfit = () => {
// //     let profit = 0;

// //     positionsData.forEach((position) => {
// //       const { stockSymbol, quantity, avgPrice } = position;
// //       const currentPrice = prices[stockSymbol];

// //       if (currentPrice !== undefined) {
// //         profit += (currentPrice - avgPrice) * quantity;
// //       }
// //     });
// //     console.log("profit:", profit);

// //     setTotalProfit(profit);
// //   };

// //   // Fetch prices and calculate total profit when positions or prices change
// //   useEffect(() => {
// //     if (positionsData.length > 0) {
// //       setLoading(true);
// //       fetchStockPrices();
// //     }
// //   }, [positionsData]);

// //   useEffect(() => {
// //     if (Object.keys(prices).length > 0) {
// //       calculateTotalProfit();
// //     }
// //   }, [prices]);

// //   useEffect(() => {
// //     if (positionsData.length > 0) {
// //       const excludedColumns = [
// //         "realizedPnL",
// //         "unrealizedPnL",
// //         "sellQty",
// //         "sellAvgPrice",
// //       ];
// //       const allColumnNames = Object.keys(positionsData[0] || {}).filter(
// //         (columnName) => !excludedColumns.includes(columnName)
// //       );

// //       setColumnNames(allColumnNames);
// //     } else {
// //       setColumnNames([]);
// //     }
// //   }, [positionsData, setColumnNames]);

// //   if (contextLoading || loading) {
// //     return (
// //       <div className="flex h-40 items-center justify-center p-4">
// //         <Loading />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return <div className="text-center p-4 text-red-500">{error}</div>;
// //   }

// //   if (!positionsData || positionsData.length === 0) {
// //     return (
// //       <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
// //     );
// //   }

// //   return (
// //     <div
// //       className="h-[55vh] overflow-auto"
// //       style={{
// //         background:
// //           "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
// //       }}
// //     >
// //       <table className="w-full border-collapse">
// //         <thead>
// //           <tr>
// //             {selectedColumns.map((columnName) => (
// //               <th
// //                 key={columnName}
// //                 className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
// //               >
// //                 {columnName}
// //               </th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {positionsData.map((position, index) => (
// //             <tr key={index}>
// //               {selectedColumns.map((columnName) => (
// //                 <td
// //                   key={`${columnName}-${index}`}
// //                   className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
// //                     columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
// //                   }`}
// //                 >
// //                   {position[columnName] || ""}
// //                 </td>
// //               ))}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default PositionsPT;

import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";

const PositionsPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  // Get positions directly from context - it's already an array now
  const { positions, loading } = usePaperTrading();

  // Memoize the filtered columns to prevent unnecessary recalculations
  const getColumnNames = useMemo(() => {
    if (!positions || positions.length === 0) return [];

    const excludedColumns = [
      "realizedPnL",
      "unrealizedPnL",
      "sellQty",
      "sellAvgPrice",
    ];

    return Object.keys(positions[0] || {}).filter(
      (columnName) => !excludedColumns.includes(columnName)
    );
  }, [positions]);

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
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
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
          {positions.map((position, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {position[columnName] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsPT;
