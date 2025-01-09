import React, { useState, useEffect } from "react";
import Cards from "../brokers/fyers/Cards";
import { usePaperTrading } from "../../contexts/PaperTradingContext";

function AccountDetailsPT({ userId }) {
  const [currentTime, setCurrentTime] = useState("");

  // Accessing funds and positions from context
  const { funds, positions, loading, profitSummary } = usePaperTrading();

  // Calculate Total Profit and Loss
  const netPositions = positions?.netPositions || [];

  // const { totalProfit, totalLoss } = netPositions.reduce(
  //   (acc, position) => {
  //     const realizedPnL = position.realizedPnL || 0;
  //     const unrealizedPnL = position.unrealizedPnL || 0;
  //     const totalPnL = realizedPnL + unrealizedPnL;

  //     if (totalPnL > 0) {
  //       acc.totalProfit += totalPnL;
  //     } else {
  //       acc.totalLoss += Math.abs(totalPnL);
  //     }

  //     return acc;
  //   },
  //   { totalProfit: 0, totalLoss: 0 }
  // );

  // Fallback values for funds
  const investedAmount = (parseFloat(funds?.reservedFunds) || 0).toFixed(2);
  // const formattedTotalProfit = totalProfit.toFixed(2);
  // const formattedTotalLoss = totalLoss.toFixed(2);
  const totalProfit = (profitSummary?.totalProfit || 0.0).toFixed(2);
  const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);

  const cashBalance = (parseFloat(funds?.availableFunds) || 100000).toFixed(2);

  const cardData = [
    {
      title: "Invested Amount",
      value: investedAmount,
      valueColor: "text-[#FADB8B]",
      width: "w-100px",
      height: "h-[80px]",
      bgColor:
        "bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]",
    },
    {
      title: "Total Profit",
      value: totalProfit,
      valueColor: "text-[#8BFACB]",
      width: "w-100px",
      height: "h-[80px]",
      bgColor:
        "bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]",
    },
    {
      title: "Today's Profit",
      value: todaysProfit,
      valueColor: "text-[#FA8B8B]",
      width: "w-100px",
      height: "h-[80px]",
      bgColor:
        "bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]",
    },
    {
      title: "Cash Balance",
      value: cashBalance,
      valueColor: "text-[#8BFAF3]",
      width: "w-100px",
      height: "h-[80px]",
      bgColor:
        "bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]",
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="news-table rounded-xl pb-3 px-2 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b-2 border-[#FFFFFF1A]">
        <div className="py-2">
          <h1 className="font-semibold text-md">Account : {userId}</h1>
          <p className="text-gray-400 text-sm">{currentTime} IST</p>
        </div>
        {/* <div className="flex items-center">
          <h2 className="font-bold text-xl font-[poppins]">4.8%</h2>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc7c5d9b8be124aceba6cb8afa01b3c06"
            alt="Status"
            className="h-14"
          />
        </div> */}
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
