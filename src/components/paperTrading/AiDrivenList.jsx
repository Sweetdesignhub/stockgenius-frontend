// function AiDrivenList() {
//   const tableData = [
//     {
//       symbol: "RELIANCE",
//       stockName: "Reliance Industries",
//       roi: "3.5%",
//       sentimentScore: "80",
//       change: "+0.92%",
//       price: "₹2,500.00",
//       prediction: "Buy",
//     },
//     {
//       symbol: "HDFCBANK",
//       stockName: "HDFC Bank",
//       roi: "4.2%",
//       sentimentScore: "75",
//       change: "+1.10%",
//       price: "₹1,640.50",
//       prediction: "Buy",
//     },
//     {
//       symbol: "TCS",
//       stockName: "Tata Consultancy Services",
//       roi: "5.1%",
//       sentimentScore: "82",
//       change: "-0.56%",
//       price: "₹3,450.20",
//       prediction: "Sell",
//     },
//     {
//       symbol: "INFY",
//       stockName: "Infosys",
//       roi: "6.0%",
//       sentimentScore: "88",
//       change: "+2.45%",
//       price: "₹1,420.30",
//       prediction: "Buy",
//     },
//     {
//       symbol: "ITC",
//       stockName: "ITC Limited",
//       roi: "4.5%",
//       sentimentScore: "76",
//       change: "+0.95%",
//       price: "₹380.20",
//       prediction: "Buy",
//     },
//     {
//       symbol: "SBIN",
//       stockName: "State Bank of India",
//       roi: "5.8%",
//       sentimentScore: "90",
//       change: "+1.25%",
//       price: "₹560.80",
//       prediction: "Buy",
//     },
//     {
//       symbol: "HCLTECH",
//       stockName: "HCL Technologies",
//       roi: "3.2%",
//       sentimentScore: "70",
//       change: "-1.15%",
//       price: "₹1,090.40",
//       prediction: "Sell",
//     },
//     {
//       symbol: "WIPRO",
//       stockName: "Wipro",
//       roi: "4.0%",
//       sentimentScore: "73",
//       change: "+0.85%",
//       price: "₹610.30",
//       prediction: "Buy",
//     },
//     {
//       symbol: "ADANIENT",
//       stockName: "Adani Enterprises",
//       roi: "7.5%",
//       sentimentScore: "95",
//       change: "+3.50%",
//       price: "₹2,020.00",
//       prediction: "Buy",
//     },
//     {
//       symbol: "BHARTIARTL",
//       stockName: "Bharti Airtel",
//       roi: "5.0%",
//       sentimentScore: "84",
//       change: "+1.90%",
//       price: "₹820.40",
//       prediction: "Buy",
//     },
//     {
//       symbol: "TATAMOTORS",
//       stockName: "Tata Motors",
//       roi: "6.8%",
//       sentimentScore: "89",
//       change: "-0.20%",
//       price: "₹520.60",
//       prediction: "Sell",
//     },
//     {
//       symbol: "ONGC",
//       stockName: "Oil & Natural Gas Corp.",
//       roi: "3.7%",
//       sentimentScore: "77",
//       change: "+0.55%",
//       price: "₹170.10",
//       prediction: "Buy",
//     },
//     {
//       symbol: "LT",
//       stockName: "Larsen & Toubro",
//       roi: "4.9%",
//       sentimentScore: "81",
//       change: "+1.40%",
//       price: "₹2,010.50",
//       prediction: "Buy",
//     },
//     {
//       symbol: "KOTAKBANK",
//       stockName: "Kotak Mahindra Bank",
//       roi: "5.3%",
//       sentimentScore: "85",
//       change: "+2.10%",
//       price: "₹1,860.80",
//       prediction: "Buy",
//     },
//     {
//       symbol: "BAJFINANCE",
//       stockName: "Bajaj Finance",
//       roi: "6.2%",
//       sentimentScore: "92",
//       change: "+3.20%",
//       price: "₹6,850.30",
//       prediction: "Buy",
//     },
//     {
//       symbol: "ULTRACEMCO",
//       stockName: "UltraTech Cement",
//       roi: "4.3%",
//       sentimentScore: "79",
//       change: "-0.85%",
//       price: "₹7,100.60",
//       prediction: "Sell",
//     },
//     {
//       symbol: "ASIANPAINT",
//       stockName: "Asian Paints",
//       roi: "5.1%",
//       sentimentScore: "87",
//       change: "+1.25%",
//       price: "₹3,200.70",
//       prediction: "Buy",
//     },
//     {
//       symbol: "SUNPHARMA",
//       stockName: "Sun Pharmaceutical",
//       roi: "3.8%",
//       sentimentScore: "72",
//       change: "-1.20%",
//       price: "₹1,070.80",
//       prediction: "Sell",
//     },
//     {
//       symbol: "DRREDDY",
//       stockName: "Dr. Reddy's Labs",
//       roi: "4.7%",
//       sentimentScore: "83",
//       change: "+1.75%",
//       price: "₹4,530.20",
//       prediction: "Buy",
//     },
//     {
//       symbol: "MARUTI",
//       stockName: "Maruti Suzuki",
//       roi: "5.6%",
//       sentimentScore: "91",
//       change: "+2.80%",
//       price: "₹8,020.90",
//       prediction: "Buy",
//     },
//   ];

//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredData = tableData.filter((row) =>
//     Object.values(row).some((value) =>
//       String(value).toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   const handleSell = (row) => {
//     console.log("Sell clicked:", row);
//     // Add your sell logic here
//   };

//   const handleBuy = (row) => {
//     console.log("Buy clicked:", row);
//     // Add your buy logic here
//   };

//   return (
//     <div className="auth p-3 rounded-lg flex flex-col h-full">
//     {/* Header Section */}
//     <div className="flex-shrink-0 justify-between flex items-center border-b border-[#FFFFFF1A] pb-3 mb-4">
//       <h1 className="text-white font-semibold text-md">AiDrivenList</h1>
//       <input
//         type="text"
//         placeholder="Search"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="bg-transparent text-white font-semibold text-sm border rounded-xl px-2 py-[1px]"
//       />
//       <div className="flex justify-center items-center gap-2">
//         {[
//           "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F4c56b483dd394414b5982322d44bf98e",
//           "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F4b48f9890ad74ea382d0442c99984703",
//           "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9beaf57f583b4227af1b90812d986254",
//           "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb586c1f789ea41c5bda6b16644f3a571",
//         ].map((src, index) => (
//           <img key={index} className="h-6 w-6 cursor-pointer" src={src} alt="icon" />
//         ))}
//       </div>
//     </div>

//     {/* Table Section */}
//     <div className="flex-grow overflow-auto">
//       {filteredData.length > 0 ? (
//         <table className="w-full text-sm text-left text-white bg-transparent">
//           <thead>
//             <tr className="text-sm">
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Symbol</td>
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Stock Name</td>
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">ROI</td>
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Sentiment Score</td>
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Change</td>
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Price</td>
//               <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Prediction</td>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((row, index) => (
//               <tr key={index} className="hover:bg-[#FFFFFF0A] transition duration-200 text-sm">
//                 <td className="px-2 text-xs py-2">{row.symbol}</td>
//                 <td className="px-2 text-xs py-2">{row.stockName}</td>
//                 <td className="px-2 text-xs py-2">{row.roi}</td>
//                 <td className="px-2 text-xs py-2">{row.sentimentScore}</td>
//                 <td className={`px-2 py-1 ${row.change.startsWith("-") ? "text-red-500" : "text-green-500"}`}>
//                   {row.change}
//                 </td>
//                 <td className="px-2 py-2">{row.price}</td>
//                 <td className="px-2 py-2">
//                   {row.prediction === "Buy" ? (
//                     <button
//                       onClick={() => handleBuy(row)}
//                       className="text-[10px] font-semibold font-[poppins] px-2  rounded-xl text-center border border-[#0EBC34] bg-[#0EBC34] text-[#FFFFFF] dark:border-[#14AE5C] dark:bg-[#14AE5C1A] dark:text-[#7EF36B]"
//                     >
//                       Buy
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleSell(row)}
//                       className="text-[10px] font-semibold font-[poppins] px-2  rounded-xl text-center border border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
//                     >
//                       Sell
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-center text-gray-500 text-sm">No results found</p>
//       )}
//     </div>
//   </div>

//   );
// }

// export default AiDrivenList;

import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import fetchFile from "../../utils/india/fetchFile";
import parseExcel from "../../utils/india/parseExcel";
import Loading from "../common/Loading";

function AiDrivenList() {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("AI Driven Stocks");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const bucketName = "automationdatabucket";
        const fileName = "Realtime_Reports/Final_Report.xlsx";
        const fileBuffer = await fetchFile(bucketName, fileName);
        const jsonData = parseExcel(fileBuffer);

        const formattedData = jsonData.map((row) => ({
          symbol: row.Ticker,
          stockName: row["Company Name"],
          roi: parseFloat(row.ROI),
          sentimentScore: row["Sentiment Score"],
          price: `₹${row["LastTradedPrice"]}`,
          prediction: row.ReinforcedDecision === "Buy" ? "Buy" : "Sell",
        }));

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
  }, []);

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSell = (row) => {
    console.log("Sell clicked:", row);
  };

  const handleBuy = (row) => {
    console.log("Buy clicked:", row);
  };

  return (
    <div className="auth p-3 rounded-lg flex flex-col h-full relative">
      {/* Header Section */}
      <div className="flex-shrink-0 justify-between flex items-center border-b border-[#FFFFFF1A] pb-3 mb-4">
        <h1 className="text-white font-semibold text-md">AIDrivenList</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white font-semibold text-sm border rounded-xl px-2 py-[1px]"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="p-1 hover:bg-[#FFFFFF1A] rounded-md transition-colors"
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
          {showFilter && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
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
                        onChange={(e) => setSelectedFilter(e.target.value)}
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

      {/* Table Section */}
      <div className="flex-grow overflow-auto">
        {isLoading ? (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <Loading />
          </div>
        ) : filteredData.length > 0 ? (
          <table className="w-full text-sm text-left text-white bg-transparent">
            <thead>
              <tr className="text-sm">
                <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Symbol</td>
                <td className="px-2 text-xs text-[#FFFFFFD9] py-2">
                  Stock Name
                </td>
                <td className="px-2 text-xs text-[#FFFFFFD9] py-2">ROI</td>
                <td className="px-2 text-xs text-[#FFFFFFD9] py-2 whitespace-nowrap">
                  Sentiment Score
                </td>
                <td className="px-2 text-xs text-[#FFFFFFD9] py-2">Price</td>
                <td className="px-2 text-xs text-[#FFFFFFD9] py-2">
                  Prediction
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#FFFFFF0A] transition duration-200 text-sm"
                >
                  <td className="px-2 text-xs py-2">{row.symbol}</td>
                  <td
                    className="px-2 text-xs py-2"
                    style={{ color: "#4882F3" }}
                  >
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
                  <td className="px-2 py-2">{row.price}</td>
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
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 text-sm">No results found</p>
        )}
      </div>
    </div>
  );
}

export default AiDrivenList;