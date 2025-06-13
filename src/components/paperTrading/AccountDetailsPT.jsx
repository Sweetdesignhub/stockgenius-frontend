// import React, { useState, useEffect } from "react";
// import Cards from "../brokers/fyers/Cards";
// import { usePaperTrading } from "../../contexts/PaperTradingContext";
// import moment from "moment-timezone";

// function AccountDetailsPT({ userId }) {
//   const [currentTime, setCurrentTime] = useState("");

//   // Accessing funds and positions from context
//   const { funds, positions, loading, profitSummary,investedAmount } = usePaperTrading();

//   const totalProfit = (profitSummary?.totalProfit || 0.0).toFixed(2);
//   const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);
//   const cumulativeProfit = (parseFloat(totalProfit) + parseFloat(todaysProfit)).toFixed(2);

//   const cashBalance = (parseFloat(funds?.availableFunds) || 2000000).toFixed(2);

//   // Helper function to get color based on value
//   const getPnLColor = (value) => {
//     const isPositive = parseFloat(value) >= 0;
//     const textColor = isPositive ? "text-[#15DE73]" : "text-[#FF2950]";
//     const bgColor = isPositive
//       ? "bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]"
//       : "bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]";

//     return { textColor, bgColor };
//   };

//   const cardData = [
//     {
//       title: "Invested Amount",
//       value: investedAmount,
//       valueColor: "text-[#DEB215]",
//       width: "w-100px",
//       height: "h-[80px]",
//       bgColor:
//         "bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]",
//     },
//     {
//       title: "Total P&L",
//       value: cumulativeProfit,
//       valueColor: getPnLColor(cumulativeProfit).textColor,
//       width: "w-100px",
//       height: "h-[80px]",
//       bgColor: getPnLColor(cumulativeProfit).bgColor,
//     },
//     {
//       title: "Today's P&L",
//       value: todaysProfit,
//       valueColor: getPnLColor(todaysProfit).textColor,
//       width: "w-100px",
//       height: "h-[80px]",
//       bgColor: getPnLColor(todaysProfit).bgColor,
//     },
//     {
//       title: "Cash Balance",
//       value: cashBalance,
//       valueColor: "text-[#45FCFC]",
//       width: "w-100px",
//       height: "h-[80px]",
//       bgColor:
//         "bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]",
//     },
//   ];

//   // Function to format the date
//   // const formatTime = () => {
//   //   const date = new Date();
//   //   return new Intl.DateTimeFormat("en-GB", {
//   //     day: "numeric",
//   //     month: "short",
//   //     hour: "numeric",
//   //     minute: "numeric",
//   //     hour12: true,
//   //   }).format(date);
//   // };

//   const formatTime = () => {
//     const now = moment().tz("Asia/Kolkata"); // Get current time in IST
//     return now.format("DD MMM, hh:mm A"); // Format it as required (e.g., 13 Jan, 09:30 AM)
//   };

//   useEffect(() => {
//     const updateLiveTime = () => {
//       setCurrentTime(formatTime());

//       // Calculate time until the next minute tick
//       const now = new Date();
//       const msUntilNextMinute =
//         60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

//       // Set a timeout to update precisely at the next minute
//       setTimeout(updateLiveTime, msUntilNextMinute);
//     };

//     updateLiveTime(); // Initialize live time

//     // Cleanup on unmount
//     return () => {
//       setCurrentTime(""); // Clear the time when component unmounts
//     };
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="news-table rounded-xl pb-3 px-2 flex flex-col gap-4">
//       <div className="flex justify-between items-center border-b-2 border-[#FFFFFF1A]">
//         <div className="py-2">
//           <h1 className="font-semibold text-md">Account : {userId}</h1>
//           <p className="text-gray-400 text-sm">{currentTime} IST</p>
//         </div>
//         {/* <div className="flex items-center">
//           <h2 className="font-bold text-xl font-[poppins]">4.8%</h2>
//           <img
//             loading="lazy"
//             src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc7c5d9b8be124aceba6cb8afa01b3c06"
//             alt="Status"
//             className="h-14"
//           />
//         </div> */}
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//         {cardData.map((card, index) => (
//           <Cards
//             key={index}
//             title={card.title}
//             value={card.value}
//             valueColor={card.valueColor}
//             bgColor={card.bgColor}
//             width={card.width}
//             height={card.height}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AccountDetailsPT;

import React, { useState, useEffect } from "react";
import Cards from "../brokers/fyers/Cards";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import { usePaperTrading } from "../../contexts/PaperTradingContext";
import { useUsaPaperTrading } from "../../contexts/UsaPaperTradingContext";

function AccountDetailsPT({ userId }) {
  const [currentTime, setCurrentTime] = useState("");
  const region = useSelector((state) => state.region); // Fetch user region
  // console.log(region);
  

  // ✅ Select the correct context based on region
  const {
    funds,
    positions,
    loading,
    profitSummary,
    investedAmount,
  } = region === "usa" ? useUsaPaperTrading() : usePaperTrading();

  const totalProfit = (profitSummary?.totalProfit || 0.0).toFixed(2);
  const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);
  const cumulativeProfit = (parseFloat(totalProfit) + parseFloat(todaysProfit)).toFixed(2);
  const cashBalance = (parseFloat(funds?.availableFunds) || 100000).toFixed(2);

  // Helper function to get color based on value
  const getPnLColor = (value) => {
    const isPositive = parseFloat(value) >= 0;
    return {
      textColor: isPositive ? "text-[#15DE73]" : "text-[#FF2950]",
      bgColor: isPositive
        ? "bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]"
        : "bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]",
    };
  };

  // ✅ Strict USA Timezone Handling (EST / EDT based on DST)
  const formatTime = () => {
    const timezone = region === "usa" ? "America/New_York" : "Asia/Kolkata"; // USA (ET) or IST
    return moment().tz(timezone).format("DD MMM, hh:mm A z"); // Ensures proper ET/EDT display
  };

  // ⏳ Update Live Time Every Minute
  useEffect(() => {
    const updateLiveTime = () => {
      setCurrentTime(formatTime());

      // Calculate time until the next minute tick
      const now = new Date();
      const msUntilNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

      const timer = setTimeout(updateLiveTime, msUntilNextMinute);
      return () => clearTimeout(timer); // Cleanup on unmount
    };

    updateLiveTime(); // Initialize

  }, [region]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="news-table rounded-xl pb-3 px-2 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b-2 border-[#FFFFFF1A]">
        <div className="py-2">
          <h1 className="font-semibold text-md">Account : {userId}</h1>
          <p className="text-gray-400 text-sm">{currentTime}</p> {/* Auto-displays EST/EDT */}
        </div>
      </div>      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2">
        {[
          {
            title: "Invested Amount",
            value: investedAmount,
            valueColor: "text-[#DEB215]",
            bgColor: "bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]",
            width: "min-w-[160px] lg:min-w-[140px]",
            height: "min-h-24 lg:min-h-[5rem]"
          },
          {
            title: "Total P&L",
            value: cumulativeProfit,
            valueColor: getPnLColor(cumulativeProfit).textColor,
            bgColor: getPnLColor(cumulativeProfit).bgColor,
          },
          {
            title: "Today's P&L",
            value: todaysProfit,
            valueColor: getPnLColor(todaysProfit).textColor,
            bgColor: getPnLColor(todaysProfit).bgColor,
          },
          {
            title: "Cash Balance",
            value: cashBalance,
            valueColor: "text-[#45FCFC]",
            bgColor: "bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]",
          },
        ].map((card, index) => (
          <Cards
            key={index}
            title={card.title}
            value={card.value}
            valueColor={card.valueColor}
            bgColor={card.bgColor}
          />
        ))}
      </div>
    </div>
  );
}

export default AccountDetailsPT;
