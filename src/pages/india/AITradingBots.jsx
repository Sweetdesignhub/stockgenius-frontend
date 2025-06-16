import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import BrokerModal from "../../components/brokers/BrokerModal";
import AutoTradeModal from "../../components/brokers/AutoTradeModal";
import Bot from "../../components/aiTradingBots/Bot";
import NotAvailable from "../../components/common/NotAvailable";
import PlanSelectDialog from "../../components/pricing/PlanSelectDialog";
import api from "../../config";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import moment from "moment-timezone";
import {
  isAfterMarketClose,
  isBeforeMarketOpen,
  isWithinTradingHours,
} from "../../utils/helper";
import Loading from "../../components/common/Loading";
import { useTheme } from "@emotion/react";
import { useLocation } from "react-router-dom";

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
          borderColor: "rgba(0, 0, 0, 0.1)",
        };

  return (
    <div
      className="border-[0.1px] rounded-xl py-1 px-1 flex flex-col justify-center h-[60px] lg:h-[50px]"
      style={backgroundStyle}
    >
      <h1 className="text-xs lg:text-[10px] text-end whitespace-nowrap">{title}</h1>
      <h1 className="font-bold text-sm lg:text-xs text-end text-[#37DD1C] whitespace-nowrap">{value}</h1>
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [togglingBotId, setTogglingBotId] = useState(null);
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [botColorMap, setBotColorMap] = useState({});
  const [error, setError] = useState(null);
  const location = useLocation();
  const isAITradingPage = location.pathname === "/india/AI-Trading-Bots";

  const [allBotsTime, setAllBotsTime] = useState({
    totalTodaysBotTime: 0,
    totalCurrentWeekTime: 0,
  });

  const { currentUser } = useSelector((state) => state.user);
  const userPlan = currentUser?.plan || "basic";

  console.log("crt", currentUser); // Debug: Log currentUser

  const fetchBots = useCallback(
    async (retryCount = 0) => {
      if (!currentUser?.id) {
        if (retryCount < 3) {
          console.log("User ID missing, retrying...", retryCount + 1);
          setTimeout(() => fetchBots(retryCount + 1), 1000);
          return;
        }
        setIsInitialLoading(false);
        setError("User not logged in or user ID missing. Please refresh the page.");
        return;
      }

      setIsInitialLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        console.log("Fetching bots for userId:", currentUser.id);
        const response = await api.get(
          `/api/v1/ai-trading-bots/getBotsByUserId/${currentUser.id}`,
          { withCredentials: true, signal: controller.signal }
        );
        clearTimeout(timeoutId);
        console.log("AI bots response:", response.data, "Status:", response.status);

        if (!response?.data?.bots || !Array.isArray(response.data?.bots)) {
          throw new Error("Invalid bot data received from server");
        }

        const sortedBots = response.data.bots.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        sortedBots.forEach((bot) => {
          if (!bot._id || !bot.dynamicData || !Array.isArray(bot.dynamicData)) {
            console.warn(`Invalid bot data for bot ID ${bot._id || "unknown"}`, bot);
          }
        });

        setBotDataList(sortedBots);
        setBotStates(
          sortedBots.reduce((acc, curr) => {
            acc[curr._id] = {
              isActive: true,
              status:
                curr?.dynamicData?.[0]?.status ||
                curr?.status ||
                getBotStatus(curr?.dynamicData?.[0]?.isActive || false),
            };
            return acc;
          }, {})
        );

        const colorMap = {};
        sortedBots.forEach((bot, index) => {
          colorMap[bot._id] = botColors[index % botColors.length];
        });
        setBotColorMap(colorMap);
      } catch (error) {
        clearTimeout(timeoutId);
        console.error(
          "Error fetching bots:",
          error.message,
          error.response?.data,
          error.response?.status
        );
        if (error.name === "AbortError") {
          setError("Request timed out. Please check your connection and try again.");
        } else {
          setError(
            error.response?.data?.error ||
              `Failed to load bots: ${error.message}. Please try again later.`
          );
        }
      } finally {
        setIsInitialLoading(false);
      }
    },
    [currentUser?.id]
  );

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  useEffect(() => {
    const updateBotStates = () => {
      setBotStates((prevStates) => {
        const newStates = { ...prevStates };
        botDataList.forEach((bot) => {
          const isActive = bot?.dynamicData?.[0]?.isActive || false;
          newStates[bot._id] = {
            ...newStates[bot._id],
            status: getBotStatus(isActive),
          };
        });
        return newStates;
      });
    };

    updateBotStates();
    const intervalId = setInterval(updateBotStates, 60000);

    return () => clearInterval(intervalId);
  }, [botDataList]);

  const createBot = async (botData) => {
    if (userPlan === "basic") {
      setIsPricingDialogOpen(true);
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/ai-trading-bots/createBot/${currentUser.id}`,
        botData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        await fetchBots();
        setTitle("Success");
        setMessage(
          `${botData.name} has been successfully created. To activate it, you must enable it first`
        );
        setConfirmationOpen(true);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      setError(error.response?.data?.message || error.message);
      setMessage("Failed to create bot. Please try again.");
      setConfirmationOpen(true);
    }
  };

  const updateBotDetails = async (botId, botUpdateData) => {
    try {
      const response = await api.put(
        `/api/v1/ai-trading-bots/users/${currentUser.id}/${botId}`,
        botUpdateData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        await fetchBots();
        setTitle("Success");
        setMessage(`${botUpdateData.name} has been successfully updated.`);
        setConfirmationOpen(true);
      } else {
        throw new Error("Failed to update bot");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      setError(error.response?.data?.message || error.message);
      setMessage("Failed to update bot. Please try again.");
      setConfirmationOpen(true);
    }
  };

  const deleteBot = async (botId, botName) => {
    try {
      const response = await api.delete(
        `/api/v1/ai-trading-bots/users/${currentUser.id}/${botId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        await fetchBots();
        setTitle("Success");
        setMessage(`${botName} has been successfully deleted.`);
        setConfirmationOpen(true);
      } else {
        throw new Error("Failed to delete bot");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      setError(error.response?.data?.message || error.message);
      setMessage("Failed to delete bot. Please try again.");
      setConfirmationOpen(true);
    }
  };

  const handleToggle = async (botId) => {
    if (isAfterMarketClose()) {
      setTitle("Action Not Allowed");
      setMessage("You cannot activate bot after market close.");
      setConfirmationAction(() => () => setConfirmationOpen(false));
      setConfirmationOpen(true);
      return;
    }

    setTogglingBotId(botId);
    try {
      const bot = botDataList.find((b) => b._id === botId);
      if (!bot) throw new Error("Bot not found");

      const currStatus = botStates[botId]?.status || "Inactive";
      let newStatus;

      if (currStatus === "Running" || currStatus === "Schedule") {
        newStatus = "Inactive";
      } else {
        newStatus = isWithinTradingHours() ? "Running" : "Schedule";
      }

      const response = await api.put(
        `/api/v1/ai-trading-bots/users/${currentUser.id}/${botId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBotStates((prev) => ({
          ...prev,
          [botId]: { ...prev[botId], status: newStatus },
        }));
        await fetchBots();
      } else {
        throw new Error("Failed to toggle bot status");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.response?.data?.message || error.message);
      setMessage("Failed to update bot status. Please try again.");
      setConfirmationOpen(true);
    } finally {
      setTogglingBotId(null);
    }
  };

  const handleScheduleTrade = () => {
    if (userPlan === "basic") {
      setIsPricingDialogOpen(true);
      return;
    }
    setBrokerModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setMessage("");
    setTitle("");
    setConfirmationAction(null);
  };

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/api/v1/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          userId: currentUser?.id || "",
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "allBotsTime") {
        setAllBotsTime({
          totalTodaysBotTime: parseInt(data.totalTodaysBotTime) || 0,
          totalCurrentWeekTime: parseInt(data.totalCurrentWeekTime) || 0,
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => ws.close();
  }, [currentUser?.id]);

  const formatTime = useCallback((seconds) => {
    if (!seconds || seconds <= 0) {
      return "0 seconds";
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }, []);

  const calculateCardData = useMemo(() => {
    const today = moment().tz("Asia/Kolkata").startOf("day");
    const startOfWeek = moment().tz("Asia/Kolkata").startOf("isoWeek");

    let todayTotalInvestment = 0;
    let todayTotalProfit = 0;
    let weekTotalInvestment = 0;
    let weekTotalProfit = 0;
    let todayReInvestments = 0;

    botDataList.forEach((bot) => {
      const botCreatedAt = moment(bot.createdAt).tz("Asia/Kolkata");
      const profitAmount = bot?.dynamicData?.[0]?.profit || 0;
      const investmentAmount = bot?.dynamicData?.[0]?.investment || 0;
      const reInvestmentCount = bot?.dynamicData?.[0]?.reInvestments || 0;

      if (botCreatedAt.isSame(today, "day")) {
        todayTotalInvestment += investmentAmount;
        todayTotalProfit += profitAmount;
        todayReInvestments += reInvestmentCount;
      }

      if (botCreatedAt.isSameOrAfter(startOfWeek)) {
        weekTotalInvestment += investmentAmount;
        weekTotalProfit += profitAmount;
      }
    });

    const calculatePercentage = (profit, investment) => {
      if (investment === 0) return 0;
      return (profit / investment) * 100;
    };

    const todayProfitPercentage = calculatePercentage(todayTotalProfit, todayTotalInvestment);
    const weekProfitPercentage = calculatePercentage(weekTotalProfit, weekTotalInvestment);

    return [
      {
        title: "Today's Profit %",
        value: `${todayProfitPercentage.toFixed(2)}%`,
      },
      {
        title: "Last Week Profit %",
        value: `${weekProfitPercentage.toFixed(2)}%`,
      },
      {
        title: "Today's Bot Time",
        value: formatTime(allBotsTime.totalTodaysBotTime),
      },
      {
        title: "Week's Bot Time",
        value: formatTime(allBotsTime.totalCurrentWeekTime),
      },
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
        value: todayTotalInvestment.toFixed(2),
      },
      {
        title: "Total Profit",
        value: todayTotalProfit.toFixed(2),
      },
    ];
  }, [botDataList, allBotsTime, formatTime]);

  return (
    <div className="-z-10">
      <div className="min-h-fit lg:px-32 p-4 relative page-scrollbar">
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
          className={`news-table rounded-2xl min-h-[85vh] ${
            isAITradingPage ? "bg-gradient" : "bg-white/5 dark:bg-[rgba(5,5,5,0.2)] backdrop-blur-md border-white/10"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-[#FFFFFF1A] mx-5 border-b">
            <h2 className="font-semibold text-xl text-center md:text-left mb-4 md:mb-0">
              AI Trading Bots
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center w-full md:w-auto">
              <button
                className={`text-sm py-2 font-semibold px-4 rounded-xl ${
                  userPlan === "basic"
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white"
                    : "bg-[#3A6FF8] dark:text-blue-700 dark:bg-white text-white"
                } w-full sm:w-auto flex flex-col items-center`}
                onClick={handleScheduleTrade}
                disabled={userPlan === "basic"}
                title={
                  userPlan === "basic"
                    ? "Upgrade to Pro or Master to create bots"
                    : "Schedule a new bot"
                }
              >
                <span>Schedule Bot</span>
              </button>
            </div>
          </div>

          {userPlan === "basic" && (
            <div className="p-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  AI Trading Bots are available only for Pro and Master plans.{" "}
                  <button
                    onClick={() => setIsPricingDialogOpen(true)}
                    className="underline font-semibold hover:text-yellow-600 dark:hover:text-yellow-300"
                  >
                    Upgrade now
                  </button>{" "}
                  to create and manage bots.
                </p>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-2 xl:gap-2 lg:gap-1">
              {calculateCardData.map((card) => (
                <Cards key={card.title} title={card.title} value={card.value} />
              ))}
            </div>
          </div>

          <div className="p-4 overflow-scroll scrollbar-hide max-h-[60vh]">
            <div className="flex flex-col gap-4">
              {isInitialLoading ? (
                <div className="w-full flex justify-center items-center min-h-[200px]">
                  <Loading />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 dark:text-red-400">
                  <p>{error}</p>
                  <button
                    onClick={() => fetchBots()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : botDataList.length > 0 ? (
                botDataList.map((bot) => (
                  <Bot
                    key={bot._id}
                    botData={bot}
                    isEnabled={botStates[bot._id]?.isActive || false}
                    onToggle={() => handleToggle(bot._id)}
                    updateBotDetails={updateBotDetails}
                    deleteBot={deleteBot}
                    loading={togglingBotId === bot._id}
                    color={botColorMap[bot._id]}
                  />
                ))
              ) : (
                <div>
                  <NotAvailable
                    dynamicText={`<strong>No bots available.</strong> ${
                      userPlan === "basic"
                        ? "Upgrade to Pro or Master to activate Auto Trade Bots."
                        : "Activate Auto Trade Bot to start trading."
                    }`}
                  />
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
        onClose={() => setAutoTradeModalOpen(false)}
        onCreateBot={createBot}
      />
      <PlanSelectDialog
        isOpen={isPricingDialogOpen}
        onClose={() => setIsPricingDialogOpen(false)}
      />
      {message && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          onClose={handleConfirmationClose}
          title={title}
          message={message}
          onConfirm={confirmationAction || handleConfirmationClose}
        />
      )}
    </div>
  );
}

export default AITradingBots;