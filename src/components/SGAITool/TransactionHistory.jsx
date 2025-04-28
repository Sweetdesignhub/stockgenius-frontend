import { useState } from "react";
import { FiSearch, FiDownload, FiPlus, FiGrid } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import imgs from "../../assets/ZeroTransactionBull.jpg";

// ZeroTransactionBull.jpg

const TransactionHistory = ({ transactions, onMagnifyToggle }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme(); // Get the current theme (light or dark)
  console.log("Trans", transactions);
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.Ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    const headers = [
      "Index",
      "Timestamp",
      "Ticker",
      "Action",
      "Price",
      "Qty",
      "Cash Balance",
      "PnL_Percent",
      "Buy_Price",
    ];

    const rows = transactions.map((t) => [
      // t.id,
      t.Timestamp,
      t.Ticker,
      t.Action,
      t.Price,
      t.Qty,
      t.Cash_Balance,
      t.PnL_Percent,
      t.Buy_Price,
    ]);
    console.log("rows are;", rows);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell}"`
                : cell
            )
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMagnifyClick = () => {
    if (onMagnifyToggle) {
      onMagnifyToggle("TransactionHistory"); // Notify parent
    }
  };

  const EmptyState = () => (
    <div className="relative w-full h-80 rounded-lg overflow-hidden">
      {/* Background Image */}
      <img
        src={imgs}
        alt="No transactions"
        className="w-full h-full object-cover"
      />

      {/* Text Overlay - Left-aligned */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-start justify-center p-8 text-left">
        <p
          className={`text-base max-w-md ${
            theme === "dark" ? "text-gray-200" : "text-gray-100"
          }`}
        >
          Have you ever looked at a stock chart and thought... 'If only I had
          invested then...'?
          <br />
          <br />
          Or wondered, How much could I have gained?
          <br />
          <br />
          This tool doesn't just simulate trades — it brings your missed
          opportunities, uncertain decisions, and future plans into a real,
          visual experience.
          <br />
          <br />
          So you can trade smarter, with clarity and confidence
        </p>
      </div>
    </div>
  );
  return (
    <div
      className={`p-4 rounded-xl shadow-lg ${
        theme === "dark"
          ? "border border-[0.73px]  border-blue-500 shadow-lg shadow-[inset_0_0_8px_2px_rgba(96,165,250,0.6)]"
          : "bg-white"
      }`}
      style={{
        borderImage: `linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%),
                   linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)),
                   linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)`,
        borderImageSlice: 1,
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Transaction History
        </h2>

        <div className="relative w-40">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-8 pr-4 py-1 rounded-full ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200"
            } text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <FiSearch
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } cursor-pointer`}
            size={14}
            onClick={handleMagnifyClick}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-full ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
            onClick={handleDownloadCSV}
          >
            <FiDownload size={16} />
          </button>

          <button
            className={`p-2 rounded-full ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            <FiPlus size={16} />
          </button>

          <button
            className={`p-2 rounded-full ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } transition-colors`}
          >
            <FiGrid size={16} />
          </button>
        </div>
      </div>

      {/* <div className="overflow-x-auto"> */}
      <div
        className={`overflow-x-auto ${
          filteredTransactions.length >= 10
            ? "max-h-[400px] overflow-y-auto"
            : ""
        }`}
      >
        {filteredTransactions.length === 0 ? (
          <EmptyState />
        ) : (
          <table
            className={`min-w-full  ${
              theme === "dark" ? "divide-gray-700" : "divide-gray-300"
            }`}
          >
            <thead>
              <tr>
                {[
                  // "Index",
                  "Timestamp",
                  "Ticker",
                  "Action",
                  "Price",
                  "Qty",
                  "Cash Balance",
                  "PnL_Percent",
                  "Buy_Price",
                ].map((title) => (
                  <th
                    key={title}
                    className={`px-3 py-2 text-left text-xs font-medium ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    } uppercase tracking-wider`}
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={` ${
                theme === "dark" ? "divide-gray-700" : "divide-gray-300"
              }`}
            >
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.timestamp}
                  className={`hover:${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  {/* <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {transaction.id}
                </td> */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.Timestamp}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-cyan-400">
                    {transaction.Ticker}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-green-400">
                    {transaction.Action}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.Price}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.Qty}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.Cash_Balance}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.PnL_Percent}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {transaction.Buy_Price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
