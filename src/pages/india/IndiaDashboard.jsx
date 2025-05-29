/**
 * File: IndiaDashboard
 * Description: This component handles the display of top gainers and top losers, including order placing functionality for both "Buy" and "Sell" actions based on the selected broker (Fyers or Zerodha).
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React, { useEffect, useState } from "react";
import fetchFile from "../../utils/fetchFile.js";
import parseExcel from "../../utils/parseExcel";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/Error";
import Table from "../../components/dashboard/Table";
import { useSelector } from "react-redux";
import Modal from "../../components/common/Modal";
import BrokerModal from "../../components/brokers/BrokerModal";
import api from "../../config.js";

const containerName = "sgaiindia";
const gainerFile = "Realtime_Reports/top_gainers.xlsx";
const loserFile = "Realtime_Reports/top_losers.xlsx";

const IndiaDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gainersData, setGainersData] = useState([]);
  const [losersData, setLosersData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productType, setProductType] = useState("CNC");
  const [modalOpen, setModalOpen] = useState(false);
  const [brokerModalOpen, setBrokerModalOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const fyersAccessToken =
    useSelector((state) => state.fyers) ||
    localStorage.getItem("fyers_access_token");
  const zerodhaAccessToken =
    useSelector((state) => state.zerodha) ||
    localStorage.getItem("zerodha_access_token");

  const fetchData = async () => {
    try {
      const [gainersFileData, losersFileData] = await Promise.all([
        fetchFile(containerName, gainerFile),
        fetchFile(containerName, loserFile),
      ]);

      const gainersJsonData = parseExcel(gainersFileData);
      const losersJsonData = parseExcel(losersFileData);

      setGainersData(gainersJsonData);
      setLosersData(losersJsonData);
    } catch (error) {
      setError(error.message);
    } finally {
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

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setActionType(null);
  };

  const closeBrokerModal = () => {
    setBrokerModalOpen(false);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  const topGainersColumns = Object.keys(gainersData[0] || {});
  const topLosersColumns = Object.keys(losersData[0] || {});

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative page-scrollbar">
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
          <div className="h-[82vh] overflow-y-auto overflow-x-hidden py-5 px-5 flex flex-col overflow-auto rounded-2xl">
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
          placeOrder={handlePlaceOrder}
          handleInputChange={handleInputChange}
          handleProductTypeChange={handleProductTypeChange}
        />
        <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
      </div>
    </div>
  );
};

export default IndiaDashboard;
