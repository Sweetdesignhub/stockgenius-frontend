// import React, { useEffect, useState } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";

// const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
//   const [error, setError] = useState(null);

//   // Fetching holdings data from the context
//   const { holdings = { holdings: [] }, loading } = usePaperTrading();
//   const holdingsData = holdings.holdings || [];

//   // Dynamically set the column names based on the holdings data
//   useEffect(() => {
//     if (holdingsData.length > 0) {
//       const excludedColumns = []; // List any excluded columns if necessary
//       const allColumnNames = Object.keys(holdingsData[0] || {}).filter(
//         (columnName) => !excludedColumns.includes(columnName)
//       );

//       setColumnNames(allColumnNames);
//     } else {
//       setColumnNames([]);
//     }
//   }, []);

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

//   if (!holdingsData || holdingsData.length === 0) {
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
//           {holdingsData.map((holding, index) => (
//             <tr key={index}>
//               {selectedColumns.map((columnName) => (
//                 <td
//                   key={`${columnName}-${index}`}
//                   className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
//                     columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
//                   }`}
//                 >
//                   {/* Handling empty or zero values */}
//                   {holding[columnName] !== undefined &&
//                   holding[columnName] !== null
//                     ? holding[columnName]
//                     : "-"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default HoldingsPT;

// // import React, { useEffect, useState } from "react";
// // import Loading from "../../common/Loading";
// // import NotAvailable from "../../common/NotAvailable.jsx";
// // import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// // import axios from "axios";

// // const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
// //   const [error, setError] = useState(null);
// //   const [totalProfit, setTotalProfit] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [prices, setPrices] = useState({});

// //   const { holdings = { holdings: [] }, loading: contextLoading } =
// //     usePaperTrading();
// //   const holdingsData = holdings.holdings || [];

// //   // Fetch stock price for a given symbol
// //   const fetchStockPrice = async (stockSymbol) => {
// //     try {
// //       const response = await axios.get(
// //         `http://localhost:8080/api/v1/stocks/price/${stockSymbol}`
// //       );
// //       if (response.data.success) {
// //         return response.data.price;
// //       }
// //       console.log(response.data.price);

// //       return null;
// //     } catch (error) {
// //       console.error(`Error fetching price for ${stockSymbol}:`, error);
// //       return null;
// //     }
// //   };

// //   // Fetch stock prices for all holdings
// //   const fetchStockPrices = async () => {
// //     const stockSymbols = holdingsData.map((holding) => holding.stockSymbol);
// //     const newPrices = {};

// //     for (let symbol of stockSymbols) {
// //       const price = await fetchStockPrice(symbol);
// //       if (price) {
// //         newPrices[symbol] = price;
// //       }
// //     }
// //     console.log("newPrices", newPrices);

// //     setPrices(newPrices);
// //     setLoading(false);
// //   };

// //   // Calculate total profit without setting state
// //   const calculateTotalProfit = () => {
// //     let profit = 0;

// //     holdingsData.forEach((holding) => {
// //       const { stockSymbol, quantity, averagePrice } = holding;
// //       const currentPrice = prices[stockSymbol];
// //       console.log("currentPrice", currentPrice);
// //       console.log("avgPrice", averagePrice);

// //       if (currentPrice !== undefined) {
// //         profit += (currentPrice - averagePrice) * quantity;
// //       }
// //     });
// //     console.log("profit:", profit);

// //     return profit;
// //   };

// //   // Fetch prices when holdings data changes
// //   useEffect(() => {
// //     if (holdingsData.length > 0) {
// //       setLoading(true);
// //       fetchStockPrices();
// //     } else {
// //       setLoading(false);
// //     }
// //   }, [JSON.stringify(holdingsData)]); // Using JSON.stringify to prevent unnecessary updates

// //   // Update total profit when prices or holdings change
// //   useEffect(() => {
// //     if (Object.keys(prices).length > 0) {
// //       const profit = calculateTotalProfit();
// //       setTotalProfit(profit);
// //     }
// //   }, [JSON.stringify(prices), JSON.stringify(holdingsData)]);

// //   // Set column names based on holdings data
// //   useEffect(() => {
// //     if (holdingsData.length > 0) {
// //       const excludedColumns = [];
// //       const allColumnNames = Object.keys(holdingsData[0] || {}).filter(
// //         (columnName) => !excludedColumns.includes(columnName)
// //       );
// //       setColumnNames(allColumnNames);
// //     } else {
// //       setColumnNames([]);
// //     }
// //   }, [setColumnNames, JSON.stringify(holdingsData)]);

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

// //   if (!holdingsData || holdingsData.length === 0) {
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
// //           {holdingsData.map((holding, index) => (
// //             <tr key={index}>
// //               {selectedColumns.map((columnName) => (
// //                 <td
// //                   key={`${columnName}-${index}`}
// //                   className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
// //                     columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
// //                   }`}
// //                 >
// //                   {/* Handling empty or zero values */}
// //                   {holding[columnName] !== undefined &&
// //                   holding[columnName] !== null
// //                     ? holding[columnName]
// //                     : "-"}
// //                 </td>
// //               ))}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default HoldingsPT;

import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";

const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  // Get holdings directly from context - it's already an array now
  const { holdings, loading } = usePaperTrading();

  // Memoize the column names calculation
  const getColumnNames = useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    const excludedColumns = []; // Add any columns you want to exclude
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
          {holdings.map((holding, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {holding[columnName] !== undefined &&
                  holding[columnName] !== null
                    ? holding[columnName]
                    : "-"}
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
