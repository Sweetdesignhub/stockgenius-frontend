// import React, { useEffect, useState } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// import { formatDate } from "../../../utils/formatDate.js";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";

// const OrdersPT = ({ selectedColumns, setColumnNames }) => {
//   const [error, setError] = useState(null);
//   const { orders = [], loading } = usePaperTrading();
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (orders.length > 0) {
//       const excludedColumns = ["disclosedQuantity","filledQuantity","autoTrade", "createdAt", "updatedAt", "_id"];
//       let allColumnNames = Object.keys(orders[0] || {}).filter(
//         (columnName) => !excludedColumns.includes(columnName)
//       );

//       // Ensure "autoTrade" is the 2nd column
//       // allColumnNames = ["stockSymbol", "autoTrade", ...allColumnNames.filter(col => col !== "autoTrade")];
//       allColumnNames = ["stockSymbol", ...allColumnNames];

//       setColumnNames(allColumnNames);
//     } else {
//       setColumnNames([]);
//     }
//   }, [orders, setColumnNames]);

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

//   if (!orders || orders.length === 0) {
//     return <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />;
//   }

//   return (
//     <div
//       className="h-[55vh] overflow-auto"
//       style={{
//         background: theme === "light" ? "#ffffff" : "#402788",
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
//                 {columnName === "orderTime" ? "Order Time (IST)" : columnName}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order, index) => (
//             <tr key={index}>
//               {selectedColumns.map((columnName) => (
//                 <td
//                   key={`${columnName}-${index}`}
//                   className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
//                     columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
//                   }`}
//                 >
//                   {columnName === "orderTime"
//                     ? formatDate(order[columnName]) // Date & time in IST
//                     : columnName === "autoTrade"
//                     ? order[columnName] ? "Yes" : "No" // Display Yes/No for autoTrade
//                     : order[columnName] || "-"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrdersPT;


import React, { useEffect, useState } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { formatDate } from "../../../utils/formatDate.js";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { useUsaPaperTrading } from "../../../contexts/UsaPaperTradingContext.jsx";

const OrdersPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);

  // ✅ Get region from Redux store
  const region = useSelector((state) => state.region);

  // ✅ Use appropriate context based on region
  const tradingContext = region === "usa" ? useUsaPaperTrading() : usePaperTrading();

  const { orders = [], loading } = tradingContext;
  const { theme } = useTheme();

  useEffect(() => {
    if (orders.length > 0) {
      const excludedColumns = ["disclosedQuantity", "filledQuantity","limitPrice", "autoTrade", "createdAt", "updatedAt", "_id"];
      let allColumnNames = Object.keys(orders[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      // Ensure "stockSymbol" is the first column
      allColumnNames = ["stockSymbol", ...allColumnNames];

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [orders, setColumnNames]);

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

  if (!orders || orders.length === 0) {
    return <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />;
  }

  return (
    <div
      className="h-[55vh] overflow-auto"
      style={{
        background: theme === "light" ? "#ffffff" : "#402788",
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
                {columnName === "orderTime" ? "Order Time (IST)" : columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              {selectedColumns.map((columnName) => (
                <td
                  key={`${columnName}-${index}`}
                  className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
                    columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                  }`}
                >
                  {columnName === "orderTime"
                    ? formatDate(order[columnName], region) // Date & time format
                    : columnName === "autoTrade"
                    ? order[columnName] ? "Yes" : "No" // Display Yes/No for autoTrade
                    : order[columnName] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPT;
