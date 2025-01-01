import React, { useState, useEffect } from "react";
import Cards from "../brokers/fyers/Cards";

function AccountDetailsPT({ userId }) {
  const [currentTime, setCurrentTime] = useState("");

  const cardData = [
    {
      title: "Invested Amount",
      value: "00.00",
      valueColor: "text-[#FADB8B]",
    //   bgColor: "bg-[#E59C4699]",
      width: "w-100px",
      height: "h-[80px]",
    },
    {
      title: "Total Profit",
      value: "100.00",
      valueColor: "text-[#8BFACB]",
    //   bgColor: "bg-[#94D2BD]",
      width: "w-100px",
      height: "h-[80px]",
    },
    {
      title: "Total Loss",
      value: "50.00",
      valueColor: "text-[#FA8B8B]",
    //   bgColor: "bg-[#457B9D]",
      width: "w-100px",
      height: "h-[80px]",
    },
    {
      title: "Cash Balance",
      value: "100000",
      valueColor: "text-[#8BFAF3]",
    //   bgColor: "bg-[#F4A261]",
      width: "w-100px",
      height: "h-[80px]",
    },
  ];

  // Function to format the date
  const formatTime = () => {
    const date = new Date();
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const updateLiveTime = () => {
      setCurrentTime(formatTime());

      // Calculate time until the next minute tick
      const now = new Date();
      const msUntilNextMinute =
        60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

      // Set a timeout to update precisely at the next minute
      setTimeout(updateLiveTime, msUntilNextMinute);
    };

    updateLiveTime(); // Initialize live time

    // Cleanup on unmount
    return () => {
      setCurrentTime(""); // Clear the time when component unmounts
    };
  }, []);

  return (
    <div className="news-table rounded-xl pb-3 px-2 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b-2 border-[#FFFFFF1A]">
        <div>
          <h1 className="font-semibold text-md">Account : {userId}</h1>
          <p className="text-gray-400 text-sm">{currentTime} IST</p>
        </div>
        <div className="flex items-center">
          <h2 className="font-bold text-xl font-[poppins]">4.8%</h2>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc7c5d9b8be124aceba6cb8afa01b3c06"
            alt="Status"
            className="h-14"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cardData.map((card, index) => (
          <Cards
            key={index}
            title={card.title}
            value={card.value}
            valueColor={card.valueColor}
            bgColor={card.bgColor}
            width={card.width}
            height={card.height}
          />
        ))}
      </div>
    </div>
  );
}

export default AccountDetailsPT;
