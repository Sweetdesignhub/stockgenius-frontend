// import React from "react";
// import Cards from "../../brokers/fyers/Cards";
// import { useSelector } from "react-redux";
// import { usePaperTrading } from "../../../contexts/PaperTradingContext";

// function AccountInfoPT() {
//   // Get the current user from Redux state
//   const { currentUser } = useSelector((state) => state.user);

//   // Use the PaperTrading context
//   const { funds, loading, profitSummary, investedAmount } = usePaperTrading();

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

//   // Handle loading and error states
//   // if (loading) return <div>Loading account information...</div>;

//   return (
//     <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-5 gap-5">
//       {/* User Info Section */}
//       <div className="flex-1 min-w-[200px]">
//         <div className="flex flex-col text-center lg:text-left">
//           <h1 className="font-semibold text-sm lg:text-lg">
//             Account: {currentUser?.id}
//           </h1>
//           <p className="text-xs lg:text-base">{currentUser?.name}</p>
//         </div>
//       </div>

//       {/* Cards Section */}
//       <div className="flex-1 w-full lg:w-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-around gap-3">
//           <Cards
//             title="Invested Amount"
//             value={investedAmount}
//             valueColor="text-[#DEB215]"
//             bgColor="bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]"
//           />
//           <Cards
//             title="Total P&L"
//             value={cumulativeProfit}
//             valueColor={getPnLColor(cumulativeProfit).textColor}
//             bgColor={getPnLColor(cumulativeProfit).bgColor}
//           />
//           <Cards
//             title="Day's P&L"
//             value={todaysProfit}
//             valueColor={getPnLColor(todaysProfit).textColor}
//             bgColor={getPnLColor(todaysProfit).bgColor}
//           />
//           <Cards
//             title="Cash Balance"
//             value={cashBalance}
//             valueColor="text-[#45FCFC]"
//             bgColor="bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]"
//           />
//         </div>
//       </div>
//     </div>
//   );

// }

// export default AccountInfoPT;
import React, { useState, useEffect } from "react";
import Cards from "../../brokers/fyers/Cards";
import { useSelector } from "react-redux";
import { getUserFunds } from "../../../paperTradingApi";
import Loading from "../../common/Loading";

function AccountInfoPT() {
  // Get the current user from Redux state
  const currentUser = useSelector((state) => state.user?.currentUser);
  const userId = currentUser?.id;

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
  const totalProfit = (accountData.totalProfit || 0.0).toFixed(2);
  const todaysProfit = (accountData.todaysProfit || 0.0).toFixed(2);
  const cumulativeProfit = (
    parseFloat(totalProfit) + parseFloat(todaysProfit)
  ).toFixed(2);
  const cashBalance = (
    parseFloat(accountData.availableFunds) || 2000000
  ).toFixed(2);
  const investedAmount = parseFloat(accountData.investedAmount || 0).toFixed(2);

  // Helper function to get color based on value
  const getPnLColor = (value) => {
    const isPositive = parseFloat(value) >= 0;
    const textColor = isPositive ? "text-[#15DE73]" : "text-[#FF2950]";
    const bgColor = isPositive
      ? "bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]"
      : "bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]";

    return { textColor, bgColor };
  };

  if (loading && !accountData.availableFunds) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-5 gap-5">
      {/* User Info Section */}
      <div className="flex-1 min-w-[200px]">
        <div className="flex flex-col text-center lg:text-left">
          <h1 className="font-semibold text-sm lg:text-lg">
            Account: {userId}
          </h1>
          <p className="text-xs lg:text-base">{currentUser?.name}</p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex-1 w-full lg:w-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-around gap-3">
          <Cards
            title="Invested Amount"
            value={investedAmount}
            valueColor="text-[#DEB215]"
            bgColor="bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]"
          />
          <Cards
            title="Total P&L"
            value={cumulativeProfit}
            valueColor={getPnLColor(cumulativeProfit).textColor}
            bgColor={getPnLColor(cumulativeProfit).bgColor}
          />
          <Cards
            title="Day's P&L"
            value={todaysProfit}
            valueColor={getPnLColor(todaysProfit).textColor}
            bgColor={getPnLColor(todaysProfit).bgColor}
          />
          <Cards
            title="Cash Balance"
            value={cashBalance}
            valueColor="text-[#45FCFC]"
            bgColor="bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfoPT;
