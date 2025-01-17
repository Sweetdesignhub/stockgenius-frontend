import React from "react";
import Cards from "../../brokers/fyers/Cards";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext";

function AccountInfoPT() {
  // Get the current user from Redux state
  const { currentUser } = useSelector((state) => state.user);

  // Use the PaperTrading context
  const { funds, holdings, positions, loading, profitSummary, investedAmount } =
    usePaperTrading();

  // const investedAmount = Math.abs(
  //   parseFloat(funds?.reservedFunds) || 0
  // ).toFixed(2);
  const totalProfit = (profitSummary?.totalProfit || 0.0).toFixed(2);
  const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);
  const cumulativeProfit = (parseFloat(totalProfit) + parseFloat(todaysProfit)).toFixed(2);
  const cashBalance = (parseFloat(funds?.availableFunds) || 100000).toFixed(2);

  // console.log("today", todaysProfit);
  // console.log("total", totalProfit);
  // console.log("cummu", cumulativeProfit);
  

  // Helper function to get color based on value
  const getPnLColor = (value) => {
    const isPositive = parseFloat(value) >= 0;
    const textColor = isPositive ? "text-[#15DE73]" : "text-[#FF2950]";
    const bgColor = isPositive
      ? "bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]"
      : "bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]";

    return { textColor, bgColor };
  };

  // Handle loading and error states
  if (loading) return <div>Loading account information...</div>;
  // if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex-1">
        <div className="flex flex-col">
          <h1 className="font-semibold">Account: {currentUser?.id}</h1>
          <p>{currentUser?.name}</p>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-around gap-3">
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
            title="Today's P&L"
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
