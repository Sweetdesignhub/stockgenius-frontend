import React, { useState, useEffect, useRef } from "react";
import { Filter, Infinity, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import fetchFile from "../../utils/fetchFile";
import parseExcel from "../../utils/parseExcel";
import Loading from "../common/Loading";
import PlaceOrderModal from "./PlaceOrderModal";
import { useTheme } from "../../contexts/ThemeContext";
import ConfirmationModal from "../common/ConfirmationModal";
import { isWithinTradingHoursUS } from "../../utils/helper";
import { useSelector } from "react-redux";

function AiDrivenListUsa() {
  const [tableData, setTableData] = useState([]);
  const [aiDrivenData, setAiDrivenData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("AI Driven Stocks");
  const [predictionFilter, setPredictionFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalMessage, setConfirmationModalMessage] = useState("");

  const filterRef = useRef(null);
  const filterButtonRef = useRef(null);
  const market = useSelector((state) => state.market);

  const { theme } = useTheme();

  let containerName = "";
  if (market === "NYSE") {
    containerName = "nyse";
  } else if (market === "NASDAQ") {
    containerName = "nasdaq";
  } else {
    containerName = "sgaiindia"; // Default fallback
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const aiDrivenBuffer = await fetchFile(
          containerName,
          "Realtime_Reports/Final_Report.xlsx"
        );
        const aiDrivenJson = parseExcel(aiDrivenBuffer);
        const aiDrivenFormatted = aiDrivenJson.map((row) => ({
          symbol: row.Ticker,
          prediction: row.ReinforcedDecision === "Buy" ? "Buy" : "Sell",
        }));
        setAiDrivenData(aiDrivenFormatted);

        let fileName = "Realtime_Reports/Final_Report.xlsx";
        if (selectedFilter === "Top Gainers") {
          fileName = "Realtime_Reports/top_gainers.xlsx";
        } else if (selectedFilter === "Top Losers") {
          fileName = "Realtime_Reports/top_losers.xlsx";
        }

        const fileBuffer = await fetchFile(containerName, fileName);
        const jsonData = parseExcel(fileBuffer);

        let formattedData;
        if (selectedFilter === "AI Driven Stocks") {
          formattedData = jsonData.map((row) => ({
            symbol: row.Ticker,
            stockName: row["Company Name"],
            roi: parseFloat(row.ROI),
            sentimentScore: row["Sentiment Score"],
            price: `₹${row["LastTradedPrice"]}`,
            prediction: row.ReinforcedDecision === "Buy" ? "Buy" : "Sell",
          }));
        } else {
          formattedData = jsonData.map((row) => {
            const aiPrediction = aiDrivenFormatted.find(
              (aiRow) => aiRow.symbol === row.Ticker
            );
            return {
              symbol: row.Ticker,
              stockName: row["Company Name"],
              roi: parseFloat(row.ROI),
              sentimentScore: row.Sentiment,
              prediction: aiPrediction ? aiPrediction.prediction : "N/A",
            };
          });
        }

        const sortedData = formattedData.sort((a, b) => b.roi - a.roi);
        setTableData(sortedData);
      } catch (error) {
        console.error("Error fetching or parsing file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3600000);
    return () => clearInterval(intervalId);
  }, [selectedFilter, market]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredData = tableData.filter((row) => {
    const matchesSearch = Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesPrediction =
      predictionFilter === "all"
        ? true
        : row.prediction.toLowerCase() === predictionFilter;

    return matchesSearch && matchesPrediction;
  });

  const handlePredictionFilter = (filter) => {
    setPredictionFilter(filter);
  };
  const handleBuy = (row) => {
    if (isWithinTradingHoursUS()) {
      setSelectedRow({ ...row, action: "BUY" });
      setModalOpen(true);
    } else {
      setConfirmationModalMessage(
        "Orders can only be placed between 9:30 AM and 4:00 PM EST (New York Time)."
      );
      setIsConfirmationModalOpen(true);
    }
  };
  
  const handleSell = (row) => {
    if (isWithinTradingHoursUS()) {
      setSelectedRow({ ...row, action: "SELL" });
      setModalOpen(true);
    } else {
      setConfirmationModalMessage(
        "Orders can only be placed between 9:30 AM and 4:00 PM EST (New York Time)."
      );
      setIsConfirmationModalOpen(true);
    }
  };
  

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleModalSubmit = (orderData) => {
    // console.log("Order placed:", orderData);
    setModalOpen(false);
  };

  const renderTableHeaders = () => {
    return (
      <tr className="text-sm">
        <td className="px-2 text-xs text-black dark:text-[#FFFFFFD9] py-2">
          Symbol
        </td>
        <td className="px-2 text-xs text-black dark:text-[#FFFFFFD9] py-2">
          Stock Name
        </td>
        <td className="px-2 text-xs text-black dark:text-[#FFFFFFD9] py-2">
          ROI
        </td>
        <td className="px-2 text-xs text-black dark:text-[#FFFFFFD9] py-2 whitespace-nowrap">
          Sentiment Score
        </td>
        {selectedFilter === "AI Driven Stocks" && (
          <td className="px-2 text-xs text-black dark:text-[#FFFFFFD9] py-2">
            Price
          </td>
        )}
        <td className="px-2 text-xs text-black dark:text-[#FFFFFFD9] py-2">
          Prediction
        </td>
      </tr>
    );
  };

  const renderTableRows = () => {
    return filteredData.map((row, index) => (
      <tr
        key={index}
        className="hover:bg-[#FFFFFF0A] transition duration-200 text-sm"
      >
        <td className="px-2 text-xs py-2">{row.symbol}</td>
        <td className="px-2 text-xs py-2" style={{ color: "#4882F3" }}>
          {row.stockName}
        </td>
        <td
          className="px-2 text-xs py-2"
          style={{
            color: row.prediction === "Buy" ? "#1ECB4F" : "#CB2C2C",
          }}
        >
          {row.roi}
        </td>
        <td className="px-2 text-xs py-2">{row.sentimentScore}</td>
        {selectedFilter === "AI Driven Stocks" && (
          <td className="px-2 py-2">{row.price}</td>
        )}
        <td className="px-2 py-2">
          {row.prediction === "Buy" ? (
            <button
              onClick={() => handleBuy(row)}
              className="text-[10px] font-semibold font-[poppins] px-2 rounded-xl text-center border border-[#0EBC34] bg-[#0EBC34] text-[#FFFFFF] dark:border-[#14AE5C] dark:bg-[#14AE5C1A] dark:text-[#7EF36B]"
            >
              Buy
            </button>
          ) : (
            <button
              onClick={() => handleSell(row)}
              className="text-[10px] font-semibold font-[poppins] px-2 rounded-xl text-center border border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
            >
              Sell
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div
      className="p-3 bg-white/5 dark:bg-[rgba(5,5,5,0.2)] backdrop-blur-md table-main rounded-lg flex flex-col h-full relative"
      
    >
      {/* Header Section */}
      <div className="flex-shrink-0 justify-between flex flex-col sm:flex-row items-center border-b border-gray pb-3 mb-4 dark:border-[#FFFFFF1A]">
        <h1 className="text-black font-semibold text-md dark:text-white mb-2 sm:mb-0">
          AIDrivenList
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-black dark:text-white font-semibold text-sm border rounded-xl px-2 py-[1px] w-full sm:w-auto"
          />
        </div>

        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePredictionFilter("all")}
              className={`p-1 rounded-md transition-colors ${
                predictionFilter === "all"
                  ? "bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_-40.91%,_#402788_132.95%)]"
                  : "bg-[#FFFFFF]"
              } hover:bg-[#FFFFFF1A]`}
            >
              <Infinity
                className={`w-5 h-5 ${
                  predictionFilter === "all" ? "text-white" : "text-[#3A6FF8]"
                }`}
              />
            </button>
            <button
              onClick={() => handlePredictionFilter("buy")}
              className={`p-1 rounded-md transition-colors ${
                predictionFilter === "buy"
                  ? "bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_-40.91%,_#402788_132.95%)]"
                  : "bg-[#FFFFFF]"
              } hover:bg-[#FFFFFF1A]`}
            >
              <ArrowUpCircle className={`w-5 h-5 text-[#1ECB4F]`} />
            </button>
            <button
              onClick={() => handlePredictionFilter("sell")}
              className={`p-1 rounded-md transition-colors ${
                predictionFilter === "sell"
                  ? "bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_-40.91%,_#402788_132.95%)]"
                  : "bg-[#FFFFFF]"
              } hover:bg-[#FFFFFF1A]`}
            >
              <ArrowDownCircle className={`w-5 h-5 text-[#CB2C2C]`} />
            </button>
          </div>

          <div className="relative">
            <button
              ref={filterButtonRef}
              onClick={() => setShowFilter(!showFilter)}
              className={`p-1 rounded-md transition-colors ${
                showFilter
                  ? "bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_-40.91%,_#402788_132.95%)]"
                  : "bg-[#FFFFFF]"
              } hover:bg-[#FFFFFF1A]`}
            >
              <Filter
                className={`w-5 h-5 ${
                  showFilter ? "text-white" : "text-[#3A6FF8]"
                }`}
              />
            </button>
            {showFilter && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-50 min-w-[200px]"
              >
                <p className="text-[#71717A] text-sm mb-2">Smart Sort</p>
                <div className="space-y-2">
                  {["Top Gainers", "Top Losers", "AI Driven Stocks"].map(
                    (option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="filter"
                          value={option}
                          checked={selectedFilter === option}
                          onChange={(e) => {
                            setSelectedFilter(e.target.value);
                            setPredictionFilter("all");
                          }}
                          className="text-blue-600"
                        />
                        <span className="text-black text-sm">{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section with max height */}
      <div
        className="flex-grow overflow-auto"
        style={{ maxHeight: "calc(100% - 60px)" }}
      >
        {isLoading ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <Loading />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-black bg-transparent dark:text-white">
              <thead>{renderTableHeaders()}</thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm">No results found</p>
        )}
      </div>

      {/* Place Order Modal */}
      <PlaceOrderModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={selectedRow}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Market Hours Restriction"
        message={confirmationModalMessage}
        onConfirm={() => setIsConfirmationModalOpen(false)}
        isPlaceOrder={false}
      />
    </div>
  );
}

export default AiDrivenListUsa;
