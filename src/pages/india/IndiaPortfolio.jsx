import React, { useState, useEffect } from "react";
import AccountInfo from "../../components/brokers/fyers/AccountInfo";
import Header from "../../components/brokers/fyers/Header";
import StockDetails from "../../components/brokers/fyers/portfolio/StockDetails";
import BrokerModal from "../../components/brokers/BrokerModal";
import { useSelector } from "react-redux";
import Loading from "../../components/common/Loading";
import { useData } from "../../contexts/FyersDataContext";
import ZerodhaAccountInfo from "../../components/brokers/zerodha/ZerodhaAccountInfo";
import ZerodhaStockDetails from "../../components/brokers/zerodha/portfolio/ZerodhaStockDetails";
import { useZerodhaData } from "../../contexts/ZerodhaDataContext";

function IndiaPortfolio() {
  const fyersAccessToken = useSelector((state) => state.fyers);
  const zerodhaAccessToken = useSelector((state) => state.zerodha); // Corrected selector for Zerodha

  // If no access token, show broker modal to prompt user to connect a broker
  const [brokerModalOpen, setBrokerModalOpen] = useState(!fyersAccessToken && !zerodhaAccessToken);

  // Choose broker data based on the available access token
  const isFyersActive = Boolean(fyersAccessToken);
  const isZerodhaActive = Boolean(zerodhaAccessToken && !fyersAccessToken); // Zerodha will only activate if Fyers is not available

  // Data fetching for either Fyers or Zerodha based on the active broker
  const fyersData = isFyersActive ? useData() : {};
  const zerodhaData = isZerodhaActive ? useZerodhaData() : {};

  const { profile, holdings, funds, positions, trades, orders, loading } = isFyersActive ? fyersData : zerodhaData;

  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (!loading && profile && holdings && funds && positions && trades && orders) {
      setIsContentReady(true);
    } else {
      setIsContentReady(false);
    }
  }, [loading, profile, holdings, funds, positions, trades, orders]);

  const handleBroker = () => {
    if (!fyersAccessToken && !zerodhaAccessToken) {
      setBrokerModalOpen(true);
      console.log("First connect to your broker to start auto trade feature.");
    }
  };

  const closeBrokerModal = () => {
    setBrokerModalOpen(false);
  };

  const renderContent = () => {
    if (!fyersAccessToken && !zerodhaAccessToken) {
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
        {isFyersActive ? (
          <div>
            <Header />
            <AccountInfo />
            <StockDetails />
          </div>
        ) : (
          <div>
            <Header />
            <ZerodhaAccountInfo />
            <ZerodhaStockDetails />
          </div>
        )}
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
