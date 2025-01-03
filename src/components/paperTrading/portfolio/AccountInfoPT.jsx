import React from "react";
import Cards from "../../brokers/fyers/Cards";
import { useSelector } from "react-redux";
import { usePaperTrading } from "../../../contexts/PaperTradingContext";

function AccountInfoPT() {
  // Get the current user from Redux state
  const { currentUser } = useSelector((state) => state.user);

  // Use the PaperTrading context
  const { funds, holdings, positions, loading, error } = usePaperTrading();

  const investedAmount = funds?.reservedFunds || "00.00";
  const totalProfit = funds?.totalProfit || "100.00";
  const totalLoss = funds?.totalLoss || "50.00";
  const cashBalance = funds?.availableFunds || "100000";

  // Handle loading and error states
  if (loading) return <div>Loading account information...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
            valueColor="text-yellow-500"
          />
          <Cards
            title="Total Profit"
            value={totalProfit}
            valueColor="text-green-500"
          />
          <Cards
            title="Total Loss"
            value={totalLoss}
            valueColor="text-red-500"
          />
          <Cards
            title="Cash Balance"
            value={cashBalance}
            valueColor="text-green-200"
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfoPT;
