import React from "react";
import Cards from "../../brokers/fyers/Cards";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext";

function AccountInfoPT() {
  // Get the current user from Redux state
  const { currentUser } = useSelector((state) => state.user);

  // Use the PaperTrading context
  const { funds, holdings, positions, loading, profitSummary } =
    usePaperTrading();

  const investedAmount = (parseFloat(funds?.reservedFunds) || 0).toFixed(2);
  const totalProfit = (profitSummary?.totalProfit || 0.0).toFixed(2);
  const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);
  const cashBalance = (parseFloat(funds?.availableFunds) || 100000).toFixed(2);

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
            valueColor="text-[#FADB8B]"
            bgColor="bg-[linear-gradient(to_bottom,_rgba(229,_156,_70,_0.3),_rgba(229,_156,_70,_0.1),_rgba(229,_156,_70,_0.3))]"
          />
          <Cards
            title="Total Profit"
            value={totalProfit}
            valueColor="text-[#8BFACB]"
            bgColor="bg-[linear-gradient(to_bottom,_rgba(70,_229,_153,_0.3),_rgba(70,_229,_153,_0.1),_rgba(70,_229,_153,_0.3))]"
          />
          <Cards
            title="Today's Profit"
            value={todaysProfit}
            valueColor="text-[#FA8B8B]"
            bgColor="bg-[linear-gradient(to_bottom,_rgba(229,_70,_80,_0.3),_rgba(229,_70,_80,_0.1),_rgba(229,_70,_80,_0.3))]"
          />
          <Cards
            title="Cash Balance"
            value={cashBalance}
            valueColor="text-[#8BFAF3]"
            bgColor="bg-[linear-gradient(to_bottom,_rgba(70,_229,_229,_0.3),_rgba(70,_229,_229,_0.1),_rgba(70,_229,_229,_0.3))]"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfoPT;
