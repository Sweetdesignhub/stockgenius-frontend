import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import BrokerModal from "../../components/brokers/BrokerModal";
import AutoTradeModal from "../../components/brokers/AutoTradeModal";
import Bot from "../../components/aiTradingBots/Bot";
import NotAvailable from "../../components/common/NotAvailable";
import api from "../../config";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import moment from "moment-timezone";
import { isAfterMarketClose, isBeforeMarketOpen, isWithinTradingHours } from "../../utils/helper";
import { useBotTime } from "../../contexts/BotTimeContext";
import { useData } from "../../contexts/FyersDataContext";

const getBotStatus = (isActive) => {
  if (isAfterMarketClose()) {
    return "Inactive";
  } else if (isWithinTradingHours()) {
    return isActive ? "Running" : "Inactive";
  } else if (isBeforeMarketOpen()) {
    return isActive ? "Schedule" : "Inactive";
  } else {
    return "Inactive";
  }
};

function Cards({ title, value }) {
  return (
    <div
      className="border-[0.1px] rounded-xl py-4 px-1 flex flex-col justify-center"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(46, 51, 90, 0.1) 0%, rgba(28, 27, 51, 0.02) 100%), " +
          "radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <h1 className="text-sm text-end">{title}</h1>
      <h1 className="font-bold text-lg text-end text-[#15DE73]">{value}</h1>
    </div>
  );
}

function AITradingBots() {
  const [botDataList, setBotDataList] = useState([]);
  const [botStates, setBotStates] = useState({});
  const [brokerModalOpen, setBrokerModalOpen] = useState(false);
  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const { botTimes, formatTime } = useBotTime();

  const fyersAccessToken = useSelector((state) => state.fyers);
  const { currentUser } = useSelector((state) => state.user);

  const {
    funds = { fund_limit: [{}] },
  } = useData();

  const fetchBots = useCallback(async () => {
    try {
      const response = await api.get(`/api/v1/ai-trading-bots/getBotsByUserId/${currentUser.id}`);
      const sortedBots = response.data.bots.sort((a, b) => new Date(b.createdAt).tz("Asia/Kolkata") - new Date(a.createdAt).tz("Asia/Kolkata"));
      setBotDataList(sortedBots);
      setBotStates(sortedBots.reduce((acc, bot) => {
        acc[bot._id] = {
          isActive: bot.dynamicData[0]?.status === "Running" || bot.dynamicData[0]?.status === "Schedule"
        };
        return acc;
      }, {}));
    } catch (error) {
      console.error("Error fetching bots:", error);
    }
  }, [currentUser.id]);


  useEffect(() => {
    fetchBots();
  }, [currentUser.id]);

  useEffect(() => {
    const updateBotStates = () => {
      setBotStates((prevStates) => {
        const newStates = {};
        for (const botId of Object.keys(prevStates)) {
          const { isActive } = prevStates[botId];
          newStates[botId] = {
            isActive,
            status: getBotStatus(isActive),
          };
        }
        return newStates;
      });
    };

    updateBotStates(); // Initial call
    const interval = setInterval(updateBotStates, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const createBot = async (botData) => {
    try {
      const response = await api.post(
        `api/v1/ai-trading-bots/createBot/${currentUser.id}`,
        botData
      );
      if (response.status === 201) {
        fetchBots();
        setTitle("Congratulations");
        setMessage(`${botData.name} has been successfully created. To activate it, you need to switch it ON.`);
        setConfirmationOpen(true);
      } else {
        console.error("Unexpected response format:", response.data);
        alert("An unexpected response format was received.");
      }
    } catch (error) {
      setTitle("Error");
      console.error("Unexpected error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again."
      );
      setConfirmationOpen(true);
    }
  };

  const handleToggle = async (botId) => {
    if (isAfterMarketClose()) {
      setTitle("Action Not Allowed");
      setMessage("You can't activate the bot after market closes.");
      setConfirmationAction(() => () => setConfirmationOpen(false));
      setConfirmationOpen(true);
      return;
    }

    try {
      const bot = botDataList.find(b => b._id === botId);
      const currentStatus = bot.dynamicData[0]?.status;
      let newStatus;

      if (currentStatus === "Running" || currentStatus === "Schedule") {
        newStatus = "Inactive";
      } else {
        if (isWithinTradingHours()) {
          newStatus = "Running";
        } else if (isBeforeMarketOpen()) {
          newStatus = "Schedule";
        } else {
          newStatus = "Inactive";
        }
      }

      // await api.put(`/api/v1/ai-trading-bots/users/${currentUser.id}/bots/${botId}`, {
      //   status: newStatus
      // });
      

      setBotStates(prevStates => ({
        ...prevStates,
        [botId]: {
          isActive: newStatus === "Running" || newStatus === "Schedule",
          status: newStatus
        }
      }));

      fetchBots(); // Refetch bots to get updated data
    } catch (error) {
      console.error("Error toggling bot status:", error);
      setTitle("Error");
      setMessage("Failed to update bot status. Please try again.");
      setConfirmationOpen(true);
    }
  };

  const handleScheduleTrade = () => {
    if (!fyersAccessToken) {
      setBrokerModalOpen(true);
      console.log("First connect to your broker to start auto trade feature.");
    } else {
      console.log(fyersAccessToken);
      console.log("Successfully connected to broker");
      setAutoTradeModalOpen(true);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setAutoTradeModalOpen(false);
  };

  const calculateCardData = useMemo(() => {
    const today = moment().tz("Asia/Kolkata").startOf('day');
    const startOfWeek = moment().tz("Asia/Kolkata").startOf('isoWeek');

    let todayProfit = 0;
    let weekProfit = 0;
    let totalInvestment = 0;
    let totalProfit = 0;
    let reInvestments = 0;
    let totalTodaysBotTime = 0;
    let totalCurrentWeekBotTime = 0;

    // Get the total balance and limit at start of day
    const balance = funds?.fund_limit?.find(item => item.id === 10)?.equityAmount || 0;
    const limitAtStartOfDay = funds?.fund_limit?.find(item => item.id === 9)?.equityAmount || 0;

    // Calculate the investment amount
    const investmentAmount = limitAtStartOfDay - balance;

    botDataList.forEach(bot => {
      const botCreatedAt = moment(bot.createdAt).tz("Asia/Kolkata");
      const profitGained = parseFloat(bot.dynamicData[0]?.profitGained || 0);

      if (botCreatedAt.isSame(today, 'day')) {
        todayProfit += profitGained;
      }

      if (botCreatedAt.isSameOrAfter(startOfWeek)) {
        weekProfit += profitGained;
      }

      totalProfit += profitGained;
      reInvestments += parseInt(bot.dynamicData[0]?.reInvestment || 0);

      // Sum up the bot times from the context
      const botTime = botTimes[bot._id] || { todaysBotTime: 0, currentWeekTime: 0 };
      totalTodaysBotTime += botTime.todaysBotTime;
      totalCurrentWeekBotTime += botTime.currentWeekTime;
    });

    totalInvestment = investmentAmount;

    const calculatePercentage = (profit, investment) => {
      if (investment === 0) return "0.00%";
      const percentage = (profit / investment) * 100;
      return isNaN(percentage) ? "0.00%" : `${percentage.toFixed(2)}%`;
    };

    const todayProfitPercentage = calculatePercentage(todayProfit, totalInvestment);
    const weekProfitPercentage = calculatePercentage(weekProfit, totalInvestment);

    return [
      { title: "Today's Profit %", value: todayProfitPercentage },
      { title: "Last Week Profit %", value: weekProfitPercentage },
      { title: "Today's Bot Time", value: formatTime(totalTodaysBotTime) },
      { title: "Week's Bot Time", value: formatTime(totalCurrentWeekBotTime) },
      { title: "No. of AI Bots", value: botDataList.length.toString() },
      { title: "Re-investments", value: reInvestments.toString() },
      { title: "Total Investment", value: totalInvestment.toFixed(2) },
      { title: "Total Profit", value: totalProfit.toFixed(2) },
    ];
  }, [botDataList, botTimes, formatTime]);

  return (
    <div className="-z-10">
      <div className="min-h-screen lg:px-32 p-4 relative">
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-[0] w-[165px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F842b9a90647948f6be555325a809b962"
          alt="Bull"
        />
        <img
          loading="lazy"
          className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-[0px] w-[160px]"
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc271dc9e12c34485b3409ffedc33f935"
          alt="Bear"
        />

        <div className="bg-white lg:min-h-[85vh] news-table rounded-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between p-4 border-[#FFFFFF1A] mx-5 border-b">
            <h2 className="font-semibold text-xl text-center lg:text-left mb-4 lg:mb-0">
              AI Trading Bots
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center w-full lg:w-auto">
              <button
                className=" text-sm py-2 font-semibold px-4 rounded-xl bg-[#3A6FF8]  dark:text-blue-700 dark:bg-white w-full sm:w-auto flex flex-col items-center text-white"
                onClick={handleScheduleTrade}
              >
                <span>Schedule Bot</span>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
              {calculateCardData.map((card, index) => (
                <Cards key={index} title={card.title} value={card.value} />
              ))}
            </div>
          </div>

          <div className="p-4 overflow-scroll max-h-[60vh]">
            <div className="flex flex-col gap-10">
              {botDataList.length > 0 ? (
                botDataList.map((bot) => (
                  <Bot
                    key={bot._id}
                    botData={bot}
                    isEnabled={botStates[bot._id].isActive}
                    onToggle={() => handleToggle(bot._id)}
                  //                    currentStatus={botStates[bot._id].status}
                  //                  onUpdateWorkingTime={updateBotWorkingTime}
                  />
                ))
              ) : (
                <div>
                  <NotAvailable dynamicText="<strong>No bots available.</strong> Activate Auto Trade Bot to start trading." />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BrokerModal
        isOpen={brokerModalOpen}
        onClose={() => setBrokerModalOpen(false)}
      />
      <AutoTradeModal
        isOpen={autoTradeModalOpen}
        onClose={() => {
          setAutoTradeModalOpen(false);
        }}
        onCreateBot={createBot}
      />
      {message && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          onClose={handleConfirmationClose}
          title={title}
          message={message}
          onConfirm={handleConfirmationClose}
        />
      )}
    </div>
  );
}

export default AITradingBots;
