// import React, { useEffect, useState } from "react";
// import fetchFile from "../utils/fetchFile";
// import parseExcel from "../utils/parseExcel";
// import Loading from "../components/common/Loading";
// import ErrorComponent from "../components/common/Error";
// import FyersBuyButton from "../components/FyersBuyButton";
// import Speedometer from "../components/Speedometer";

// function AiNewsAnalysis() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [quantities, setQuantities] = useState([]);

//   // Function to handle quantity change for a specific row
//   const handleQuantityChange = (event, rowIndex) => {
//     const newQuantities = [...quantities];
//     newQuantities[rowIndex] = parseInt(event.target.value);
//     setQuantities(newQuantities);
//   };

//   const bucketName = "daily-report-analysis";
//   const fileName = "Final_Report.xlsx";

//   const fetchData = async () => {
//     try {
//       const fileData = await fetchFile(bucketName, fileName);
//       const jsonData = parseExcel(fileData);
//       setData(jsonData);
//       setLoading(false);
//       console.log("Data fetched and updated");
//     } catch (error) {
//       setError(error.message);
//       setLoading(false);
//       console.error("Error fetching and parsing file:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//     // Set up an interval to fetch data every 10 minutes
//     const intervalId = setInterval(fetchData, 600000); // 600000 milliseconds = 10 minutes
//     console.log("Interval set to fetch data every 10 minutes");

//     // Clean up the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, []);

//   // Function to handle buy button click
//   // const handleBuy = (rowIndex) => {
//   //   console.log("Buy button clicked for row:", rowIndex);
//   // };

//   // Function to handle sell button click
//   // const handleSell = (rowIndex) => {
//   //   console.log("Sell button clicked for row:", rowIndex);
//   // };

//   const getColorClass = (value) => {
//     if (value <= 30) {
//       return "text-red-500";
//     } else if (value > 30 && value <= 70) {
//       return "text-orange-300";
//     } else {
//       return "text-green-500";
//     }
//   };

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) {
//     return <ErrorComponent error={error} />;
//   }

//   // columns to be shown in the first table (first six columns)
//   const firstTableColumns = Object.keys(data[0] || {}).slice(0, 6);

//   // columns to be shown in the second table (remaining columns)
//   const secondTableColumns = Object.keys(data[0] || {}).slice(6);

//   return (
//     <div className=" min-h-screen lg:px-32 p-4 relative">
//       <img
//         className="absolute -z-10 top-1/2 transform  -translate-y-1/2 left-0"
//         src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb11e6ef243fc4e75b890a82314cbe787"
//         alt=""
//       />
//       <img
//         className="absolute -z-10 top-1/2 transform  -translate-y-1/2 right-0"
//         src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fb9c1ea2fee934792b160d13834194b0a"
//         alt=""
//       />

//       <div className=" bg-white p-4 table-main   rounded-2xl  dark:bg-opacity-10 dark:backdrop-filter dark:backdrop-blur-lg dark:backdrop-brightness-125 dark:border dark:border-white dark:border-opacity-20 dark:shadow-lg">
//         <div className="p-4">
//           <h1 className="font-semibold font-[poppins] text-xl">
//             NSE 100 AI Insights
//           </h1>
//         </div>
//         <div className="p-4 flex news-table h-[80vh] overflow-scroll rounded-2xl">
//           {/* First Table */}
//           <div style={{ maxWidth: "40%" }}>
//             <div className="overflow-x-auto">
//               <table className="table-auto w-full bg-transparent">
//                 {/* Table header */}
//                 <thead>
//                   <tr>
//                     {firstTableColumns.map((column, index) => (
//                       <th
//                         key={index}
//                         className="px-3 py-3 text-left text-xs font-medium  tracking-wider"
//                       >
//                         {column.split(" ")[0]}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 {/* Table body */}
//                 <tbody>
//                   {data.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {firstTableColumns.map((column, colIndex) => (
//                         <td
//                           key={colIndex}
//                           className={`h-20   capitalize px-3 whitespace-nowrap ${
//                             colIndex === 1
//                               ? "text-[#4882F3]"
//                               : colIndex === 2
//                               ? "text-[#1ECB4F]"
//                               : colIndex === 5
//                               ? getColorClass(parseInt(row[column]))
//                               : ""
//                           }`}
//                         >
//                           {colIndex === 4 ? (
//                             <Speedometer value={parseFloat(row[column])} />
//                           ) : (
//                             row[column]
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="flex-1" style={{ maxWidth: "45%" }}>
//             {/* Second Table */}
//             <div className="overflow-x-auto">
//               <div className="overflow-y-auto h-full">
//                 <table className="table-auto border-collapse w-full bg-transparent">
//                   {/* Table header */}
//                   <thead>
//                     <tr>
//                       {secondTableColumns.map((column, index) => (
//                         <th
//                           key={index}
//                           className="min-w-28  py-3 text-left text-xs font-medium  tracking-wider"
//                         >
//                           {column}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   {/* Table body */}
//                   <tbody>
//                     {data.map((row, rowIndex) => (
//                       <tr key={rowIndex}>
//                         {secondTableColumns.map((column, colIndex) => (
//                           <td
//                             key={colIndex}
//                             className={`h-20  capitalize px-4 whitespace-nowrap ${
//                               colIndex === 0
//                                 ? "text-[#1ECB4F] font-semibold"
//                                 : ""
//                             }`}
//                           >
//                             {row[column]}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           <div className="flex-1" style={{ maxWidth: "15%" }}>
//             {/* Third Table */}
//             <div className="overflow-x-auto">
//               <div className="overflow-y-auto h-full">
//                 <table className="table-auto border-collapse w-full bg-transparent">
//                   {/* Table header */}
//                   <thead>
//                     <tr>
//                       <th className="px-3 py-3 text-left text-xs font-medium  tracking-wider">
//                         Prediction
//                       </th>
//                     </tr>
//                   </thead>
//                   {/* Table body */}
//                   <tbody>
//                     {data.map((row, rowIndex) => (
//                       <tr key={rowIndex}>
//                         <td className="h-20 px-2 whitespace-nowrap ">
//                           <div className="flex items-center justify-around">
//                             <input
//                               type="number"
//                               value={quantities[rowIndex] || 1}
//                               onChange={(event) =>
//                                 handleQuantityChange(event, rowIndex)
//                               }
//                               className="border-gray-300 text-black rounded-md w-10 pl-2"
//                             />
//                             <div>
//                               <FyersBuyButton
//                                 apiKey="SH4XR0GZIF-100"
//                                 symbol={`NSE:${row[firstTableColumns[0]]}-EQ`}
//                                 product="INTRADAY"
//                                 quantity={quantities[rowIndex] || 1}
//                                 orderType="MARKET"
//                                 price={101}
//                                 transactionType="BUY"
//                                 ticker={`NSE:${row[firstTableColumns[0]]}-EQ`}
//                               />
//                             </div>
//                             {/*
//                             <button
//                               onClick={() => handleBuy(rowIndex)}
//                               className="bg-[#14AE5C1A] text-xs px-2 py-1 rounded-xl text-center border border-[#14AE5C]"
//                             >
//                               Buy
//                             </button>

//                             <button
//                               onClick={() => handleSell(rowIndex)}
//                               className="bg-[#FFA6291A] text-xs px-2 py-1 rounded-xl text-center border border-[#FFA629]"
//                             >
//                               Sell
//                             </button> */}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AiNewsAnalysis;

import React, { useEffect, useState } from "react";
import fetchFile from "../../utils/india/fetchFile";
import parseExcel from "../../utils/india/parseExcel";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/Error";
import Speedometer from "../../components/common/Speedometer";
import Modal from "../../components/common/Modal";
import * as XLSX from "xlsx";

function NSE100AiInsights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const bucketName = "automationdatabucket";
  const fileName = "Realtime_Reports/Final_Report.xlsx";
  const timeFileName = "Realtime_Reports/last_run_time.json";

  const fetchData = async () => {
    try {
      const fileData = await fetchFile(bucketName, fileName);
      const jsonData = parseExcel(fileData);
      setData(jsonData);

      // Fetch the last updated time
      const timeFileData = await fetchFile(bucketName, timeFileName);

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
    const intervalId = setInterval(fetchData, 600000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBuy = (row) => {
    setSelectedRow(row);
    setActionType("buy");
    setQuantity(1); // Reset quantity
    setModalOpen(true);
  };

  const handleSell = (row) => {
    setSelectedRow(row);
    setActionType("sell");
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

  const firstTableColumns = Object.keys(data[0] || {});
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
            NSE 100 AI Insights
          </h1>
          <div className="flex items-center">
            <div className="mr-2 flex items-center">
              <h1 className="text-sm font-bold">At Close : &nbsp;</h1>
              <p className="text-xs font-semibold">{lastUpdated}</p>
            </div>
            <div class="relative group">
              <button
                onClick={downloadExcel}
                class="px-2 py-1 rounded-lg border border-gray-500"
              >
                <img
                  class="h-6 w-6"
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fd35fb8ea213444c79fa01fe0c5f4ebb0"
                  alt="Download excel"
                />
              </button>
              <span class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max bg-black text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Download excel
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 flex news-table h-[80vh] overflow-scroll rounded-2xl">
          {/* First Table */}
          <div className="lg:max-w-[92%] max-w-[75%]">
            <div className="overflow-x-auto">
              {/* <table className="table-auto w-full bg-transparent">
               
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
                          {colIndex === 4 ? (
                            <Speedometer value={parseFloat(row[column])} />
                          ) : (
                            row[column]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table> */}

              <table className="table-auto w-full bg-transparent">
                {/* Table header */}
                <thead>
                  <tr>
                    {dataTable.map(
                      (column, index) =>
                        index !== 4 && (
                          <th
                            key={index}
                            className="w-full py-3 px-2 text-left text-xs font-medium tracking-wider"
                          >
                            {column.split(" ")[0]}
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                {/* Table body */}
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {dataTable.map(
                        (column, colIndex) =>
                          colIndex !== 4 && (
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
                              {row[column]}
                            </td>
                          )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1 lg:max-w-[8%] max-w-[25%]">
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
                          const cellValue = row[column];
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
                                  Buy
                                </button>
                              )}
                              {isSell && (
                                <button
                                  onClick={() => handleSell(row)}
                                  className="text-xs font-semibold font[poppins] px-2 py-1 rounded-xl text-center border border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
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
        handleConfirm={handleConfirm}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export default NSE100AiInsights;
