// import React, { useEffect, useState } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// import { formatDate } from "../../../utils/formatDate";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";

// const TradesPT = ({ selectedColumns, setColumnNames }) => {
//   const [error, setError] = useState(null);

//   const { trades = [], loading } = usePaperTrading();
//   const tradesData = trades || [];
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (tradesData.length > 0) {
//       const excludedColumns = ["fees", "tags", "createdAt", "updatedAt", "_id"];
//       const allColumnNames = Object.keys(tradesData[0] || {}).filter(
//         (columnName) => !excludedColumns.includes(columnName)
//       );

//       setColumnNames(allColumnNames);
//     } else {
//       setColumnNames([]);
//     }
//   }, [tradesData, setColumnNames]);

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

//   if (!tradesData || tradesData.length === 0) {
//     return (
//       <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
//     );
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
//                 {columnName}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {tradesData.map((trade, index) => (
//             <tr key={index}>
//               {selectedColumns.map((columnName) => (
//                 <td
//                   key={`${columnName}-${index}`}
//                   className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${
//                     columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
//                   }`}
//                 >
//                  {["tradeDateTime", "createdAt", "updatedAt"].includes(columnName)
//     ? formatDate(trade[columnName])
//     : columnName === "tradeValue"
//     ? parseFloat(trade[columnName]).toFixed(2)
//     : trade[columnName] || ""}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TradesPT;

import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { useUsaPaperTrading } from "../../../contexts/UsaPaperTradingContext.jsx";
import { formatDate } from "../../../utils/formatDate";
import { useTheme } from "../../../contexts/ThemeContext.jsx";


const TradesPT = ({ selectedColumns, setColumnNames }) => {
  const [error, setError] = useState(null);
  const region = useSelector((state) => state.region); // Get selected region

  // ✅ Dynamically select the correct trading context
  const { trades = [], loading } =
    region === "usa" ? useUsaPaperTrading() : usePaperTrading();

  const tradesData = [...(trades || [])].sort((a, b) => {
    const dateA = new Date(a.tradeDateTime);
    const dateB = new Date(b.tradeDateTime);
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
    () => Math.ceil(tradesData.length / pageSize),
    [tradesData.length, pageSize]
  );

  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return tradesData.slice(start, start + pageSize);
  }, [tradesData, currentPage]);

  useEffect(() => {
    const dataSample = trades[0]; // or trades?.[0] || dummyTrades?.[0]
    // if (tradesData.length > 0) {
    if (dataSample) {
      const excludedColumns = ["fees", "tags", "createdAt", "updatedAt", "_id"];
      const allColumnNames = Object.keys(dataSample || {}).filter(
        (columnName) => !excludedColumns.includes(columnName)
      );

      setColumnNames(allColumnNames);
    } else {
      setColumnNames([]);
    }
  }, [trades, setColumnNames]);

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
      <NotAvailable
        dynamicText={"The <strong>best</strong> time to start is now!"}
      />
    );
  }

  const columnWidths = {
    stockSymbol: "150px",
    orderType: "120px",
    price: "120px",
    productType: "120px",
    quantity: "100px",
    side: "100px",
    tradeDateTime: "240px",
    tradeNumber: "200px",
    tradeValue: "120px",
  };
  // console.log("Columns:", selectedColumns);
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
                    className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
                  >
                    {columnName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade, index) => (
                <tr key={index}>
                  {selectedColumns.map((columnName) => (
                    <td
                      key={`${columnName}-${index}`}
                      className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap text-left font-semibold ${
                        columnName === "stockSymbol" ? "text-[#6FD4FF]" : ""
                      }`}
                    >
                      {["tradeDateTime", "createdAt", "updatedAt"].includes(
                        columnName
                      )
                        ? formatDate(trade[columnName], region)
                        : columnName === "tradeValue"
                        ? parseFloat(trade[columnName]).toFixed(2)
                        : trade[columnName] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-wrap justify-center text-gray-200 gap-4 mt-4 items-center">
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
            className="w-20 mx-2 text-center border rounded px-1 py-0.5"
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

export default TradesPT;
