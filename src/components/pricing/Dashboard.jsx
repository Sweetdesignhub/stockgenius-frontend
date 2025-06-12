import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeatures } from "../../redux/premiumFeatures/featuresSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { user, plan, usage, loading, error } = useSelector((state) => state.features);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchFeatures());
    }
  }, [dispatch, currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!plan || !user || !usage) return <div>No data available</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl">StockGenius Dashboard</h1>
      <p>Plan: {plan.name.toUpperCase()}</p>
      <div>
        <h2>Paper Trading</h2>
        <p>
          Hours Used: {usage.paperTrading.hoursUsed}/{plan.features.paperTrading.hoursPerDay || "Unlimited"}
        </p>
        <p>
          Funds Used: ${usage.paperTrading.fundsUsed}/${plan.features.paperTrading.fundsCap}
        </p>
        <p>Bot Status: {user.autoTradeBotPaperTradingCNC}</p>
      </div>
      <div>
        <h2>AI Live Trading</h2>
        {plan.features.aiLiveTrading.enabled ? (
          <p>
            Daily Transactions: {usage.aiLiveTrading.dailyTransactions}/
            {plan.features.aiLiveTrading.dailyTransactionCap || "Unlimited"}
          </p>
        ) : (
          <p>Upgrade to Pro or Master to unlock AI Live Trading</p>
        )}
      </div>
      <div>
        <h2>Simulation</h2>
        <p>
          Simulations Used: {usage.simulations}/{plan.features.simulation.monthlyLimit || "Unlimited"}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;