import { useEffect, useState } from "react";
import fetchFile from "../../utils/fetchFile.js";
import parseExcel from "../../utils/parseExcel";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/Error";
import Table from "../../components/dashboard/Table";
import Modal from "../../components/common/Modal";
import { useSelector } from "react-redux";

function UsaDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gainersData, setGainersData] = useState([]);
  const [losersData, setLosersData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const market = useSelector((state) => state.market);

  let containerName = "";
  const gainerFile = "Realtime_Reports/top_gainers.xlsx";
  const loserFile = "Realtime_Reports/top_losers.xlsx";

  // Set containerName based on the market
  if (market === "NYSE") {
    containerName = "nyse";
  } else if (market === "NASDAQ") {
    containerName = "nasdaq";
  }

  // Fetch data from the bucket
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [gainersFileData, losersFileData] = await Promise.all([
        fetchFile(containerName, gainerFile),
        fetchFile(containerName, loserFile),
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

  // Use effect to fetch data and set an interval for periodic refresh
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 600000); // Refresh every 10 minutes
    return () => clearInterval(intervalId);
  }, [market]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Handle buy and sell actions
  const handleBuy = (row) => {
    // console.log("buy", row);
  };

  const handleSell = (row) => {
    // console.log("sell", row);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setActionType(null);
  };

  // Handle quantity change
  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  // Handle confirm action in the modal
  const handleConfirm = () => {
    // console.log(
    //   `${actionType} button confirmed for row:`,
    //   selectedRow,
    //   "Quantity:",
    //   quantity
    // );
    setModalOpen(false);
  };

  // Render loading component if data is still loading
  if (loading) {
    return <Loading />;
  }

  // Render error component if there was an error
  if (error) {
    return <ErrorComponent error={error} />;
  }

  const topGainersColumns = Object.keys(gainersData[0] || {});
  const topLosersColumns = Object.keys(losersData[0] || {});
  return (
    <div className="-z-10">
      <div className="min-h-fit lg:px-32 p-4 relative ">
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
        <div className="bg-white/5 dark:bg-[rgba(5,5,5,0.2)] backdrop-blur-md table-main rounded-2xl border border-white/10">
          <div className="h-[82vh] overflow-y-auto overflow-x-hidden py-5 px-5 flex flex-col overflow-auto rounded-2xl scrollbar-hide">
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
                actionButtonColor="border-[#FF0000] bg-[#FF0000] text-[#FFFFFF] dark:border-[#AE1414] dark:bg-[#AE14141A] dark:text-[#F36B6B]"
                isReversed={true}
              />
            </div>
          </div>
        </div>        <Modal
          isOpen={modalOpen}
          closeModal={closeModal}
          rowData={selectedRow}
          actionType={actionType}
          quantity={quantity}
          handleQuantityChange={handleQuantityChange}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}

export default UsaDashboard;
