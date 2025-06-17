// import React, { useEffect, useState, useMemo } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";
// import { X } from "lucide-react";
// import { useSelector } from "react-redux";
// import PlaceOrderModal from "../PlaceOrderModal.jsx";
// import ConfirmationModal from "../../common/ConfirmationModal.jsx";
// import { isWithinTradingHours } from "../../../utils/helper.js";

// const PositionsPT = ({ selectedColumns, setColumnNames }) => {
//   const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
//   const [selectedPosition, setSelectedPosition] = useState(null);
//   const [error, setError] = useState(null);
//   const [isExiting, setIsExiting] = useState(false);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [confirmationModalMessage, setConfirmationModalMessage] = useState("");
//   const { currentUser } = useSelector((state) => state.user);
//   const { positions, loading, realtimePrices } = usePaperTrading();
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (!loading && isExiting) {
//       setIsExiting(false);
//     }
//   }, [positions, loading]);

//   const getColumnNames = useMemo(() => {
//     if (!positions || positions.length === 0) return [];

//     const excludedColumns = ["realizedPnL", "unrealizedPnL"];

//     const baseColumns = Object.keys(positions[0] || {}).filter(
//       (columnName) => !excludedColumns.includes(columnName)
//     );

//     // Reorder columns according to specified order
//     const orderedColumns = [
//       "stockSymbol",
//       "exchange",
//       "quantity",
//       "avgPrice",
//       "totalInvested",
//       "currentValue",
//       "ltp",
//       "pnl",
//       "pnlPercentage",
//       "side",
//       "buyQty",
//       "buyAvgPrice",
//       "sellQty",
//       "productType",
//       "_id",
//       "actions",
//     ];

//     return orderedColumns;
//   }, [positions]);

//   useEffect(() => {
//     setColumnNames(getColumnNames);
//   }, [getColumnNames, setColumnNames]);

//   const handleExitClick = (position) => {
//     if (!isWithinTradingHours()) {
//       setConfirmationModalMessage(
//         "Orders can only be placed between 9:15 AM and 3:30 PM IST."
//       );
//       setIsConfirmationModalOpen(true);
//       return;
//     }
//     setSelectedPosition({
//       symbol: position.stockSymbol,
//       quantity: position.quantity,
//       price: position.ltp,
//       action: "SELL",
//     });
//     setIsOrderModalOpen(true);
//   };

//   const handleOrderSubmit = (formData) => {
//     setIsExiting(true);
//   };

//   const calculatePnL = (position, currentPrice) => {
//     const pnl = (currentPrice - position.avgPrice) * position.quantity;
//     const pnlPercentage =
//       ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
//     return { pnl, pnlPercentage };
//   };

//   const getBackgroundStyle = () => {
//     return theme === "light" ? "#ffffff" : "#402788";
//   };

//   if (loading) {
//     return (
//       <div className="flex h-40 items-center justify-center p-4">
//         <Loading />
//       </div>
//     );
//   }

//   if (!positions || positions.length === 0) {
//     return (
//       <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
//     );
//   }

//   return (
//     <>
//       <div
//         className="h-[55vh] overflow-auto relative"
//         style={{
//           background: getBackgroundStyle(),
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//         }}
//       >
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
//             {error}
//           </div>
//         )}
//         <table className="w-full border-collapse">
//           <thead>
//             <tr>
//               {selectedColumns.map((columnName) => (
//                 <th
//                   key={columnName}
//                   className={`px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left ${
//                     columnName === "actions" ? "sticky right-0" : ""
//                   }`}
//                   style={{
//                     background:
//                       columnName === "actions" ? getBackgroundStyle() : "none",
//                     zIndex: columnName === "actions" ? 2 : 1,
//                   }}
//                 >
//                   {columnName === "pnlPercentage" ? "% Chng" : columnName}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {positions.map((position, index) => {
//               const realTimePrice = realtimePrices[position.stockSymbol];
//               const updatedLtp = realTimePrice || position.ltp;
//               const { pnl, pnlPercentage } = calculatePnL(position, updatedLtp);
//               const totalInvested = position.quantity * position.avgPrice;
//               const currentValue = updatedLtp * position.quantity; // New Calculation

//               return (
//                 <tr key={index}>
//                   {selectedColumns.map((columnName) => {
//                     if (columnName === "actions") {
//                       return (
//                         <td
//                           key={`${columnName}-${index}`}
//                           className="px-4 py-4 sticky right-0"
//                           style={{
//                             background: getBackgroundStyle(),
//                             zIndex: 2,
//                           }}
//                         >
//                           <button
//                             onClick={() => handleExitClick(position)}
//                             disabled={isExiting}
//                             className={`flex items-center justify-center px-2 py-1 rounded-md text-sm transition-colors ${
//                               isExiting
//                                 ? "bg-gray-400 cursor-not-allowed"
//                                 : "bg-red-500 hover:bg-red-600"
//                             } text-white`}
//                           >
//                             <X size={16} />
//                           </button>
//                         </td>
//                       );
//                     }

//                     let content = position[columnName];
//                     let className =
//                       "px-4 whitespace-nowrap overflow-hidden font-semibold py-4";

//                     if (columnName === "stockSymbol") {
//                       className += " text-[#6FD4FF]";
//                     } else if (columnName === "ltp") {
//                       content = updatedLtp;
//                     } else if (columnName === "pnl") {
//                       content = pnl.toFixed(2);
//                       className +=
//                         pnl >= 0 ? " text-green-500" : " text-red-500";
//                     } else if (columnName === "pnlPercentage") {
//                       content = pnlPercentage.toFixed(2) + "%";
//                       className +=
//                         pnlPercentage >= 0
//                           ? " text-green-500"
//                           : " text-red-500";
//                     } else if (columnName === "avgPrice") {
//                       content = parseFloat(position[columnName]).toFixed(2);
//                     } else if (columnName === "totalInvested") {
//                       content = totalInvested.toFixed(2);
//                     } else if (columnName === "currentValue") {
//                       const currentValue = updatedLtp * position.quantity;
//                       content = currentValue.toFixed(2);
//                       className +=
//                         currentValue > totalInvested
//                           ? " text-green-500"
//                           : " text-red-500";
//                     }

//                     return (
//                       <td key={`${columnName}-${index}`} className={className}>
//                         {content}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {isOrderModalOpen && (
//         <PlaceOrderModal
//           isOpen={isOrderModalOpen}
//           onClose={() => {
//             setIsOrderModalOpen(false);
//             setSelectedPosition(null);
//           }}
//           onSubmit={handleOrderSubmit}
//           initialData={selectedPosition}
//         />
//       )}
//       {isConfirmationModalOpen && (
//         <ConfirmationModal
//           isOpen={isConfirmationModalOpen}
//           onClose={() => setIsConfirmationModalOpen(false)}
//           title="Market Hours Restriction"
//           message={confirmationModalMessage}
//           onConfirm={() => setIsConfirmationModalOpen(false)}
//           isPlaceOrder={false}
//         />
//       )}
//     </>
//   );
// };

// export default PositionsPT;

import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { useUsaPaperTrading } from "../../../contexts/UsaPaperTradingContext.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { X } from "lucide-react";
import PlaceOrderModal from "../PlaceOrderModal.jsx";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import {
  isWithinTradingHours,
  isWithinTradingHoursUS,
} from "../../../utils/helper.js";

const PositionsPT = ({ selectedColumns, setColumnNames }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalMessage, setConfirmationModalMessage] = useState("");

  // ✅ Get region from Redux store
  const region = useSelector((state) => state.region);

  // ✅ Use appropriate context based on region
  const tradingContext =
    region === "usa" ? useUsaPaperTrading() : usePaperTrading();

  const { positions, loading, realtimePrices } = tradingContext;
  const { theme } = useTheme();

  useEffect(() => {
    if (!loading && isExiting) {
      setIsExiting(false);
    }
  }, [positions, loading]);

  const getColumnNames = useMemo(() => {
    if (!positions || positions.length === 0) return [];

    const excludedColumns = ["realizedPnL", "unrealizedPnL"];

    return [
      "stockSymbol",
      "exchange",
      "quantity",
      "avgPrice",
      "totalInvested",
      "currentValue",
      "ltp",
      "pnl",
      "pnlPercentage",
      "side",
      "buyQty",
      "buyAvgPrice",
      "sellQty",
      "productType",
      "_id",
      "actions",
    ].filter((col) => !excludedColumns.includes(col));
  }, [positions]);

  useEffect(() => {
    setColumnNames(getColumnNames);
  }, [getColumnNames, setColumnNames]);

  const handleExitClick = (position) => {
    const isMarketOpen =
      region === "usa" ? isWithinTradingHoursUS() : isWithinTradingHours();
    if (!isMarketOpen) {
      setConfirmationModalMessage(
        region === "usa"
          ? "Orders can only be placed between 9:30 AM and 4:00 PM EST (New York Time)."
          : "Orders can only be placed between 9:15 AM and 3:30 PM IST."
      );
      setIsConfirmationModalOpen(true);
      return;
    }
    setSelectedPosition({
      symbol: position.stockSymbol,
      quantity: position.quantity,
      price: position.ltp,
      action: "SELL",
    });
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = () => {
    setIsExiting(true);
  };

  const calculatePnL = (position, currentPrice) => {
    const pnl = (currentPrice - position.avgPrice) * position.quantity;
    const pnlPercentage =
      ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
    return { pnl, pnlPercentage };
  };

  const getBackgroundStyle = () => {
    return theme === "light" ? "#ffffff" : "#402788";
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
    <>
      <div
        className="h-[55vh] overflow-auto relative"
        style={{
          background: getBackgroundStyle(),
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
                  className={`px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left ${
                    columnName === "actions" ? "sticky right-0" : ""
                  }`}
                  style={{
                    background:
                      columnName === "actions" ? getBackgroundStyle() : "none",
                    zIndex: columnName === "actions" ? 2 : 1,
                  }}
                >
                  {columnName === "pnlPercentage" ? "% Chng" : columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => {
              const realTimePrice = realtimePrices[position.stockSymbol];
              if (!realTimePrice)
                console.log(
                  `❌ Couldn't fetch real-time price for symbol: ${position.stockSymbol}`
                );
              const updatedLtp = realTimePrice || position.ltp || 0;
              const { pnl, pnlPercentage } = calculatePnL(position, updatedLtp);
              const totalInvested = position.quantity * position.avgPrice;
              const currentValue = updatedLtp * position.quantity;

              return (
                <tr key={index}>
                  {selectedColumns.map((columnName) => {
                    if (columnName === "actions") {
                      return (
                        <td
                          key={`${columnName}-${index}`}
                          className="px-4 py-4 sticky right-0"
                          style={{
                            background: getBackgroundStyle(),
                            zIndex: 2,
                          }}
                        >
                          <button
                            onClick={() => handleExitClick(position)}
                            disabled={isExiting}
                            className={`flex items-center justify-center px-2 py-1 rounded-md text-sm transition-colors ${
                              isExiting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            } text-white`}
                          >
                            <X size={16} />
                          </button>
                        </td>
                      );
                    }

                    let content = position[columnName];
                    let className =
                      "px-4 whitespace-nowrap overflow-hidden font-semibold py-4";

                    if (columnName === "stockSymbol") {
                      className += " text-[#6FD4FF]";
                    } else if (columnName === "ltp") {
                      content = updatedLtp.toFixed(2);
                    } else if (columnName === "pnl") {
                      content = pnl.toFixed(2);
                      className +=
                        pnl >= 0 ? " text-green-500" : " text-red-500";
                    } else if (columnName === "pnlPercentage") {
                      content = pnlPercentage.toFixed(2) + "%";
                      className +=
                        pnlPercentage >= 0
                          ? " text-green-500"
                          : " text-red-500";
                    } else if (columnName === "avgPrice") {
                      content = parseFloat(position[columnName]).toFixed(2);
                    } else if (columnName === "totalInvested") {
                      content = totalInvested.toFixed(2);
                    } else if (columnName === "currentValue") {
                      content = currentValue.toFixed(2);
                      className +=
                        currentValue > totalInvested
                          ? " text-green-500"
                          : " text-red-500";
                    }

                    return (
                      <td key={`${columnName}-${index}`} className={className}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isOrderModalOpen && (
        <PlaceOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedPosition(null);
          }}
          onSubmit={handleOrderSubmit}
          initialData={selectedPosition}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          title="Market Hours Restriction"
          message={confirmationModalMessage}
          onConfirm={() => setIsConfirmationModalOpen(false)}
          isPlaceOrder={false}
        />
      )}
    </>
  );
};

export default PositionsPT;
