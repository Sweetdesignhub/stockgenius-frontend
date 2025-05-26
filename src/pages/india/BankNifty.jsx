/**
 * File: BankNifty
 * Description: This component is part of the StockGenius platform and is responsible for displaying the latest insights
 * on the NSE 100 stocks based on AI-driven analysis. The component fetches data from an Excel file stored in
 * an S3 bucket, processes it, and displays it in a table format. Users can filter the data based on ROI and
 * company name, as well as sort the data in descending or ascending order by ROI.
 * The component also allows users to place buy and sell orders for selected stocks by interacting with the
 * Fyers or Zerodha APIs. A modal interface is used for order placement, and if the user is not logged in
 * with a broker, they are prompted to connect their account. Additionally, the last updated time for the
 * data is displayed, and users can download the data as an Excel file.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { useEffect, useState } from "react";
import fetchFile from "../../utils/fetchFile";
import parseExcel from "../../utils/parseExcel";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/Error";
import Modal from "../../components/common/Modal";
import * as XLSX from "xlsx";
import NotAvailable from "../../components/common/NotAvailable";
import BrokerModal from "../../components/brokers/BrokerModal";
import { useSelector } from "react-redux";
import api from "../../config";

function BankNifty() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productType, setProductType] = useState("CNC");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [roiFilter, setRoiFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  const [brokerModalOpen, setBrokerModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const fyersAccessToken =
    useSelector((state) => state.fyers) ||
    localStorage.getItem("fyers_access_token");
  const zerodhaAccessToken =
    useSelector((state) => state.zerodha) ||
    localStorage.getItem("zerodha_access_token");

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const containerName = "banknifty";
  const fileName = "Realtime_Reports/Final_Report.xlsx";
  const timeFileName = "Realtime_Reports/last_run_time.json";

  const fetchData = async () => {
    try {
      const fileData = await fetchFile(containerName, fileName);
      const jsonData = parseExcel(fileData);
      const sortedData = jsonData.sort(
        (a, b) => parseFloat(b.ROI) - parseFloat(a.ROI)
      );
      setData(sortedData);
      setFilteredData(sortedData);
      // Fetch the last updated time
      const timeFileData = await fetchFile(containerName, timeFileName);

      // Convert the ArrayBuffer to a string
      const decoder = new TextDecoder("utf-8");
      const timeFileString = decoder.decode(timeFileData);

      // Parse the string as JSON
      const parsedTimeData = JSON.parse(timeFileString);
      setLastUpdated(parsedTimeData.Time);

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = parseFloat(a.ROI);
      const valueB = parseFloat(b.ROI);
      return newSortOrder === "desc" ? valueB - valueA : valueA - valueB;
    });
    setFilteredData(sorted);
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 600000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filterAndSortData = () => {
      const filtered = data.filter((item) => {
        return (
          item["ROI"].toString().includes(roiFilter) &&
          item["Company Name"]
            .toLowerCase()
            .includes(companyFilter.toLowerCase())
        );
      });
      const sorted = filtered.sort((a, b) => {
        if (sortOrder === "desc") {
          return parseFloat(b.ROI) - parseFloat(a.ROI);
        } else {
          return parseFloat(a.ROI) - parseFloat(b.ROI);
        }
      });
      setFilteredData(sorted);
    };

    filterAndSortData();
  }, [roiFilter, companyFilter, data, sortOrder]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === "roiFilter") {
      setRoiFilter(value);
    } else if (name === "companyFilter") {
      setCompanyFilter(value);
    } else {
      setSelectedRow((prevRow) => ({
        ...prevRow,
        [name]: value,
      }));
    }
  };

  const handleBuy = (row) => {
    setSelectedRow(row);
    setActionType("buy");
    setQuantity(1); // Reset quantity

    if (fyersAccessToken || zerodhaAccessToken) {
      setModalOpen(true);
    } else {
      setBrokerModalOpen(true);
    }

    // setModalOpen(true);
  };

  const handleSell = (row) => {
    setSelectedRow(row);
    setActionType("sell");
    setQuantity(1); // Reset quantity
    if (fyersAccessToken || zerodhaAccessToken) {
      setModalOpen(true);
    } else {
      setBrokerModalOpen(true);
    }
  };

  const handlePlaceOrder = async () => {
    // console.log(
    //   `${actionType} button confirmed for row:`,
    //   selectedRow.Ticker,
    //   "Quantity:",
    //   quantity
    // );

    let apiUrl = "";
    let requestBody = {};

    // Build request based on selected broker
    if (fyersAccessToken) {
      apiUrl = `/api/v1/fyers/placeOrder/${currentUser.id}`;
      requestBody = {
        accessToken: fyersAccessToken,
        order: {
          symbol: `NSE:${selectedRow.Ticker}-EQ`,
          qty: quantity,
          type: 2,
          side: actionType === "buy" ? 1 : -1,
          productType: productType || "CNC",
          limitPrice: 0,
          stopPrice: 0,
          disclosedQty: 0,
          validity: "DAY",
          offlineOrder: false,
          stopLoss: 0,
          takeProfit: 0,
          orderTag: "stockgenius1",
        },
      };
    } else if (zerodhaAccessToken) {
      apiUrl = `/api/v1/zerodha/placeOrder/${currentUser.id}`;
      requestBody = {
        order: {
          exchange: selectedRow.exchange || "NSE",
          tradingsymbol: selectedRow.Ticker,
          transaction_type: actionType.toUpperCase(),
          quantity: quantity,
          product: productType === "INTRADAY" ? "MIS" : "CNC",
          order_type: selectedRow.orderType || "MARKET",
          price: 0,
          trigger_price: 0,
          validity: "DAY",
          tag: "STOCKGENIUS ORDER1",
        },
      };
    } else {
      alert("No access token found for the selected broker.");
      return;
    }

    try {
      // Send the POST request using axios
      const response = await api.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log(response);

      // Show success message
      if (response.data && response.status === 200) {
        alert(
          `Order placed successfully for ${selectedRow.Ticker} with quantity ${quantity}`
        );
        setModalOpen(false); // Close modal if open
      } else {
        throw new Error("Failed to place order, please check the input.");
      }
    } catch (error) {
      // Handle the error response
      let errorMessage = "An error occurred";

      // Extract the specific error message from the response
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message; // Get the specific message
      } else if (error.message) {
        // Handle network errors or other thrown errors
        errorMessage = error.message;
      }

      alert(`Order failed: ${errorMessage}`);
      console.error("Error placing order:", errorMessage);
      setModalOpen(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setActionType(null);
  };

  const closeBrokerModal = () => {
    setBrokerModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const getColorClass = (value) => {
    if (value <= 30) {
      return "text-red-500";
    } else if (value > 30 && value <= 70) {
      return "text-orange-300";
    } else {
      return "text-green-500";
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "NSE100_AI_Insights.xlsx");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  const firstTableColumns = Object.keys(data[0] || {}).filter(
    (column) => column !== "sentiment"
  );
  const dataTable = firstTableColumns.slice(0, firstTableColumns.length - 1);
  const secondTableColumns = Object.keys(data[0] || {});
  const decision = secondTableColumns.slice(secondTableColumns.length - 1);

  return (
    <div className="min-h-screen lg:px-32 p-4 relative">
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-0"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb11e6ef243fc4e75b890a82314cbe787"
        alt="bull"
      />
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-0"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb9c1ea2fee934792b160d13834194b0a"
        alt="bear"
      />

      <div className="bg-white p-4 table-main rounded-2xl">
        <div className="p-4 flex flex-col items-center justify-between lg:flex-row lg:items-center">
          <h1 className="font-semibold text-xl mb-4 lg:mb-0 lg:mr-4">
            Bank Nifty
          </h1>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <input
              type="text"
              name="roiFilter"
              value={roiFilter}
              onChange={handleFilterChange}
              placeholder="Filter by ROI"
              className="border p-1 rounded text-black w-full sm:w-auto"
            />
            <input
              type="text"
              name="companyFilter"
              value={companyFilter}
              onChange={handleFilterChange}
              placeholder="Filter by Company"
              className="border p-1 rounded text-black w-full sm:w-auto"
            />
          </div>
          <div className="flex mt-5 sm:mt-5 items-center">
            <div className="mr-2 flex items-center">
              <h1 className="text-sm font-bold">At Close : &nbsp;</h1>
              <p className="text-xs font-semibold">{lastUpdated}</p>
            </div>
            <div className="relative group">
              <button
                onClick={downloadExcel}
                className="px-2 py-1 rounded-lg border border-gray-500"
              >
                <img
                  className="h-6 w-6"
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd35fb8ea213444c79fa01fe0c5f4ebb0"
                  alt="Download excel"
                />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max bg-black text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Download excel
              </span>
            </div>
          </div>
        </div>
        <div className="p-2 sm:p-4 flex news-table h-[80vh] overflow-y-auto overflow-x-hidden rounded-2xl scrollbar-hide">
          {/* First Table */}
          <div className="lg:max-w-[88%] max-w-[75%]">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="table-auto w-full bg-transparent">
                {/* Table header */}
                <thead>
                  <tr>
                    {dataTable.map(
                      (column, index) =>
                        index !== 4 && (
                          <th
                            key={index}
                            className="w-full py-1 sm:py-3 px-1 sm:px-2 text-left text-[10px] sm:text-xs font-medium tracking-wider cursor-pointer"
                            onClick={column === "ROI" ? handleSort : undefined}
                          >
                            <div className="flex items-center w-max">
                              {column.split(" ")[0]}
                              {column === "ROI" && (
                                <span className="ml-0.5 sm:ml-1">
                                  {sortOrder === "desc" ? (
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="12"
                                      height="12"
                                      className="sm:w-4 sm:h-4"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                  ) : (
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="12"
                                      height="12"
                                      className="sm:w-4 sm:h-4"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {dataTable.map(
                          (column, colIndex) =>
                            colIndex !== 4 && (
                              <td
                                key={colIndex}
                                className={`h-12 sm:h-20 w-full min-w-16 sm:min-w-24 capitalize px-1 sm:px-2 text-[10px] sm:text-sm whitespace-nowrap ${
                                  colIndex === 1
                                    ? "text-[#4882F3]"
                                    : colIndex === 2
                                    ? "text-[#1ECB4F]"
                                    : colIndex === 5
                                    ? getColorClass(parseInt(row[column]))
                                    : colIndex === 6
                                    ? "text-[#1ECB4F] font-semibold"
                                    : ""
                                }`}
                              >
                                {row[column]}
                              </td>
                            )
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={Object.keys(data[0] || {}).length}
                        className="text-center py-4 sm:py-10"
                      >
                        <NotAvailable dynamicText="No data to display." />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Second Table */}
          <div className="flex-1 lg:max-w-[12%] max-w-[25%]">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="overflow-y-auto h-full scrollbar-hide">
                <table className="table-auto border-collapse w-full bg-transparent">
                  <thead>
                    <tr>
                      {decision.map((column, index) => (
                        <th
                          key={index}
                          className="w-full py-1 sm:py-3 px-1 sm:px-2 text-left text-[10px] sm:text-xs font-medium tracking-wider cursor-pointer"
                          onClick={column === "ROI" ? handleSort : undefined}
                        >
                          {column.split(" ")[0]}
                          {column === "ROI" && (
                            <span className="ml-1">
                              {sortOrder === "desc" ? "▼" : "▲"}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody>
                    {filteredData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {decision.map((column, colIndex) => {
                          if (column !== "ReinforcedDecision") return null; // Only render this column

                          const cellValue = row[column] || ""; // Default to empty string to prevent errors
                          const isSell =
                            typeof cellValue === "string" &&
                            cellValue.toLowerCase() === "sell";
                          const isBuy =
                            typeof cellValue === "string" &&
                            cellValue.toLowerCase() === "buy";

                          return (
                            <td
                              key={colIndex}
                              className="h-12 sm:h-20 capitalize px-1 sm:px-2 text-center whitespace-nowrap"
                            >
                              {isBuy && (
                                <button
                                  onClick={() => handleBuy(row)}
                                  className="text-[10px] sm:text-xs font-semibold font[poppins] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-center border border-[#0EBC34] bg-[#0EBC34] text-[#FFFFFF] dark:border-[#14AE5C] dark:bg-[#14AE5C1A] dark:text-[#7EF36B]"
                                >
                                  Buy
                                </button>
                              )}
                              {isSell && (
                                <button
                                  onClick={() => handleSell(row)}
                                  className="text-[10px] sm:text-xs font-semibold font[poppins] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-center border border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
                                >
                                  Sell
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        rowData={selectedRow}
        actionType={actionType}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        placeOrder={handlePlaceOrder}
        handleInputChange={handleInputChange}
        handleProductTypeChange={handleProductTypeChange}
      />

      <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
    </div>
  );
}

export default BankNifty;
