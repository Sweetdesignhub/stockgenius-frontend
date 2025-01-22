import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import AutoTradeModal from "../../components/brokers/AutoTradeModal";
import api from "../../config";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useSelector } from "react-redux";
import NotAvailable from "../../components/common/NotAvailable";
import { usePaperTrading } from "../../contexts/PaperTradingContext";
import moment from "moment-timezone";
import Loading from "../../components/common/Loading";
import {
  isAfterMarketClose,
  isBeforeMarketOpen,
  isWithinTradingHours,
} from "../../utils/helper";
import PaperTradeBot from "../../components/aiTradingBots/PaperTradeBot";

// Define an array of colors for the bots
const botColors = [
  "#F62024",
  "#F6208F",
  "#208FF6",
  "#20F6F6",
  "#8FF620",
  "#F6F620",
  "#F68F20",
  "#20F68F",
];

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
  const { theme } = useTheme();

  const backgroundStyle =
    theme === "dark"
      ? {
          backgroundImage:
            "linear-gradient(180deg, rgba(46, 51, 90, 0.1) 0%, rgba(28, 27, 51, 0.02) 100%), " +
            "radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)",
        }
      : {
          backgroundColor: "white",
        };

  return (
    <div
      className="border-[0.1px] rounded-xl py-4 px-1 flex flex-col justify-center"
      style={backgroundStyle}
    >
      <h1 className="text-sm text-end">{title}</h1>
      <h1 className="font-bold text-lg text-end text-[#15DE73]">{value}</h1>
    </div>
  );
}

const PaperTradingAutoTrade = () => {
  const [botDataList, setBotDataList] = useState([]);
  const [botStates, setBotStates] = useState({});
  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [togglingBotId, setTogglingBotId] = useState(null);

  const [botColorMap, setBotColorMap] = useState({});
  const location = useLocation();
  const isAITradingPage = location.pathname === "/india/autotrade-bots";

  const [allBotsTime, setAllBotsTime] = useState({
    totalTodaysBotTime: 0,
    totalCurrentWeekTime: 0,
  });

  const { currentUser } = useSelector((state) => state.user);

  // Use the PaperTrading context
  const {
    holdings,
    positions,
    orders,
    loading,
    profitSummary,
    investedAmount,
  } = usePaperTrading();

  const todaysProfit = (profitSummary?.todaysProfit || 0.0).toFixed(2);
  const totalProfit = (
    parseFloat(profitSummary?.totalProfit || 0.0) + parseFloat(todaysProfit)
  ).toFixed(2);

  const fetchBots = useCallback(async () => {
    if (!currentUser.id) return;
    setIsInitialLoading(true); // Only set loading on initial fetch
    try {
      const response = await api.get(
        `/api/v1/autotrade-bots/bots/user/${currentUser.id}`
      );
      // console.log(response);

      const sortedBots = response.data.bots.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // console.log(sortedBots);

      setBotDataList(sortedBots);

      setBotStates(
        sortedBots.reduce((acc, bot) => {
          acc[bot._id] = {
            isActive:
              bot.dynamicData[0]?.status === "Running" ||
              bot.dynamicData[0]?.status === "Schedule",
          };
          return acc;
        }, {})
      );

      // Assign colors to bots
      const colorMap = {};
      sortedBots.forEach((bot, index) => {
        colorMap[bot._id] = botColors[index % botColors.length];
      });
      setBotColorMap(colorMap);
    } catch (error) {
      console.error("Error fetching bots:", error);
    } finally {
      setIsInitialLoading(false);
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
        `api/v1/autotrade-bots/createBot/${currentUser.id}`,
        botData
      );
      if (response.status === 201) {
        await fetchBots();
        setTitle("Congratulations");
        setMessage(
          `${botData.name} has been successfully created. To activate it, you need to switch it ON.`
        );
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

  const updateBotDetails = async (botId, updateData) => {
    try {
      const response = await api.put(
        `/api/v1/autotrade-bots/users/${currentUser.id}/bots/${botId}`,
        updateData
      );
      if (response.status === 200) {
        await fetchBots();
        setTitle("Congratulations");
        setMessage(
          `${updateData.name} has been successfully updated. To activate it, you need to switch it ON.`
        );
        setConfirmationOpen(true);
      } else {
        console.error("Update failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating bot:", error.response.data.message);
      setTitle("Bot Update Error");
      setMessage(error.response.data.message);
      setConfirmationOpen(true);
    }
  };

  const deleteBot = async (botId, botName) => {
    try {
      const response = await api.delete(`/api/v1/autotrade-bots/bots/${botId}`);
      if (response.status === 200) {
        // Remove the deleted bot from the state immediately
        setBotDataList((prevBotDataList) =>
          prevBotDataList.filter((bot) => bot._id !== botId)
        );
        await fetchBots();
        setTitle("Bot Deleted");
        setMessage(`${botName} has been successfully deleted.`);
        setConfirmationOpen(true);
      } else {
        console.error("Deletion failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting bot:", error.response.data.message);
      setTitle("Error");
      setMessage(error.response.data.message);
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

    setTogglingBotId(botId);

    try {
      const bot = botDataList.find((b) => b._id === botId);
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

      setBotStates((prevStates) => ({
        ...prevStates,
        [botId]: {
          isActive: newStatus === "Running" || newStatus === "Schedule",
          status: newStatus,
        },
      }));

      await fetchBots(); // Refetch bots to get updated data
    } catch (error) {
      console.error("Error toggling bot status:", error);
      setTitle("Error");
      setMessage("Failed to update bot status. Please try again.");
      setConfirmationOpen(true);
    } finally {
      setTogglingBotId(null);
    }
  };

  const handleScheduleTrade = () => {
    setAutoTradeModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setAutoTradeModalOpen(false);
  };

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // const wsUrl = "ws://localhost:8080";
    const wsUrl = `${wsProtocol}//api.stockgenius.ai`;

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribeAllBotsTime",
          userId: currentUser.id,
        })
      );
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "allBotsTime") {
        setAllBotsTime({
          totalTodaysBotTime: parseInt(data.totalTodaysBotTime),
          totalCurrentWeekTime: parseInt(data.totalCurrentWeekTime),
        });
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error for all bots time:", error);
    };
    ws.onclose = () => {
      console.log("WebSocket disconnected for all bots time");
    };
    return () => {
      ws.close();
    };
  }, [currentUser.id]);

  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return "0h 0m 0s";
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }, []);

  const calculateCardData = useMemo(() => {
    const today = moment().tz("Asia/Kolkata").startOf("day");
    const startOfWeek = moment().tz("Asia/Kolkata").startOf("isoWeek");

    // Initialize accumulators
    let todayTotalInvestment = 0;
    let todayTotalProfit = 0;
    let weekTotalInvestment = 0;
    let weekTotalProfit = 0;
    let todayReInvestments = 0;

    botDataList.forEach((bot) => {
      const botCreatedAt = moment(bot.createdAt).tz("Asia/Kolkata");

      // Get the bot's profit and investment amounts
      let profitAmount = 0;
      let investmentAmount = 0;
      let reInvestmentCount = 0;

      if (bot.productType === "INTRADAY") {
        // For intraday bots, use positions data
        profitAmount = positions?.overall?.pl_total || 0;
        investmentAmount = positions?.overall?.buyVal || 0;
        reInvestmentCount =
          orders?.orderBook?.filter(
            (order) =>
              moment(order.orderDateTime).isSame(today, "day") &&
              order.productType === "INTRADAY"
          ).length || 0;
      } else if (bot.productType === "CNC") {
        // For CNC bots, use holdings data
        profitAmount = holdings?.overall?.total_pl || 0;
        investmentAmount = holdings?.overall?.total_investment || 0;
        reInvestmentCount =
          orders?.orderBook?.filter(
            (order) =>
              moment(order.orderDateTime).isSame(today, "day") &&
              order.productType === "CNC"
          ).length || 0;
      }

      // Calculate metrics for today's bots
      if (botCreatedAt.isSame(today, "day")) {
        todayTotalInvestment += investmentAmount;
        todayTotalProfit += profitAmount;
        todayReInvestments += reInvestmentCount;
      }

      // Calculate metrics for this week's bots
      if (botCreatedAt.isSameOrAfter(startOfWeek)) {
        weekTotalInvestment += investmentAmount;
        weekTotalProfit += profitAmount;
      }
    });

    // Calculate profit percentage for today
    const profitPercentage =
      investedAmount > 0
        ? ((todaysProfit / investedAmount) * 100).toFixed(2)
        : 0;

    return [
      {
        title: "Today's Profit",
        value: todaysProfit,
      },
      {
        title: "Today's Profit %",
        value: `${profitPercentage}%`,
      },
      {
        title: "Today's Bot Time",
        value: formatTime(allBotsTime.totalTodaysBotTime),
      },
      // {
      //   title: "Week's Bot Time",
      //   value: formatTime(allBotsTime.totalCurrentWeekTime),
      // },
      {
        title: "No. of AI Bots",
        value: botDataList.length.toString(),
      },
      {
        title: "Re-investments",
        value: todayReInvestments.toString(),
      },
      {
        title: "Total Investment",
        value: investedAmount.toFixed(2),
      },
      {
        title: "Total Profit",
        value: totalProfit,
      },
    ];
  }, [botDataList, allBotsTime, formatTime, holdings, positions, orders]);

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

        <div
          className={`lg:min-h-[85vh] news-table rounded-2xl ${
            isAITradingPage ? "bg-gradient" : "bg-white"
          }`}
        >
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

            <div className="flex gap-3">
              <div className="relative group">
                <Link to={"/india/paper-trading/portfolio"}>
                  <div className="bg-white rounded-2xl px-4 py-1">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F1724f58fc6384ce29b80e805d16be7d8"
                      alt="portfolio"
                    />
                  </div>
                </Link>
                <span className="absolute bottom-10 left-0 right-0 text-center font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Portfolio
                </span>
              </div>

              <div className="relative group">
                <Link to={"/india/paper-trading"}>
                  <div className="bg-[#3A6FF8] rounded-2xl px-4 py-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ff3ddd6a4e36e44b584511bae99659775"
                      alt="Paper Trading"
                    />
                  </div>
                </Link>
                <span className="absolute bottom-10 left-[-25px] right-0 text-center font-semibold dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Paper Trading
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
              {calculateCardData.map((card, index) => (
                <Cards key={index} title={card.title} value={card.value} />
              ))}
            </div>
          </div>

          <div className="p-4 overflow-scroll max-h-[60vh]">
            <div className="flex flex-col gap-10">
              {isInitialLoading ? ( // Only show loading on initial fetch
                <div className="w-full flex justify-center items-center">
                  <Loading />
                </div>
              ) : botDataList.length > 0 ? (
                botDataList.map((bot) => (
                  <PaperTradeBot
                    key={bot._id}
                    botData={bot}
                    isEnabled={botStates[bot._id].isActive}
                    onToggle={() => handleToggle(bot._id)}
                    updateBotDetails={updateBotDetails}
                    deleteBot={deleteBot}
                    loading={togglingBotId === bot._id} // Pass loading state to individual bot
                    color={botColorMap[bot._id]}
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
};

export default PaperTradingAutoTrade;
