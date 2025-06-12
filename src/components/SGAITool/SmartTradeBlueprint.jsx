import { useState, useEffect } from "react";
import Header from "./SGAIHeader";
import SGAICalc from "./SGAICalc";
import SimulationResults from "./SimulationResults";
import IndexPerformance from "./IndexPerformance";
import TransactionHistory from "./TransactionHistory";
import InfoCard from "./InfoCard";
import { useTheme } from "../../contexts/ThemeContext";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../../config";

const SmartTradeBlueprint = () => {
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [savedFormValues, setSavedFormValues] = useState(null);
  const [currency, setCurrency] = useState(null);
  const { theme, updateTheme } = useTheme();
  const themeColor = theme === "dark" ? "white" : "black";
  const region = useSelector((state) => state.region); // Get region from store
  const market = useSelector((state) => state.market); // Get region from store
  // console.log("Region is: ", market);

  useEffect(() => {
    if (theme === "system") {
      // console.log("Theme updatedD");
      updateTheme("dark");
    }
  }, [theme, updateTheme]);
  const gradientBackground = "";
  const plainBackground = "bg-white text-black";

  const isDark = theme === "dark";
  const bgClass =
    theme === "dark" ? `${gradientBackground} text-white` : plainBackground;

  const [isLoading, setIsLoading] = useState(false);
  const [expandedView, setExpandedView] = useState(null); // null | "TransactionHistory"

  const [simulationData, setSimulationData] = useState({
    initialCash: 5000.0,
    finalValue: 4028.45,
    realizedPnL: 840.13,
    unrealizedPnL: 48.61,
    totalReturn: 15.83,
    totalProfitLoss: 791.52,
    currency: "Rs",
  });

  // Dummy data for IndexPerformance
  const [indexData, setIndexData] = useState({});

  const [transactions, setTransactions] = useState([]);
  const [marketTitle, setMarketTitle] = useState("NYSE");

  const handleSimulationComplete = (data) => {
    if (!data) {
      setIsSimulationComplete(false);
      setTransactions([]);
    } else {
      // console.log(
      //   "(Data which can be passed)Simulation completed with data:",
      //   data.results
      // );
      const currency = data.results.currency;
      setCurrency(currency);
      // Update state with dynamic data
      if (region === "india") {
        // console.log("NSE: ", data.results);
        setSimulationData(data.results.nse_simulation); // Replace static simulation data
        setIndexData(data.results.index_performance);
        setTransactions(data.results.transactions);
      } else {
        if (marketTitle === "NYSE") {
          // console.log("NYSE: ", data.results.data);
          setSimulationData(data.results.data.nyse_simulation); // Replace static simulation data
          setIndexData(data.results.data.index_performance.nyse);
          setTransactions(data.results.data.transaction_history.nyse);
        } else {
          // console.log("NASDAQ: ", data.results);
          setSimulationData(data.results.nasdaq_simulation); // Replace static simulation data
          setIndexData(data.results.index_performance.nasdaq);
          setTransactions(data.results.transaction_history.nasdaq);
        }
      }

      setSavedFormValues(data.formValues);
      setIsSimulationComplete(true);
      setMarketTitle(data.results.marketTitle);
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleReRun = async () => {
    console.log("Re run");
    if (savedFormValues) {
      console.log(
        "Re-running simulation with saved form values:",
        savedFormValues
      );
      // setIsSimulationComplete(false);
      setIsLoading(true);

      try {
        if (region === "india") {
          const NseResponse = await api.post(`/api/v1/simulation/nse`, {
            initial_cash: parseFloat(savedFormValues.initialCash),
            start_date: formatDate(savedFormValues.startDate),
            end_date: formatDate(savedFormValues.endDate),
            profit_margin: parseFloat(savedFormValues.marginProfit).toFixed(2),
            loss_margin: parseFloat(savedFormValues.marginLoss).toFixed(2),
          });

          console.log("NSE Response: ", NseResponse.data);

          const result = NseResponse.data;

          setSimulationData(result.data.nse_simulation); // Replace static simulation data
          setIndexData(result.data.index_performance);
          setTransactions(result.data.transaction_history);
          // console.log("REACHED HERE");
          setIsSimulationComplete(true);
          if (handleSimulationComplete) {
            handleSimulationComplete({
              formValues: savedFormValues,
              results: {
                ...result.data,
                currency: savedFormValues.currency,
              },
            });
          }
        } else {
          const NasdaqResponse = await api.post(`/api/v1/simulation/nasdaq`, {
            initial_cash: parseFloat(savedFormValues.initialCash),
            start_date: formatDate(savedFormValues.startDate),
            end_date: formatDate(savedFormValues.endDate),
            profit_margin: parseFloat(savedFormValues.marginProfit).toFixed(2),
            loss_margin: parseFloat(savedFormValues.marginLoss).toFixed(2),
          });

          console.log("Nasdaq Response: ", NasdaqResponse.data);

          const result = NasdaqResponse.data;

        
          if (marketTitle === "NYSE") {
            // console.log("NYSE: ", result);
            setSimulationData(result.data.nyse_simulation); // Replace static simulation data
            setIndexData(result.data.index_performance.nyse);
            setTransactions(result.data.transaction_history.nyse);

            setIsSimulationComplete(true);
            if (handleSimulationComplete) {
              handleSimulationComplete({
                formValues: savedFormValues,
                results: {
                  ...result.data,
                  currency: savedFormValues.currency,
                },
              });
            }
          } else {
            // console.log("NASDAQ: ", result);
            setSimulationData(result.data.nasdaq_simulation); // Replace static simulation data
            setIndexData(result.data.index_performance.nasdaq);
            setTransactions(result.data.transaction_history.nasdaq);

            setIsSimulationComplete(true);
            if (handleSimulationComplete) {
              handleSimulationComplete({
                formValues: savedFormValues,
                results: {
                  ...result.data,
                  currency: savedFormValues.currency,
                },
              });
            }
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("Simulation limit reached for this month.");
        } else {
          console.error("Simulation error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handler for magnify toggle
  const handleMagnifyToggle = (componentName) => {
    setExpandedView((prev) => (prev === componentName ? null : componentName));
    // console.log("cdskc", expandedView);
  };
  return (
    <div
      className={`rounded-2xl backdrop-blur-md w-[98%] sm:w-[96%] md:w-[94%] lg:w-[92%] xl:w-[90%] 2xl:w-[88%] mx-auto shadow-lg py-3 px-2 sm:px-3 overflow-hidden ${
        theme === "dark" ? "bg-white/10" : "bg-[#CCD7FF40]"
      }`}
    >
      {/* Your content goes here */}
      <Header onReRun={handleReRun} isLoading={isLoading} />
      <div
        className={`h-px my-2 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>{" "}
      {expandedView === null ? (
        <div className="grid grid-cols-1 h-100 lg:grid-cols-12 gap-1 sm:gap-2 mt-3 overflow-hidden">
          <div className="lg:col-span-5 h-full w-full">
            <SGAICalc onSimulationComplete={handleSimulationComplete} />
          </div>
          {!isSimulationComplete && (
            <div className="lg:col-span-7 h-full w-full">
              <InfoCard />
            </div>
          )}

          {isSimulationComplete &&
            simulationData &&
            Object.keys(simulationData).length > 0 && (
              <div className="lg:col-span-3 h-full">
                <SimulationResults
                  title={marketTitle}
                  data={simulationData}
                  currency={currency}
                />
              </div>
            )}

          {isSimulationComplete &&
            indexData &&
            Object.keys(indexData).length > 0 && (
              <div className="lg:col-span-4 h-full">
                <IndexPerformance data={indexData} currency={currency} />
              </div>
            )}
        </div>
      ) : (
        <div></div>
      )}
      <div className="mt-4">
        <TransactionHistory
          transactions={transactions}
          currency={currency}
          onMagnifyToggle={handleMagnifyToggle}
          isExpanded={expandedView === "TransactionHistory"}
        />
      </div>
    </div>
  );
  // return (
  //   <div className="rounded-2xl shadow-lg py-4 px-4 sm:px-6 w-full max-w-7xl mx-auto">
  //     <Header onReRun={handleReRun} isLoading={isLoading} />

  //     <div
  //       className={`h-px w-full my-2 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
  //     ></div>

  //     {expandedView === null ? (
  //       <div className="flex flex-col lg:flex-row gap-4 mt-4">
  //         {/* Left Column - Calculator */}
  //         <div className="w-full lg:w-6/12 xl:w-1/3">
  //           <SGAICalc onSimulationComplete={handleSimulationComplete} />
  //         </div>

  //         {/* Right Column - Results or InfoCard */}
  //         <div className="w-full lg:w-6/12 xl:w-2/3">
  //           {!isSimulationComplete ? (
  //             <InfoCard />
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               {simulationData && Object.keys(simulationData).length > 0 && (
  //                 <div className="md:col-span-1">
  //                   <SimulationResults
  //                     title={marketTitle}
  //                     data={simulationData}
  //                     currency={currency}
  //                   />
  //                 </div>
  //               )}
  //               {indexData && Object.keys(indexData).length > 0 && (
  //                 <div className="md:col-span-1">
  //                   <IndexPerformance data={indexData} currency={currency} />
  //                 </div>
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="min-h-[50vh]">
  //         {/* Expanded view content would go here */}
  //       </div>
  //     )}

  //     {/* Transaction History - always at bottom */}
  //     <div className="mt-4 w-full">
  //       <TransactionHistory
  //         transactions={transactions}
  //         currency={currency}
  //         onMagnifyToggle={handleMagnifyToggle}
  //         isExpanded={expandedView === "TransactionHistory"}
  //       />
  //     </div>
  //   </div>
  // );
};

export default SmartTradeBlueprint;
