import React, { useState } from "react";
import AccountInfo from "../../components/brokers/fyers/AccountInfo";
import Header from "../../components/brokers/fyers/Header";
import StockDetails from "../../components/brokers/fyers/portfolio/StockDetails";
import BrokerModal from "../../components/brokers/BrokerModal";
import { useSelector } from "react-redux";

function IndiaPortfolio() {
  const fyersAccessToken = useSelector((state) => state.fyers);
  // console.log('porfolio access token : ', fyersAccessToken);
  const [brokerModalOpen, setBrokerModalOpen] = useState(!fyersAccessToken);
  const [loading, setLoading] = useState(false);

  const handleBroker = () => {
    if (!fyersAccessToken) {
      setLoading(true);
      setBrokerModalOpen(true);
      console.log("First connect to your broker to start auto trade feature.");
      setLoading(false); // Set to true when actual connection logic is implemented
    }
  };

  const closeBrokerModal = () => {
    setBrokerModalOpen(false);
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
            {fyersAccessToken ? (
              <div>
                <Header />
                <AccountInfo />
                <StockDetails />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={handleBroker}
                  className="auth px-4 py-1 mb-4"
                  disabled={loading}
                >
                  {loading ? "Connecting..." : "Connect your Broker"}
                </button>
              </div>
            )}
          </div>
        </div>

        <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
      </div>
    </div>
  );
}

export default IndiaPortfolio;
