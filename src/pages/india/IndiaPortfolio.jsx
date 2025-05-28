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
    <div className="relative w-full">
      <div className="min-h-fit p-2 sm:p-4 lg:px-8 xl:px-16 2xl:px-32 relative">
        {/* Bull image - hidden on small screens */}
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-0 w-[100px] sm:w-[120px] lg:w-[165px] hidden sm:block"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="bull"
        />
        {/* Bear image - hidden on small screens */}
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-0 w-[100px] sm:w-[120px] lg:w-[160px] hidden sm:block"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="bear"
        />
        
        <div className="bg-white min-h-[75vh] sm:min-h-[85vh] md:min-h-[75vh] lg:min-h-[65vh] xl:min-h-[60vh] 2xl:min-h-[50vh] 4xl:min-h-[40vh] news-table rounded-2xl">
          <div className="py-2 sm:py-3 md:py-4 lg:py-5 px-2 sm:px-3 md:px-4 lg:px-5 flex flex-col rounded-2xl">
            {renderContent()}
          </div>
        </div>

        <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
      </div>
    </div>
  );
}

export default IndiaPortfolio;
