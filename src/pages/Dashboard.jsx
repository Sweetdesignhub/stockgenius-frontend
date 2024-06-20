import React, { useEffect, useState } from "react";
import fetchFile from "../utils/fetchFile";
import parseExcel from "../utils/parseExcel";
import Loading from "../components/common/Loading";
import ErrorComponent from "../components/common/Error";
import Table from "../components/dashboard/Table";
import BrokerForm from "../components/dashboard/BrokerForm";
import Modal from "../components/common/Modal"; // Import the Modal component

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gainersData, setGainersData] = useState([]);
  const [losersData, setLosersData] = useState([]);
  const bucketName = "automationdatabucket";
  const gainerFile = "Realtime_Reports/top_gaineres.xlsx";
  const loserFile = "Realtime_Reports/top_losers.xlsx";

  const [selectedOption, setSelectedOption] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchData = async () => {
    try {
      const [gainersFileData, losersFileData] = await Promise.all([
        fetchFile(bucketName, gainerFile),
        fetchFile(bucketName, loserFile),
      ]);
      const gainersJsonData = parseExcel(gainersFileData);
      const losersJsonData = parseExcel(losersFileData);
      setGainersData(gainersJsonData);
      setLosersData(losersJsonData);
      setLoading(false);
      // console.log("Data fetched and updated");
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Error fetching and parsing file:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // interval to fetch data every 10 minutes
    const intervalId = setInterval(fetchData, 600000); // 600000 milliseconds = 10 minutes
    // console.log("Interval set to fetch data every 10 minutes");

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleBuy = (row) => {
    setSelectedRow(row);
    // console.log('buy', row);
    setActionType("buy");
    setQuantity(1); // Reset quantity
    setModalOpen(true);
  };

  const handleSell = (row) => {
    setSelectedRow(row);
    // console.log('sell',row);
    setActionType("sell");
    setQuantity(1); // Reset quantity
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setActionType(null);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  const topGainersColumns = Object.keys(gainersData[0] || {});
  const topLosersColumns = Object.keys(losersData[0] || {});

  return (
    <div className="min-h-screen lg:px-32 p-4 relative">
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F87dfd2fd4eea4f378d9e578d4c5dd7d0"
        alt="bull"
      />
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F9815d9f59dfd4f65b9e50d5dcbb0152c"
        alt="bear"
      />

      <div className="bg-white table-main rounded-2xl">
        <div className="py-5 px-5 flex flex-col overflow-auto rounded-2xl">
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            <Table
              title="Top Gainers"
              data={gainersData}
              columns={topGainersColumns}
              buttonLabel="BUY"
              roiColor="text-[#1ECB4F]"
              buttonAction={handleBuy}
              buttonColor="text-[#37DD1C]"
              actionButtonColor="border-[#0EBC34] bg-[#0EBC34] text-[#FFFFFF] dark:border-[#14AE5C] dark:bg-[#14AE5C1A] dark:text-[#7EF36B]"
            />
            <Table
              title="Top Losers"
              data={losersData}
              columns={topLosersColumns}
              buttonLabel="SELL"
              roiColor="text-[#CB2C2C]"
              buttonAction={handleSell}
              buttonColor="text-[#FF0000]"
              actionButtonColor=" border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
            />
          </div>
          <div className="flex flex-col h-3/10 news-table rounded-lg p-4 mt-6">
            <BrokerForm
              selectedOption={selectedOption}
              handleOptionSelect={handleOptionSelect}
            />
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

export default Dashboard;
