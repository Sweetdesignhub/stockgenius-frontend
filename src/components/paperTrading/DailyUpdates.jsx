import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import Redux selector
import { ChevronRight } from "lucide-react";
import fetchFileJSON from "../../utils/fetchFileJSON";
import fetchFile from "../../utils/fetchFile";
import parseExcel from "../../utils/parseExcel";
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
    className="dark:bg-[#1a1f2e] rounded-lg p-1.5 sm:p-2 md:p-2.5 dark:text-white"
    style={{
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
    }}
  >
    <h2 className="text-sm font-semibold mb-1 flex justify-between items-center">
      {title}
    </h2>
    <div className="flex items-center gap-1.5 mb-1">
      <div>
        <h3 className="text-xs font-semibold dark:text-white">{stock}</h3>
        <p className="text-xs text-gray-400 line-clamp-1">{description}</p>
      </div>
    </div>
    <div className="flex gap-1 flex-wrap">
      <div className="px-2 py-1 rounded-full text-xs bg-[#14AE5C1A] text-[#7EF36B] border border-[#14AE5C]">
        ROI - {roi}
      </div>
      <div className="px-2 py-1 rounded-full text-xs bg-[#8B5CF61A] text-[#C4B5FD] border border-[#8B5CF6]">
        Sentiment Score - {sentimentScore}
      </div>
      <div className="px-2 py-1 rounded-full text-xs bg-[#F59E0B1A] text-[#FCD34D] border border-[#F59E0B]">
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
  const [loading, setLoading] = useState(true);

  // 🔹 Get region and market from Redux store
  const region = useSelector((state) => state.region);
  const market = useSelector((state) => state.market);

  // ✅ Determine container name dynamically
  let containerName = "";
  if (region === "india") {
    containerName = "sgaiindia";
  } else if (region === "usa") {
    containerName =
      market === "NASDAQ" ? "nasdaq" : market === "NYSE" ? "nyse" : "NYSE";
  }

  useEffect(() => {
    const getNewsData = async () => {
      try {
        const data = await fetchFileJSON(
          containerName,
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
  }, [containerName]);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
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

        const topPick = formattedData.reduce((prev, current) =>
          prev.roi > current.roi ? prev : current
        );
        const highSentimentStock = formattedData.reduce((prev, current) =>
          prev.sentimentScore > current.sentimentScore ? prev : current
        );
        const lowRiskStock = formattedData.reduce((prev, current) =>
          prev.volatility < current.volatility ? prev : current
        );

        setStockData({
          topPick: {
            stock: topPick.stockName,
            description: `Strong quarterly earnings and positive sentiment drive this stock.`,
            roi: `${topPick.roi} RS in 1 Week`,
            sentimentScore: topPick.sentimentScore,
            volatility: topPick.volatility,
          },
          highSentiment: {
            stock: highSentimentStock.stockName,
            description: `Strong quarterly earnings and positive sentiment drive this stock.`,
            roi: `${highSentimentStock.roi} RS in 1 Week`,
            sentimentScore: highSentimentStock.sentimentScore,
            volatility: highSentimentStock.volatility,
          },
          lowRisk: {
            stock: lowRiskStock.stockName,
            description: `Strong quarterly earnings and positive sentiment drive this stock.`,
            roi: `${lowRiskStock.roi} RS in 1 Week`,
            sentimentScore: lowRiskStock.sentimentScore,
            volatility: lowRiskStock.volatility,
          },
        });
      } catch (error) {
        console.error("Error fetching or parsing file:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const intervalId = setInterval(fetchStockData, 3600000);
    return () => clearInterval(intervalId);
  }, [containerName]);

  if (loading) {
    return <Loading />;
  }  return (  <div className="flex flex-col h-full gap-1.5 lg:gap-2 overflow-hidden">
      <div className="flex flex-col md:flex-col lg:flex-col gap-1.5 lg:gap-2 flex-shrink-0">
        <StockCard {...stockData.topPick} title="Top Pick for Today" />
        <StockCard {...stockData.highSentiment} title="High Sentiment Stock" />
        <StockCard {...stockData.lowRisk} title="Low Risk Option" />
      </div>      <div
        className="h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[400px] dark:bg-[#1a1f2e] rounded-lg p-2 dark:text-white scrollbar-hide"
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        }}>        <h2 className="text-md font-semibold mb-1">News and Events</h2>        <div className="h-[calc(100%-2rem)] overflow-y-auto rounded-lg"><ul className="space-y-0.5 p-1">
            {newsHeadlines.map((news, index) => (
              <li
                key={index}
                className="group flex items-center justify-between hover:bg-gray-800 rounded-lg py-1 px-2 transition-colors duration-200 cursor-pointer"
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
