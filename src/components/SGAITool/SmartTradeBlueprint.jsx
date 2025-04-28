import { useState } from "react";
import Header from "./SGAIHeader";
import SGAICalc from "./SGAICalc";
import SimulationResults from "./SimulationResults";
import IndexPerformance from "./IndexPerformance";
import TransactionHistory from "./TransactionHistory";
import InfoCard from "./InfoCard";
import { useTheme } from "../../contexts/ThemeContext";

const SmartTradeBlueprint = () => {
  const [isSimulationComplete, setIsSimulationComplete] = useState(false);
  const [savedFormValues, setSavedFormValues] = useState(null);
  const { theme } = useTheme();
  const themeColor = theme === "dark" ? "white" : "black";
  const gradientBackground = "";
  const plainBackground = "bg-white text-black";
  const isDark = theme === "dark";
  const bgClass =
    theme === "dark" ? `${gradientBackground} text-white` : plainBackground;

  const [isLoading, setIsLoading] = useState(false);

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

  const handleSimulationComplete = (data) => {
    console.log(
      "(Data which can be passed)Simulation completed with data:",
      data.results
    );

    // Update state with dynamic data
    setSimulationData(data.results.nse_simulation); // Replace static simulation data
    setSavedFormValues(data.formValues);

    // Replace static index performance data
    setIndexData(data.results.index_performance);

    // Replace static transaction history data
    setTransactions(data.results.transaction_history);
    setIsSimulationComplete(true);
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
      setIsSimulationComplete(false);
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8000/run-simulation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initial_cash: parseFloat(savedFormValues.initialCash),
            start_date: formatDate(savedFormValues.startDate),
            end_date: formatDate(savedFormValues.endDate),
            profit_margin: parseFloat(savedFormValues.marginProfit),
            loss_margin: parseFloat(savedFormValues.marginLoss),
          }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const result = await response.json();
        console.log("result is: ", result.data);

        // Update state with dynamic data
        setSimulationData(result.data.nse_simulation); // Replace static simulation data
        setSavedFormValues(result.data.formValues);

        // Replace static index performance data
        setIndexData(result.data.index_performance);

        // Replace static transaction history data
        setTransactions(result.data.transaction_history);
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
      } catch (error) {
        console.error("Re-run simulation error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <div className="rounded-2xl shadow-lg py-4 px-6">
      {/* Your content goes here */}
      <Header onReRun={handleReRun} isLoading={isLoading} />

      <div
        className={`h-px w-full my-2 ${isDark ? "bg-white/20" : "bg-gray-300"}`}
      ></div>

      <div className="grid grid-cols-1 h-100 lg:grid-cols-12 gap-4 mt-4 ">
        {/* Left Panel - SGAI Calc */}
        <div className="lg:col-span-5">
          <SGAICalc onSimulationComplete={handleSimulationComplete} />
        </div>

        {/* InfoCard - shown only before simulation */}
        {!isSimulationComplete && (
          <div className="lg:col-span-7">
            <InfoCard />
          </div>
        )}

        {/* SimulationResults - shown after simulation */}
        {isSimulationComplete &&
          simulationData &&
          Object.keys(simulationData).length > 0 && (
            <div className="lg:col-span-3">
              <SimulationResults data={simulationData} />
            </div>
          )}

        {/* IndexPerformance - shown after simulation */}
        {isSimulationComplete &&
          indexData &&
          Object.keys(indexData).length > 0 && (
            <div className="lg:col-span-4">
              <IndexPerformance data={indexData} />
            </div>
          )}
      </div>

      <div className="mt-4">
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default SmartTradeBlueprint;
