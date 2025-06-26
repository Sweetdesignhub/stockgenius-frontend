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

import React, { useEffect, useState, useMemo } from "react";
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
  const tradingContext =
    region === "usa" ? useUsaPaperTrading() : usePaperTrading();
  const { orders = [], loading } = tradingContext;

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderTime);
    const dateB = new Date(b.orderTime);
    // First sort by date, then by time if dates are equal
    if (dateB.getTime() !== dateA.getTime()) {
      return dateB.getTime() - dateA.getTime();
    }
    return (
      dateB.getHours() * 3600 +
      dateB.getMinutes() * 60 +
      dateB.getSeconds() -
      (dateA.getHours() * 3600 + dateA.getMinutes() * 60 + dateA.getSeconds())
    );
  });
  const { theme } = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Set initial default

  const totalPages = useMemo(
    () => Math.ceil(sortedOrders.length / pageSize),
    [sortedOrders.length, pageSize]
  );

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOrders.slice(start, start + pageSize);
  }, [sortedOrders, currentPage]);

  useEffect(() => {
    if (orders.length > 0) {
      const excludedColumns = [
        "disclosedQuantity",
        "filledQuantity",
        "limitPrice",
        "autoTrade",
        "createdAt",
        "updatedAt",
        "_id",
      ];
      let allColumnNames = Object.keys(orders[0] || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      // Ensure "stockSymbol" is the first column
      // allColumnNames = ["stockSymbol", ...allColumnNames];

      // Remove stockSymbol if it exists in the array
      allColumnNames = allColumnNames.filter((col) => col !== "stockSymbol");
      // Add stockSymbol at the beginning
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
    return (
      <NotAvailable
        dynamicText={"Unlock potential <strong>profits !</strong>"}
      ></NotAvailable>
    );
  }

  const columnWidths = {
    stockSymbol: "150px",
    action: "100px",
    tradedPrice: "120px",
    orderTime: "240px",
    quantity: "100px",
    orderType: "120px",
    productType: "120px",
    exchange: "100px",
    status: "120px",
    virtualOrderId: "160px",
  };

  const columnTemplate = selectedColumns
    .map((col) => columnWidths[col] || "150px")
    .join(" ");

  return (
    <div>
      <div
        className="relative min-h-[45vh] max-h-[45vh] overflow-auto pt-5 pl-5 scrollbar-hide rounded-xl dark:port 
      shadow-[0px_15px_34px_0px_rgba(0,0,0,0.12)] 
      dark:shadow-[0px_10px_30px_0px_rgba(73,123,255,0.7)_inset,0px_10px_40px_0px_rgba(63,74,175,0.5)]
      border border-transparent
      dark:backdrop-blur-[20px]
      "
      >
        <div className="w-max min-w-full max-h-[400px] overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {selectedColumns.map((columnName) => (
                  <th
                    key={columnName}
                    style={{ width: columnWidths[columnName] || "150px" }}
                    className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap capitalize font-[poppins] font-normal dark:text-[#FFFFFF99] text-left"
                  >
                    {columnName === "orderTime"
                      ? "Order Time (IST)"
                      : columnName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr key={index}>
                  {selectedColumns.map((columnName) => (
                    <td
                      key={`${columnName}-${index}`}
                      className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap text-left font-semibold ${
                        columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                      }`}
                    >
                      {columnName === "orderTime"
                        ? formatDate(order[columnName], region) // Date & time format
                        : columnName === "autoTrade"
                        ? order[columnName]
                          ? "Yes"
                          : "No" // Display Yes/No for autoTrade
                        : order[columnName] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4 items-center">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setCurrentPage(1); // Reset to page 1 when page size changes
            setPageSize(Number(e.target.value));
          }}
          className="border text-black rounded px-2 py-1 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm flex flex-row justify-center items-center text-gray-700">
          <h2>Page </h2>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value) && value >= 1 && value <= totalPages) {
                setCurrentPage(value);
              }
            }}
            className="w-18 mx-2 text-center border rounded px-1 py-0.5"
          />
          of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersPT;
