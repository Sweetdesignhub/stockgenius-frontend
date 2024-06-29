import React, { useState, useEffect } from "react";
import AccountInfo from "../components/brokers/fyers/AccountInfo";
import Header from "../components/brokers/fyers/Header";
import BrokerModal from "../components/brokers/fyers/BrokerModal";
import StockDetails from "../components/brokers/fyers/portfolio/StockDetails";

function Portfolio() {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   setIsModalOpen(true);
  // }, []);

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <div className="-z-10">
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

        <div className="bg-white min-h-[85vh] news-table rounded-2xl">
          <div className="py-5 px-5 flex flex-col rounded-2xl">
            <Header />
            <AccountInfo />
            <StockDetails />
          </div>
        </div>
      </div>
      {/* <BrokerModal isOpen={isModalOpen} onClose={closeModal} /> */}
    </div>
  );
}

export default Portfolio;
