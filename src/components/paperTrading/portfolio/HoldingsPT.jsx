// import React, { useEffect, useState, useMemo } from "react";
// import Loading from "../../common/Loading";
// import NotAvailable from "../../common/NotAvailable.jsx";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
// import { useTheme } from "../../../contexts/ThemeContext.jsx";
// import PlaceOrderModal from "../PlaceOrderModal";
// import { X } from "lucide-react";
// import { isWithinTradingHours } from "../../../utils/helper.js";
// import ConfirmationModal from "../../common/ConfirmationModal.jsx";

// const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
//   const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
//   const [selectedHolding, setSelectedHolding] = useState(null);
//   const [isExiting, setIsExiting] = useState(false);
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [confirmationModalMessage, setConfirmationModalMessage] = useState("");
//   const { holdings, loading, realtimePrices } = usePaperTrading();
//   const { theme } = useTheme();

//   const getBackgroundStyle = () => (theme === "light" ? "#ffffff" : "#402788");

//   useEffect(() => {
//     if (!loading && isExiting) {
//       setIsExiting(false);
//     }
//   }, [holdings, loading]);

//   // ✅ Memoized column structure
//   const getColumnNames = useMemo(() => {
//     return holdings?.length
//       ? [
//           "stockSymbol",
//           "quantity",
//           "averagePrice",
//           "ltp",
//           "pnl",
//           "pnlPercentage",
//           "totalInvested", // Previously "investedValue"
//           "currentValue",
//           "exchange",
//           "actions",
//         ]
//       : [];
//   }, [holdings]);

//   useEffect(() => {
//     setColumnNames(getColumnNames);
//   }, [getColumnNames, setColumnNames]);

//   const handleExitClick = (holding) => {
//     if (!isWithinTradingHours()) {
//       setConfirmationModalMessage(
//         "Orders can only be placed between 9:15 AM and 3:30 PM IST."
//       );
//       setIsConfirmationModalOpen(true);
//       return;
//     }
//     setSelectedHolding({
//       symbol: holding.stockSymbol,
//       quantity: holding.quantity,
//       price: holding.ltp,
//       action: "SELL",
//     });
//     setIsOrderModalOpen(true);
//   };

//   const calculatePnL = (holding, currentPrice) => {
//     const pnl = (currentPrice - holding.averagePrice) * holding.quantity;
//     const pnlPercentage =
//       ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
//     return { pnl, pnlPercentage };
//   };

//   if (loading) {
//     return (
//       <div className="flex h-40 items-center justify-center p-4">
//         <Loading />
//       </div>
//     );
//   }

//   if (!holdings || holdings.length === 0) {
//     return <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />;
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
//         <table className="w-full border-collapse relative">
//           <thead>
//             <tr>
//               {selectedColumns.map((columnName) => (
//                 <th
//                   key={columnName}
//                   className={`px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left ${
//                     columnName === "actions" ? "sticky right-0" : ""
//                   }`}
//                   style={{
//                     background: columnName === "actions" ? getBackgroundStyle() : "none",
//                     zIndex: columnName === "actions" ? 2 : 1,
//                   }}
//                 >
//                   {columnName === "pnlPercentage" ? "% Chng" : columnName}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {holdings.map((holding, index) => {
//               const realTimePrice = realtimePrices[holding.stockSymbol];
//               const updatedLtp = realTimePrice || holding.ltp;
//               const { pnl, pnlPercentage } = calculatePnL(holding, updatedLtp);

//               const totalInvested = holding.investedValue;
//               const currentValue = updatedLtp * holding.quantity;

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
//                             boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.1)",
//                           }}
//                         >
//                           <button
//                             onClick={() => handleExitClick(holding)}
//                             disabled={isExiting}
//                             className={`flex items-center justify-center px-2 py-1 rounded-md text-sm transition-colors ${
//                               isExiting ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
//                             } text-white`}
//                           >
//                             <X size={16} />
//                           </button>
//                         </td>
//                       );
//                     }

//                     let content = holding[columnName];
//                     let className = "px-4 whitespace-nowrap overflow-hidden font-semibold py-4";

//                     if (columnName === "stockSymbol") {
//                       className += " text-[#6FD4FF]";
//                     } else if (columnName === "ltp") {
//                       content = updatedLtp.toFixed(2);
//                     } else if (columnName === "pnl") {
//                       content = pnl.toFixed(2);
//                       className += pnl >= 0 ? " text-green-500" : " text-red-500";
//                     } else if (columnName === "pnlPercentage") {
//                       content = pnlPercentage.toFixed(2) + "%";
//                       className += pnlPercentage >= 0 ? " text-green-500" : " text-red-500";
//                     } else if (columnName === "averagePrice") {
//                       content = parseFloat(holding[columnName]).toFixed(2);
//                     } else if (columnName === "totalInvested") {
//                       content = totalInvested.toFixed(2);
//                     } else if (columnName === "currentValue") {
//                       content = currentValue.toFixed(2);
//                       className += currentValue > totalInvested ? " text-green-500" : " text-red-500";
//                     }

//                     return (
//                       <td key={`${columnName}-${index}`} className={className}>
//                         {content !== undefined && content !== null ? content : "-"}
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
//             setSelectedHolding(null);
//           }}
//           onSubmit={() => setIsExiting(true)}
//           initialData={selectedHolding}
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

// export default HoldingsPT;

import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../common/Loading";
import NotAvailable from "../../common/NotAvailable.jsx";
import PlaceOrderModal from "../PlaceOrderModal";
import ConfirmationModal from "../../common/ConfirmationModal.jsx";
import { X } from "lucide-react";
import {
  isWithinTradingHours,
  isWithinTradingHoursUS,
} from "../../../utils/helper.js";
import { useTheme } from "../../../contexts/ThemeContext.jsx";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext.jsx";
import { useUsaPaperTrading } from "../../../contexts/UsaPaperTradingContext.jsx";

const HoldingsPT = ({ selectedColumns, setColumnNames }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalMessage, setConfirmationModalMessage] = useState("");

  // ✅ Get region from Redux store
  const region = useSelector((state) => state.region);

  // ✅ Use appropriate context based on region
  const tradingContext =
    region === "usa" ? useUsaPaperTrading() : usePaperTrading();

  const { holdings, loading, realtimePrices } = tradingContext;
  const { theme } = useTheme();

  const getBackgroundStyle = () => {
    return theme === "light" ? "" : "";
  };

  useEffect(() => {
    if (!loading && isExiting) {
      setIsExiting(false);
    }
  }, [holdings, loading]);

  // ✅ Memoized column structure
  const getColumnNames = useMemo(() => {
    return holdings?.length
      ? [
          "stockSymbol",
          "quantity",
          "averagePrice",
          "ltp",
          "pnl",
          "pnlPercentage",
          "totalInvested",
          "currentValue",
          "exchange",
          "actions",
        ]
      : [];
  }, [holdings]);

  useEffect(() => {
    setColumnNames(getColumnNames);
  }, [getColumnNames, setColumnNames]);

  const handleExitClick = (holding) => {
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
    setSelectedHolding({
      symbol: holding.stockSymbol,
      quantity: holding.quantity,
      price: holding.ltp,
      action: "SELL",
    });
    setIsOrderModalOpen(true);
  };

  const calculatePnL = (holding, currentPrice) => {
    const pnl = (currentPrice - holding.averagePrice) * holding.quantity;
    const pnlPercentage =
      ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
    return { pnl, pnlPercentage };
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <NotAvailable dynamicText={"<strong>Step</strong> into the market!"} />
    );
  }

  return (
    <>
      <div className="relative min-h-[45vh] max-h-[45vh] overflow-auto pt-5 pl-5 scrollbar-hide rounded-md shadow-[0px_15px_34px_0px_rgba(0,0,0,0.12)] dark:shadow-[0px_10px_30px_0px_rgba(73,123,255,0.7)_inset,0px_10px_40px_0px_rgba(63,74,175,0.5)] border border-transparent dark:backdrop-blur-[20px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {selectedColumns.map((columnName) => (
                <th
                  key={columnName}
                  className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap capitalize font-[poppins] font-normal dark:text-[#FFFFFF99] text-left ${
                    columnName === "actions" ? "sticky right-0 z-10" : ""
                  }`}
                  style={{
                    background: columnName === "actions" ? getBackgroundStyle() : "transparent",
                    borderRadius: columnName === "actions" ? "" : "0",
                  }}
                >
                  {columnName === "pnlPercentage" ? "% Chng" : columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const realTimePrice = realtimePrices[holding.stockSymbol];
              if (!realTimePrice)
                console.log(
                  `❌ Couldn't fetch real-time price for symbol: ${holding.stockSymbol}`
                );

              const updatedLtp = realTimePrice || holding.ltp || 0;
              const { pnl, pnlPercentage } = calculatePnL(holding, updatedLtp);

              const totalInvested = holding.investedValue;
              const currentValue = updatedLtp * holding.quantity;

              return (
                <tr key={index}>
                  {selectedColumns.map((columnName) => {
                    if (columnName === "actions") {
                      return (
                        <td
                          key={`${columnName}-${index}`}
                          className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap text-left font-semibold sticky right-0 z-10"
                          style={{
                            background: getBackgroundStyle()
                          }}
                        >
                          <button
                            onClick={() => handleExitClick(holding)}
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

                    let content = holding[columnName];
                    let className = "px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-[10px] sm:text-[11px] lg:text-sm whitespace-nowrap text-left font-semibold";

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
                    } else if (columnName === "averagePrice") {
                      content = parseFloat(holding[columnName]).toFixed(2);
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
                        {content !== undefined && content !== null
                          ? content
                          : "-"}
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
            setSelectedHolding(null);
          }}
          onSubmit={() => setIsExiting(true)}
          initialData={selectedHolding}
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

export default HoldingsPT;
