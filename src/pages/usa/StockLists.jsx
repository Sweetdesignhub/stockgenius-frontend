import { useEffect, useState } from "react";
import fetchFile from "../../utils/fetchFile.js";
import parseExcel from "../../utils/parseExcel";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/Error";
import Speedometer from "../../components/common/Speedometer";
import Modal from "../../components/common/Modal";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

function StockLists() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const market = useSelector((state) => state.market);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const getBucketAndFileName = () => {
    if (market === "NYSE") {
      return {
        containerName: "nyse",
        fileName: "Realtime_Reports/Final_Report.xlsx",
      };
    } else if (market === "NASDAQ") {
      return {
        containerName: "nasdaq",
        fileName: "Realtime_Reports/Final_Report.xlsx",
      };
    } else {
      return { containerName: "", fileName: "" };
    }
  };

  const timeFileName = "Realtime_Reports/last_run_time.json";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { containerName, fileName } = getBucketAndFileName();
      if (!containerName || !fileName) throw new Error("Invalid market selection");

      const fileData = await fetchFile(containerName, fileName);
      const jsonData = parseExcel(fileData);
      setData(jsonData);

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

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 600000); // Refresh every 10 minutes
    return () => clearInterval(intervalId);
  }, [market]); // Re-fetch data when the market changes

  const handleBuy = (row) => {
    setSelectedRow(row);
    console.log(row);
    setActionType("Buy");
    setQuantity(1); // Reset quantity
    setModalOpen(true);
  };

  const handleSell = (row) => {
    setSelectedRow(row);
    console.log(row);
    setActionType("Sell");
    setQuantity(1); // Reset quantity
    setModalOpen(true);
  };

  const handleConfirm = () => {
    console.log(
      `${actionType} button confirmed for row:`,
      selectedRow,
      "Quantity:",
      quantity
    );
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setActionType(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
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

  const renderMarketTitle = () => {
    if (market === "NYSE") {
      return (
        <h1 className="font-semibold font-[poppins] text-xl">
          NYSE 100 AI Insights
        </h1>
      );
    } else if (market === "NASDAQ") {
      return (
        <h1 className="font-semibold font-[poppins] text-xl">
          NASDAQ 100 AI Insights
        </h1>
      );
    }
    return null;
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const fileName = `${market}_100_AI_Insights.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getValue = (value) => {
    return value !== null && value !== undefined && value !== "" ? value : "NA";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!data.length) {
    return <div>No data available.</div>;
  }

  const firstTableColumns = Object.keys(data[0] || {});
  // const dataTable = firstTableColumns.slice(0, firstTableColumns.length - 1);
  const dataTable = firstTableColumns
    .slice(0, firstTableColumns.length - 1)
    .filter((_, index) => index !== 4);
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
        {/* <div className="p-4">{renderMarketTitle()}</div> */}
        <div className="p-4 flex flex-col items-center justify-between lg:flex-row lg:items-center">
          <h1 className="font-semibold text-xl mb-4 lg:mb-0 lg:mr-4">
            {renderMarketTitle()}
          </h1>
          <div className="flex items-center">
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
        <div className="p-4 flex news-table h-[80vh] overflow-scroll rounded-2xl">
          {/* First Table */}
          <div className="lg:max-w-[88%] max-w-[75%]">
            <div className="overflow-x-auto">
              <table className="table-auto w-full bg-transparent">
                <thead>
                  <tr>
                    {dataTable.map((column, index) => (
                      <th
                        key={index}
                        className="w-full py-3 px-2 text-left text-xs font-medium tracking-wider"
                      >
                        {column.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {dataTable.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`h-20 w-full min-w-24 capitalize px-2 whitespace-nowrap ${
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
                          {/* {colIndex === 4 ? (
                            <Speedometer
                              value={parseFloat(getValue(row[column]))}
                            />
                          ) : (
                            getValue(row[column])
                          )} */}
                          {getValue(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1 lg:max-w-[12%] max-w-[25%]">
            {/* Second Table */}
            <div className="overflow-x-auto">
              <div className="overflow-y-auto h-full">
                <table className="table-auto border-collapse w-full bg-transparent">
                  {/* Table header */}
                  <thead>
                    <tr>
                      {decision.map((column, index) => (
                        <th
                          key={index}
                          className="w-full px-2 text-center py-3 text-xs font-medium tracking-wider"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {decision.map((column, colIndex) => {
                          const cellValue = getValue(row[column]);
                          const isSell = cellValue.toLowerCase() === "sell";
                          const isBuy = cellValue.toLowerCase() === "buy";

                          return (
                            <td
                              key={colIndex}
                              className="h-20 capitalize px-2 text-center whitespace-nowrap"
                            >
                              {isBuy && (
                                <button
                                  onClick={() => handleBuy(row)}
                                  className="text-xs font-semibold font[poppins] px-2 py-1 rounded-xl text-center border border-[#0EBC34] bg-[#0EBC34] text-[#FFFFFF] dark:border-[#14AE5C] dark:bg-[#14AE5C1A] dark:text-[#7EF36B]"
                                >
                                  {cellValue}
                                </button>
                              )}
                              {isSell && (
                                <button
                                  onClick={() => handleSell(row)}
                                  className="text-xs font-semibold font[poppins] px-2 py-1 rounded-xl text-center border border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
                                >
                                  {cellValue}
                                </button>
                              )}
                              {!isBuy && !isSell && <span>{cellValue}</span>}
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

        <Modal isOpen={modalOpen} onClose={closeModal}>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              {actionType} Confirmation
            </h3>
            <p className="mb-4">
              Are you sure you want to {actionType} {selectedRow?.Symbol}?
            </p>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="border px-2 py-1 rounded-md w-16"
                min="1"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default StockLists;
