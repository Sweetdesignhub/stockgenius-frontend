/**
 * File: IndiaPortfolio
 * Description: This component serves as the main page for displaying a user's portfolio information for the Indian stock market. This component integrates multiple functionalities, such as displaying the user's broker account details, their stock holdings, and other financial data like funds, positions, and trades. It also manages user authentication and shows appropriate content based on the user's login state.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React, { useState, useEffect } from "react";
import AccountInfo from "../../components/brokers/fyers/AccountInfo";
import Header from "../../components/brokers/fyers/Header";
import StockDetails from "../../components/brokers/fyers/portfolio/StockDetails";
import BrokerModal from "../../components/brokers/BrokerModal";
import { useSelector } from "react-redux";
import Loading from "../../components/common/Loading";
import { useData } from "../../contexts/FyersDataContext";

function IndiaPortfolio() {
  const fyersAccessToken = useSelector((state) => state.fyers);
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZDoxIiwiZDoyIiwieDowIiwieDoxIiwieDoyIl0sImF0X2hhc2giOiJnQUFBQUFCb05wMUZyay01NlJiaWI4cTNPVktXOUdSQVJYVU1MaWlfT1lCbTFKamZHTWNCRllDTnNZMmpiNXlJam05SmpWVjA5SXdoUlNsT1kzZV9HUi1RRjEyaWoxV0t5T1Z4bUk5bnJFa0VpdEV4ejNsb3BQQT0iLCJkaXNwbGF5X25hbWUiOiIiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiI0OTBjMjEwNjUzZmVhNzQxYzJiYmJiNzVmMWY2MGUwOTIyNjk0OTNmY2Y4N2U0MTQ5YWY3Y2U5NCIsImlzRGRwaUVuYWJsZWQiOiJZIiwiaXNNdGZFbmFibGVkIjoiTiIsImZ5X2lkIjoiWVUwMTU4NSIsImFwcFR5cGUiOjEwMiwiZXhwIjoxNzQ4NDc4NjAwLCJpYXQiOjE3NDg0MDk2NjksImlzcyI6ImFwaS5meWVycy5pbiIsIm5iZiI6MTc0ODQwOTY2OSwic3ViIjoiYWNjZXNzX3Rva2VuIn0.1osHTuYYJ4k720Gv2ITpJLW__YNib2gGVDV2hUCWt_E"
  // console.log("inside india portfolio", fyersAccessToken);
  // 
  const [brokerModalOpen, setBrokerModalOpen] = useState(!fyersAccessToken);
  const { profile, holdings, funds, positions, trades, orders, loading } =
    useData();
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (
      profile &&
      holdings &&
      funds &&
      positions &&
      trades &&
      orders
    ) {
      setIsContentReady(true);
    } else {
      setIsContentReady(false);
    }
  }, [loading, profile, holdings, funds, positions, trades, orders]);

  const handleBroker = () => {
    if (!fyersAccessToken) {
      setBrokerModalOpen(true);
      // console.log("First connect to your broker to start auto trade feature.");
    }
  };

  const closeBrokerModal = () => {
    setBrokerModalOpen(false);
  };

  const renderContent = () => {
    if (!fyersAccessToken) {
      return (
        <div className="flex flex-col items-center justify-center">
          <button onClick={handleBroker} className="auth px-4 py-1 mb-4">
            Connect your Broker
          </button>
        </div>
      );
    }

    if (!isContentReady) {
      return <Loading />;
    }

    return (
      <>
        <Header />
        <AccountInfo />
        <StockDetails />
      </>
    );
  };

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="bear"
        />

        <div className="bg-white min-h-[85vh] news-table rounded-2xl">
          <div className="py-5 px-5 flex flex-col rounded-2xl">
            {renderContent()}
          </div>
        </div>

        <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
      </div>
    </div>
  );
}

export default IndiaPortfolio;
