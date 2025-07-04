/**
 * File: Bot
 * Description: This component provides a detailed interface for managing and viewing AI-powered trading bots. It displays real-time bot data such as trade ratio, profit gained, working time, balance, status, and other metrics, while offering options to activate, update, or delete a bot. The component dynamically handles different bot types (e.g., INTRADAY, CNC), supports live WebSocket updates for time-tracked metrics, and interacts with the backend for API calls to fetch, update, and activate bot settings. It also includes modals for user confirmations, real-time updates on bot activity, and alerts for bots created on different dates.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

3;
import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import moment from "moment-timezone";
import { useData } from "../../contexts/FyersDataContext";
import Loading from "../common/Loading";
import YesNoConfirmationModal from "../common/YesNoConfirmationModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useSelector } from "react-redux";
import api from "../../config";
import { isWithinTradingHours } from "../../utils/helper";
import { useTheme } from "../../contexts/ThemeContext";
import BotDropdown from "./BotDropdown";
import AutoTradeModal from "../brokers/AutoTradeModal";
import TradeRatioBar from "./TradeRatioBar";

function Bot({
  botData,
  isEnabled,
  onToggle,
  updateBotDetails,
  deleteBot,
  color,
}) {
  const {
    holdings = {},
    funds = { fund_limit: [{}] },
    positions = { overall: {} },
    trades = { tradeBook: [] },
    orders = { orderBook: [] },
    loading,
  } = useData();
  const { currentUser } = useSelector((state) => state.user);
  const fyersAccessToken = useSelector((state) => state.fyers);
  const [apiBotData, setApiBotData] = useState([]);
  const [activeBots, setActiveBots] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState("");

  const [isYesNoModalOpen, setYesNoModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(false);

  const currentStatus = apiBotData.dynamicData?.[0]?.status || "Schedule";

  const { theme } = useTheme();
  const valueColor = theme === "dark" ? "white" : "black";

  // Function to convert hex to RGB
  const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  };

  // Generate a unique ID for the filter
  const filterId = `color-filter-${botData._id}`;

  const [botTime, setBotTime] = useState({
    workingTime: 0,
    todaysBotTime: 0,
    currentWeekTime: 0,
  });
  const [isHistoricalBot, setIsHistoricalBot] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

  // Format the createdAt date to match the same format as today
  const botCreatedDate = moment(botData.createdAt)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD");

  const isCreatedToday = botCreatedDate === today;

  const createdAt = moment(apiBotData.createdAt)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD");

  const holdingsTotalPL = holdings?.overall?.total_pl?.toFixed(2) || "0.00";
  const positionTotalPL = positions?.overall?.pl_total?.toFixed(2) || "0.00";
  const availableFunds =
    funds?.fund_limit?.[9]?.equityAmount?.toFixed(2) || "0.00";

  // Compute profitGainedValue
  const calculateProfitGainedValue = () => {
    if (apiBotData.productType === "INTRADAY") {
      return createdAt === today
        ? positionTotalPL
        : apiBotData.dynamicData[0]?.profitGained || 0;
    }
    if (apiBotData.productType === "CNC") {
      return createdAt === today
        ? holdingsTotalPL
        : apiBotData.dynamicData[0]?.profitGained || 0;
    }
    return 0;
  };
  const profitGainedValue = calculateProfitGainedValue();

  // fetch bot api
  const fetchBotFromApi = useCallback(
    async (botId) => {
      try {
        const response = await api.get(
          `/api/v1/ai-trading-bots/users/${currentUser.id}/bots/${botId}`
        );

        setApiBotData(response.data);
      } catch (error) {
        console.error("Error fetching bot data from API:", error);
        setError("Failed to fetch bot data from API.");
      }
    },
    [currentUser.id]
  );

  useEffect(() => {
    if (botCreatedDate === today) {
      // Use context data if bot was created today
      setApiBotData(botData);
    } else {
      // Fetch from API if bot was created on a different date

      fetchBotFromApi(botData._id);
    }
  }, [botData, botCreatedDate, today, fetchBotFromApi]);

  //update bot api
  const updateBot = async (botId, updateData) => {
    try {
      // Perform the API update
      const response = await api.put(
        `/api/v1/ai-trading-bots/users/${currentUser.id}/bots/${botId}`,
        updateData
      );

      if (response.status === 200) {
        // Fetch the updated bot data from the API
        await fetchBotFromApi(botId);
      } else {
        console.error("Update failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating bot:", error);
    }
  };

  useEffect(() => {
    const today = moment().tz("Asia/Kolkata").startOf("day");
    const botCreatedDate = moment(botData.createdAt)
      .tz("Asia/Kolkata")
      .startOf("day");
    const isCreatedToday = botCreatedDate.isSame(today);

    if (!isCreatedToday) {
      setIsHistoricalBot(true);
      // Set initial historical values
      setBotTime({
        workingTime: parseInt(botData.dynamicData[0]?.workingTime || 0),
        todaysBotTime: 0, // Historical bots don't have today's time
        currentWeekTime: parseInt(botData.dynamicData[0]?.currentWeekTime || 0),
      });
      return; // Don't set up WebSocket for historical bots
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    const wsUrl = `${wsProtocol}//api.stockgenius.ai`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // console.log("WebSocket connected for bot:", botData._id);
      ws.send(JSON.stringify({ type: "subscribeBotTime", botId: botData._id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "botTime") {
        if (data.isHistorical) {
          setIsHistoricalBot(true);
          ws.close();
        }
        setBotTime({
          workingTime: parseInt(data.workingTime || 0),
          todaysBotTime: parseInt(data.todaysBotTime || 0),
          currentWeekTime: parseInt(data.currentWeekTime || 0),
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error for bot:", botData._id, error);
    };

    ws.onclose = () => {
      // console.log("WebSocket disconnected for bot:", botData._id);
    };

    return () => {
      ws.close();
    };
  }, [botData._id, botData.createdAt]);

  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return "0h 0m 0s";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }, []);

  const data = [
    {
      title: "Trade Ratio",
      value: apiBotData.dynamicData?.[0]?.tradeRatio || 0,
      valueColor: "#00FF47",
    },
    {
      title: "Profit Gained",
      value: profitGainedValue,
      valueColor,
    },
    {
      title: "Working Time",
      value: formatTime(botTime.workingTime),
      valueColor,
    },
    {
      title: "Total Balance",
      value:
        createdAt === today
          ? availableFunds
          : apiBotData.dynamicData?.[0]?.totalBalance || "0",
      valueColor,
    },
    {
      title: "Scheduled",
      value: moment(apiBotData.createdAt || botData.createdAt)
        .tz("Asia/Kolkata")
        .format("D MMM, h:mm a"),
      valueColor,
    },
    {
      title: "Number of Trades",
      value:
        createdAt === today
          ? trades?.tradeBook?.filter(
              (trade) => trade.productType === botData.productType
            )?.length || 0
          : apiBotData.dynamicData?.[0]?.numberOfTrades || 0,
      valueColor,
    },
    {
      title: "Percentage Gain",
      value: `${
        apiBotData.dynamicData?.[0]?.percentageGain ||
        botData.dynamicData[0]?.percentageGain ||
        "0"
      }%`,
      valueColor,
    },
    {
      title: "Reinvestment",
      value:
        createdAt === today
          ? orders?.orderBook?.filter(
              (order) => order.productType === botData.productType
            )?.length || 0
          : apiBotData.dynamicData?.[0]?.reInvestment || 0,
      valueColor,
    },
    {
      title: "Limits",
      value: `${
        apiBotData.dynamicData?.[0]?.limits?.toLocaleString() ||
        botData.dynamicData[0]?.limits?.toLocaleString() ||
        "0"
      }`,
      valueColor,
    },
    {
      title: "Status",
      value: currentStatus,
      valueColor:
        currentStatus === "Inactive"
          ? "#FF4D4D"
          : currentStatus === "Running"
          ? "#00FF47"
          : "#FFBF00",
    },
  ];

  const handleToggle = () => {
    if (!isCreatedToday) {
      setTitle("Cannot Activate Bot");
      setMessage("This bot cannot be activated as it was not created today.");
      setConfirmationModalOpen(true);
    } else {
      const newTitle = isEnabled ? "Deactivate Bot" : "Activate Bot";
      const newMessage = `Are you sure you want to ${
        isEnabled ? "deactivate" : "activate"
      } <strong>${botData.name}</strong>?`;

      setModalTitle(newTitle);
      setModalMessage(newMessage);
      setConfirmAction("toggle");
      setYesNoModalOpen(true);
    } 
  };

  //  API endpoint based on the bot type
  const getApiEndpoint = (action) => {
    if (createdAt === today) {
      const botType = apiBotData.productType;
      if (botType === "INTRADAY" || botType === "CNC") {
        return `/api/v1/users/${currentUser.id}/auto-trade-bot-${botType}/${action}/bots/${apiBotData._id}`;
      }
    }
    throw new Error("Invalid bot type or bot not created today");
  };

  const activateBot = async () => {
    try {
      const endpoint = getApiEndpoint("activate");
      const { profitPercentage, riskPercentage } = apiBotData;

      // Update the bot status
      await updateBot(apiBotData._id, {
        tradeRatio: 50,
        profitGained: profitGainedValue,
        // workingTime: formatTime(workingTime),
        totalBalance:
          createdAt === today
            ? availableFunds
            : apiBotData.dynamicData?.[0]?.totalBalance || "0",
        scheduled: today,
        numberOfTrades:
          createdAt === today
            ? trades.tradeBook?.length || 0
            : apiBotData.dynamicData?.[0]?.numberOfTrades || 0,
        percentageGain: 0,
        status: "Running",
        reInvestment:
          createdAt === today
            ? orders.orderBook?.length || 0
            : apiBotData.dynamicData?.[0]?.reInvestment || 0,
        limits: 0,
      });

      // Hit the activation API
      await api.post(endpoint, {
        marginProfitPercentage: profitPercentage,
        marginLossPercentage: riskPercentage,
      });

      setActiveBots((prevBots) => [
        ...prevBots,
        { id: botData._id, type: botData.productType },
      ]);

      // console.log("bot activated");
    } catch (error) {
      console.error("Error activating bot:", error);
    }
  };

  const deactivateBot = async () => {
    try {
      const endpoint = getApiEndpoint("deactivate");

      // Hit the deactivation API
      await api.patch(endpoint);

      // Update the bot status
      await updateBot(apiBotData._id, {
        tradeRatio: 50,
        profitGained: profitGainedValue,
        // workingTime: formatTime(workingTime),
        totalBalance:
          createdAt === today
            ? availableFunds
            : apiBotData.dynamicData?.[0]?.totalBalance || "0",
        numberOfTrades:
          createdAt === today
            ? trades.tradeBook?.length || 0
            : apiBotData.dynamicData?.[0]?.numberOfTrades || 0,
        percentageGain: 0,
        status: "Inactive",
        reInvestment:
          createdAt === today
            ? orders.orderBook?.length || 0
            : apiBotData.dynamicData?.[0]?.reInvestment || 0,
        limits: 0,
      });

      // Remove the bot from the activeBots state
      setActiveBots((prevBots) =>
        prevBots.filter((bot) => bot.id !== apiBotData._id)
      );

      // console.log("bot deactivated");
    } catch (error) {
      console.error("Error deactivating bot:", error);
    }
  };

  const handleConfirm = async () => {
    setYesNoModalOpen(false);

    if (confirmAction === "toggle") {
      const activeCNC = activeBots.some((bot) => bot.type === "CNC");
      const activeIntraday = activeBots.some((bot) => bot.type === "Intraday");

      // Check if current time is within trading hours

      if (!isEnabled) {
        if (botData.productType === "CNC" && activeCNC) {
          setTitle("Activation error");
          setMessage(
            "The CNC bot cannot be activated because another CNC bot is already scheduled."
          );
          setConfirmationModalOpen(true);
          return;
        }
        if (botData.productType === "Intraday" && activeIntraday) {
          setTitle("Activation error");
          setMessage(
            "The INTRADAY bot cannot be activated because another INTRADAY bot is already scheduled."
          );
          setConfirmationModalOpen(true);
          return;
        }

        if (fyersAccessToken) {
          // console.log("Updating status");

          // Get the current time in "Asia/Kolkata" time zone using moment-timezone
          const now = moment.tz("Asia/Kolkata");
          const userTime = now.clone();
          const today = userTime.format("YYYY-MM-DD");

          // Set cutoff times using moment
          const cutoffStart = now.clone().startOf("day"); // 12:00 AM IST
          const cutoffEnd = now
            .clone()
            .set({ hour: 9, minute: 15, second: 0, millisecond: 0 }); // 9:15 AM IST

          // Check if the user time falls within the schedule window
          if (userTime.isBetween(cutoffStart, cutoffEnd, null, "[]")) {
            // If user arrives between 12:00 AM and 9:30 AM, schedule the bot
            await updateBot(apiBotData._id, {
              tradeRatio: 50,
              profitGained: profitGainedValue,
              // workingTime: formatTime(userTime.toDate()), // Convert moment object back to Date if needed
              totalBalance:
                createdAt === today
                  ? availableFunds
                  : apiBotData.dynamicData?.[0]?.totalBalance || "0",
              scheduled: today,
              numberOfTrades:
                createdAt === today
                  ? trades.tradeBook?.length || 0
                  : apiBotData.dynamicData?.[0]?.numberOfTrades || 0,
              percentageGain: 0,
              status: "Schedule",
              reInvestment:
                createdAt === today
                  ? orders.orderBook?.length || 0
                  : apiBotData.dynamicData?.[0]?.reInvestment || 0,
              limits: 0,
            });

            // console.log("Bot scheduled");
          } else if (isWithinTradingHours()) {
            await activateBot();
          }
        } else {
          // alert("Connect your broker before activating the bot");
          setTitle("Activation Error");
          setMessage("Connect your broker before activating the bot");
          setConfirmationModalOpen(true);
          return;
        }
      } else {
        await deactivateBot();
      }

      onToggle();
    } else if (confirmAction === "delete") {
      // Deletion logic
      await deleteBot(botData._id, botData.name);
      // console.log("Bot deleted");
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false);
  };

  const darkThemeStyle = {
    boxShadow:
      "0px 9.67px 29.02px 0px #497BFFB2 inset, 0px 9.67px 38.7px 0px #3F4AAF80",
    borderImageSource:
      "linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), " +
      "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), " +
      "linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)",
    background:
      "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
  };

  // const lightThemeStyle = {
  //   background:
  //     "linear-gradient(180deg, rgba(150, 150, 150, 0.8) 0%, rgba(120, 120, 120, 1) 100%), " +
  //     "radial-gradient(146.13% 118.42% at 50% -15.5%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%)",
  // };

  // Handle Edit function - triggered when a bot is edited
  const handleEditBot = async (botId) => {
    // console.log(`Edit bot with ID: ${botId}`);
    if (apiBotData.dynamicData[0].status === "Running") {
      setTitle("Update Error");
      setMessage("To edit the bot details, please deactivate the bot.");
      setConfirmationModalOpen(true);
      return;
    }
    setAutoTradeModalOpen(true);
  };

  // Handle Delete function - triggered when a bot is deleted
  const handleDeleteBot = async (botId) => {
    // console.log(`Delete bot with ID: ${botId}`);
    if (apiBotData.dynamicData[0].status === "Running") {
      setTitle("Delete Error");
      setMessage("To delete the bot , please deactivate the bot first.");
      setConfirmationModalOpen(true);
      return;
    }

    setModalTitle("Delete Bot");
    setModalMessage(
      `Are you sure you want to delete <strong>${botData.name}</strong>?`
    );
    setConfirmAction("delete");
    setYesNoModalOpen(true);
    // setBots(bots.filter((bot) => bot.botId !== botId)); // For demonstration purposes, it removes the bot from state.
  };

  if (
    loading ||
    !apiBotData ||
    !apiBotData.dynamicData ||
    apiBotData.dynamicData.length === 0
  ) {
    return (
      <div className="w-full flex justify-center items-center">
        {/* <Loading /> */}
      </div>
    );
  }

  return (    <div
      style={theme === "dark" ? darkThemeStyle : { backgroundColor: "#FFFFFF" }}
      className="rounded-xl p-5 flex flex-col md:flex-row w-full"
    >
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={filterId}>
          <feFlood floodColor={color} result="flood" />
          <feComposite
            in="SourceGraphic"
            in2="flood"
            operator="arithmetic"
            k1="1"
            k2="0"
            k3="0"
            k4="0"
          />
        </filter>
      </svg>      <div className="flex flex-col items-center md:items-start md:w-1/4 w-full">
        <div className="flex items-center">
          <h1 className="mr-2 text-sm font-bold md:text-sm lg:text-sm xl:text-base" style={{ color: color }}>
            {botData.name}
          </h1>
          <img
            src={botData.image}
            alt={`${botData.name} logo`}
            className="w-3 h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5"
            style={{
              filter: `url(#${filterId})`,
            }}          />
        </div>
        <div className="py-4 md:py-4 lg:py-4 xl:py-6 text-center md:text-left">
          <div className="flex justify-center md:justify-start space-x-2 md:space-x-3">
            <h3 className="font-semibold text-[10px] md:text-xs lg:text-xs xl:text-sm mr-1 md:mr-2 text-[#16C8FA]">
              Profit % : <span>{botData.profitPercentage}</span>
            </h3>
            <h3 className="font-semibold text-[10px] md:text-xs lg:text-xs xl:text-sm text-[#FFC218]">
              Risk % : <span>{botData.riskPercentage}</span>
            </h3>
          </div>
          <h3 className="text-[10px] md:text-xs lg:text-xs xl:text-sm text-[#FF1010] mt-1">{botData.market}</h3>
          <p className="text-[10px] md:text-xs lg:text-xs xl:text-sm mt-1 md:mt-2 text-[#FF9800]">
            Product Type: {botData.productType}
          </p>
        </div>
        <div className="w-[90%] md:w-auto mx-auto">
          <img
            src={botData.extraImage}
            alt="Extra Info"
            className="w-full h-auto md:max-w-[90%] lg:max-w-[90%] xl:max-w-full"          />
        </div>
      </div>      <div className="flex flex-wrap justify-center md:justify-start md:w-[66%] w-full px-2 md:px-2 mt-2 md:mt-0">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center md:items-start justify-center w-1/2 md:w-1/5 mb-2 md:mb-2 px-1 md:px-1"
          >
            <h1 className="dark:text-[#A6B2CDB2] text-[black] text-[8px] md:text-[9px] lg:text-[9px] xl:text-[10px] mb-0.5">
              {item.title}
            </h1>
            {item.title === "Trade Ratio" ? (
              <TradeRatioBar ratio={item.value} />
            ) : (
              <p
                className={`text-[8px] md:text-[10px] lg:text-[10px] xl:text-xs font-semibold ${item.title === "Scheduled" ? "whitespace-nowrap" : ""}`}
                style={{ color: item.valueColor }}
              >
                {item.value}
              </p>
            )}
          </div>
        ))}      </div>      <div className="w-full md:w-[10%] lg:w-[8%] flex justify-center md:justify-end items-center gap-2 mt-4 md:mt-0">
        <Switch
          checked={isEnabled && currentStatus !== "Inactive"}
          onChange={handleToggle}          className="group relative flex h-5 md:h-[26px] lg:h-7 w-10 md:w-[46px] lg:w-[50px] cursor-pointer rounded-md bg-[#F01313] p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#37DD1C]"
        >
          <div className="absolute inset-0 flex items-center justify-between px-1">
            <span
              className={`z-10 text-[10px] md:text-[11px] lg:text-xs font-semibold transition-opacity duration-200 text-white ${
                isEnabled && currentStatus !== "Inactive"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              ON
            </span>
            <span
              className={`z-10 text-[10px] md:text-[11px] lg:text-xs font-semibold transition-opacity duration-200 text-white ${
                isEnabled && currentStatus !== "Inactive"
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            >
              OFF
            </span>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inline-block h-3.5 md:h-5 lg:h-5 w-3.5 md:w-5 lg:w-5 translate-x-0 rounded-sm bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5 md:group-data-[checked]:translate-x-[26px] lg:group-data-[checked]:translate-x-[29px]"
          />
        </Switch>
        <div>
          <BotDropdown
            botId={botData._id}
            onEdit={handleEditBot}
            onDelete={handleDeleteBot}
          />
        </div>
      </div>
      <YesNoConfirmationModal
        isOpen={isYesNoModalOpen}
        onClose={() => setYesNoModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirm}
      />

      <AutoTradeModal
        isOpen={autoTradeModalOpen}
        onClose={() => {
          setAutoTradeModalOpen(false);
        }}
        onUpdateBot={updateBotDetails}
        botData={botData}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleConfirmationClose}
        title={title}
        message={message}
        onConfirm={handleConfirmationClose}
      />
    </div>
  );
}

export default Bot;
