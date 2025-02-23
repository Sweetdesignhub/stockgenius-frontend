import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import fetchFileJSON from "../../utils/india/fetchFileJSON";
import fetchFile from "../../utils/india/fetchFile";
import parseExcel from "../../utils/india/parseExcel";
import Loading from "../common/Loading";

const StockCard = ({
  title,
  stock,
  description,
  roi,
  sentimentScore,
  volatility,
}) => (
  <div
    className="dark:bg-[#1a1f2e] rounded-lg p-2 dark:text-white"
    style={{
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
    }}
  >
    <h2 className="text-sm font-semibold mb-2 flex justify-between items-center">
      {title}
    </h2>

    <div className="flex items-center gap-2 mb-1">
      <div>
        <h3 className="text-xs font-semibold dark:text-white">{stock}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>

    <div className="flex gap-1 flex-wrap">
      <div
        className="px-2 py-1 rounded-full text-xs"
        style={{
          backgroundColor: "#14AE5C1A",
          color: "#7EF36B",
          border: "1px solid #14AE5C",
        }}
      >
        ROI - {roi}
      </div>

      <div
        className="px-2 py-1 rounded-full text-xs"
        style={{
          backgroundColor: "#8B5CF61A",
          color: "#C4B5FD",
          border: "1px solid #8B5CF6",
        }}
      >
        Sentiment Score - {sentimentScore}
      </div>

      <div
        className="px-2 py-1 rounded-full text-xs"
        style={{
          backgroundColor: "#F59E0B1A",
          color: "#FCD34D",
          border: "1px solid #F59E0B",
        }}
      >
        Volatility - {volatility}
      </div>
    </div>
  </div>
);

function DailyUpdates() {
  const [newsHeadlines, setNewsHeadlines] = useState([]);
  const [stockData, setStockData] = useState({
    topPick: {},
    highSentiment: {},
    lowRisk: {},
  });
  const [loading, setLoading] = useState(true); // Step 1: Add loading state

  useEffect(() => {
    const getNewsData = async () => {
      try {
        const data = await fetchFileJSON(
          "automationdatabucket",
          "EOD_Reports/NewsData/merged_plain_news.json"
        );
        setNewsHeadlines(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    getNewsData();
    const intervalId = setInterval(getNewsData, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true); // Step 2: Set loading to true when fetching data
      try {
        const containerName = "sgaiindia";
        const fileName = "Realtime_Reports/Final_Report.xlsx";
        const fileBuffer = await fetchFile(containerName, fileName);
        const jsonData = parseExcel(fileBuffer);

        const formattedData = jsonData.map((row) => ({
          symbol: row.Ticker,
          stockName: row["Company Name"],
          roi: parseFloat(row.ROI),
          volatility: parseFloat(row.Volatility),
          sentimentScore: row["Sentiment Score"],
          price: `₹${row["LastTradedPrice"]}`,
          prediction: row.ReinforcedDecision === "Buy" ? "Buy" : "Sell",
          rsi: row["RSI"],
        }));

        const topPick = formattedData.reduce((prev, current) => {
          return prev.roi > current.roi ? prev : current;
        });

        const highSentimentStock = formattedData.reduce((prev, current) => {
          return prev.sentimentScore > current.sentimentScore ? prev : current;
        });

        const lowRiskStock = formattedData.reduce((prev, current) => {
          return prev.volatility < current.volatility ? prev : current;
        });

        setStockData({
          topPick: {
            stock: topPick.stockName,
            description: `Strong quarterly earnings and positive sentiment drive this stock.`,
            roi: `${topPick.roi}RS in 1 Week`,
            sentimentScore: topPick.sentimentScore,
            volatility: topPick.volatility,
          },
          highSentiment: {
            stock: highSentimentStock.stockName,
            description: `Strong quarterly earnings and positive sentiment drive this stock.`,
            roi: `${highSentimentStock.roi}RS in 1 Week`,
            sentimentScore: highSentimentStock.sentimentScore,
            volatility: highSentimentStock.volatility,
          },
          lowRisk: {
            stock: lowRiskStock.stockName,
            description: `Strong quarterly earnings and positive sentiment drive this stock.`,
            roi: `${lowRiskStock.roi}RS in 1 Week`,
            sentimentScore: lowRiskStock.sentimentScore,
            volatility: lowRiskStock.volatility,
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing file:", error);
      } finally {
        setLoading(false); // Step 3: Set loading to false after data fetch completes
      }
    };

    fetchStockData();
    const intervalId = setInterval(fetchStockData, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <Loading />; // Step 4: Conditionally render the Loading component
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* 50% height for Stock Cards Section */}
      <div className="flex flex-col md:flex-col gap-4 flex-1">
        <StockCard
          title="Top Pick for Today"
          stock={stockData.topPick.stock}
          description={stockData.topPick.description}
          roi={stockData.topPick.roi}
          sentimentScore={stockData.topPick.sentimentScore}
          volatility={stockData.topPick.volatility}
        />

        <StockCard
          title="High Sentiment Stock"
          stock={stockData.highSentiment.stock}
          description={stockData.highSentiment.description}
          roi={stockData.highSentiment.roi}
          sentimentScore={stockData.highSentiment.sentimentScore}
          volatility={stockData.highSentiment.volatility}
        />

        <StockCard
          title="Low Risk Option"
          stock={stockData.lowRisk.stock}
          description={stockData.lowRisk.description}
          roi={stockData.lowRisk.roi}
          sentimentScore={stockData.lowRisk.sentimentScore}
          volatility={stockData.lowRisk.volatility}
        />
      </div>

      {/* 50% height for News Section */}
      <div
        className="dark:bg-[#1a1f2e] rounded-lg p-4 dark:text-white flex-1 overflow-hidden"
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        }}
      >
        <h2 className="text-md font-semibold mb-4">News and Events</h2>
        <div className="lg:h-full md:h-full h-96 overflow-y-auto">
          <ul>
            {newsHeadlines.map((news, index) => (
              <li
                key={index}
                className="group flex items-center justify-between hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200 cursor-pointer"
              >
                <a
                  href={news["Reference link"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-gray-100 text-sm flex-grow"
                >
                  {news.Headline}
                </a>
                <ChevronRight
                  className="text-gray-400 group-hover:text-white transition-colors duration-200"
                  size={20}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DailyUpdates;
