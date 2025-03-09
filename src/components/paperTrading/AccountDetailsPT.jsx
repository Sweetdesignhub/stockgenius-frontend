// import React, { useState, useEffect } from "react";
// import Cards from "../brokers/fyers/Cards";
// import { usePaperTrading } from "../../contexts/PaperTradingContext";
// import moment from "moment-timezone";
// import { getUserFunds } from "../../paperTradingApi.js";

// function AccountDetailsPT({ userId }) {
//   const [currentTime, setCurrentTime] = useState("");

//   console.log("Heyyyyy");
//   const responses = getUserFunds(userId);
//   console.log(
//     "The response is for the user funds from the get User Funds is: ",
//     responses
//   );
//   // Accessing funds and positions from context
//   const { funds, positions, loading, profitSummary, investedAmount } =
//     usePaperTrading();
//   console.log("Using Paper Trading: ", {
//     funds,
//     positions,
//     loading,
//     profitSummary,
//     investedAmount,
//   });
//   const totalProfit = (profitSummary?.totalProfit || 0.0).toFixed(2);
//   const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);
//   const cumulativeProfit = (
//     parseFloat(totalProfit) + parseFloat(todaysProfit)
//   ).toFixed(2);

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
//       title: "Day's P&L",
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
import moment from "moment-timezone";
import { getUserFunds } from "../../paperTradingApi.js";
import Loading from "../common/Loading";

function AccountDetailsPT({ userId }) {
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState({
    investedAmount: 0,
    availableFunds: 2000000,
    totalProfit: 0,
    todaysProfit: 0,
  });

  // Fetch user funds data
  useEffect(() => {
    if (!userId) return;

    const fetchUserFunds = async () => {
      setLoading(true);
      try {
        const response = await getUserFunds(userId);
        const data = response.data.data;

        setAccountData({
          investedAmount: data.investedAmount || 0,
          availableFunds: data.availableFunds || 2000000,
          totalProfit: data.totalProfit || 0,
          todaysProfit: data.todaysProfit || 0,
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
        setError("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFunds();
  }, [userId]);

  // Calculate values for the cards
  const totalProfit = accountData.totalProfit.toFixed(2);
  const todaysProfit = accountData.todaysProfit.toFixed(2);
  const cumulativeProfit = (
    parseFloat(totalProfit) + parseFloat(todaysProfit)
  ).toFixed(2);
  const cashBalance = parseFloat(accountData.availableFunds).toFixed(2);
  const investedAmount = parseFloat(accountData.investedAmount).toFixed(2);

  // Helper function to get color based on value
  const getPnLColor = (value) => {
    const isPositive = parseFloat(value) >= 0;
    const textColor = isPositive ? "text-[#15DE73]" : "text-[#FF2950]";
    const bgColor = isPositive
      ? "bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]"
      : "bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]";

    return { textColor, bgColor };
  };

  const cardData = [
    {
      title: "Invested Amount",
      value: investedAmount,
      valueColor: "text-[#DEB215]",
      width: "w-100px",
      height: "h-[80px]",
      bgColor:
        "bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]",
    },
    {
      title: "Total P&L",
      value: cumulativeProfit,
      valueColor: getPnLColor(cumulativeProfit).textColor,
      width: "w-100px",
      height: "h-[80px]",
      bgColor: getPnLColor(cumulativeProfit).bgColor,
    },
    {
      title: "Day's P&L",
      value: todaysProfit,
      valueColor: getPnLColor(todaysProfit).textColor,
      width: "w-100px",
      height: "h-[80px]",
      bgColor: getPnLColor(todaysProfit).bgColor,
    },
    {
      title: "Cash Balance",
      value: cashBalance,
      valueColor: "text-[#45FCFC]",
      width: "w-100px",
      height: "h-[80px]",
      bgColor:
        "bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]",
    },
  ];

  // Function to format the date in IST
  const formatTime = () => {
    const now = moment().tz("Asia/Kolkata");
    return now.format("DD MMM, hh:mm A");
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
    return () => clearTimeout(updateLiveTime);
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="news-table rounded-xl pb-3 px-2 flex flex-col gap-4">
      <div className="flex justify-between items-center border-b-2 border-[#FFFFFF1A]">
        <div className="py-2">
          <h1 className="font-semibold text-md">Account : {userId}</h1>
          <p className="text-gray-400 text-sm">{currentTime} IST</p>
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
