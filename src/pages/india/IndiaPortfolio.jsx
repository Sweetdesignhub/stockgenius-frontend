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
  const [brokerModalOpen, setBrokerModalOpen] = useState(!fyersAccessToken);
  const { profile, holdings, funds, positions, trades, orders, loading } =
    useData();
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (
      !loading &&
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
        <div className="min-h-fit h-[80vh] lg:px-32 p-4 flex flex-col items-center">
          <button onClick={handleBroker} className="auth px-4 py-1mt-4 p-2 port ">
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
      <div className="min-h-fit h-[80vh] lg:px-32 p-4 relative ">
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
        
        <div className=" sbg-white/5 dark:bg-[rgba(5,5,5,0.2)] backdrop-blur-md table-main rounded-2xl border  border-white/10">
          <div className="h-[85vh] py-2 sm:py-3 md:py-4 lg:py-5 px-2 sm:px-3 md:px-4 lg:px-5 flex flex-col rounded-2xl">
            {renderContent()}
          </div>
        </div>

        <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
      </div>
    </div>
  );
}

export default IndiaPortfolio;
