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
import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import moment from "moment-timezone";
import YesNoConfirmationModal from "../common/YesNoConfirmationModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useSelector } from "react-redux";
import api from "../../config";
import { useTheme } from "../../contexts/ThemeContext";
import AutoTradeModal from "../brokers/AutoTradeModal";
import TradeRatioBar from "./TradeRatioBar";
import { usePaperTrading } from "../../contexts/PaperTradingContext";

function PaperTradeBot({ botData, updateBotDetails, color, fetchBots }) {
  const isEnabled = botData?.isActive;

  // Use the PaperTrading context
  const { funds, orders, trades, profitSummary, investedAmount } =
    usePaperTrading();

  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState("");

  const [isYesNoModalOpen, setYesNoModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(false);

  const { theme } = useTheme();
  const valueColor = theme === "dark" ? "white" : "black";

  // Generate a unique ID for the filter
  const filterId = `color-filter-${botData._id}`;

  const [botTime, setBotTime] = useState({
    workingTime: 0,
    todaysBotTime: 0,
    currentWeekTime: 0,
  });

  // Get today's date in YYYY-MM-DD format
  const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

  // Format the createdAt date to match the same format as today
  const botCreatedDate = moment(botData.createdAt)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD");

  // const isCreatedToday = botCreatedDate === today;

  const createdAt = moment(botData?.createdAt)
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD");

  const holdingsTotalPL = (profitSummary?.totalProfit || 0.0).toFixed(2);
  const positionTotalPL = (profitSummary?.todaysProfit || 0.0).toFixed(2);
  const availableFunds =
    (parseFloat(funds?.availableFunds) || 2000000).toFixed(2) || "0.00";

  // Compute profitGainedValue
  const calculateProfitGainedValue = () => {
    if (botData?.productType === "CNC") {
      return createdAt === today
        ? holdingsTotalPL
        : botData?.dynamicData[0]?.profitGained || 0;
    }
    return 0;
  };
  const profitGainedValue = calculateProfitGainedValue();

  // fetch bot api
  // const fetchBotFromApi = useCallback(
  //   async (botId) => {
  //     try {
  //       const response = await api.get(
  //         `/api/v1/autotrade-bots/bots/user/${currentUser.id}`
  //       );

  //     } catch (error) {
  //       console.error("Error fetching bot data from API:", error);
  //       setError("Failed to fetch bot data from API.");
  //     }
  //   },
  //   [currentUser.id]
  // );

  //update bot api
  const updateBot = async (botId, updateData) => {
    try {
      // Perform the API update
      const response = await api.put(
        `/api/v1/autotrade-bots/users/${currentUser.id}/bots/${botId}`,
        updateData
      );

      if (response.status === 200) {
        // Fetch the updated bot data from the API
        await fetchBots();
      } else {
        console.error("Update failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating bot:", error);
    }
  };

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    // const wsUrl = "ws://localhost:8080";
    // const wsUrl = `${wsProtocol}//api.stockgenius.ai`;
    const wsUrl =
      process.env.NODE_ENV === "development"
        ? "ws://localhost:8080"
        : `${wsProtocol}//api.stockgenius.ai`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribeBotTime", botId: botData._id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "botTime") {
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

  // const formatTime = useCallback((seconds) => {
  //   if (isNaN(seconds) || seconds < 0) {
  //     return "0h 0m 0s";
  //   }

  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;
  //   return `${hours}h ${minutes}m ${secs}s`;
  // }, []);

  const profitPercentage =
    investedAmount > 0
      ? ((profitSummary?.todaysProfit / investedAmount) * 100).toFixed(2)
      : 0;

  const filteredTrades = trades.filter((trade) => {
    const tradeDate = moment(trade.tradeDateTime)
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD");
    return tradeDate === today;
  });

  const filteredOrders =
    orders?.filter((order) => {
      const orderDate = moment(order.createdAt)
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD");
      return orderDate === today && order.action === "BUY"; // Only considering 'BUY' orders
    }) || [];

  // console.log(filteredOrders);

  const reinvestment = filteredOrders.reduce((total, order) => {
    // Calculate the value of each 'BUY' order and accumulate it for reinvestment
    return total + order.quantity * order.tradedPrice;
  }, 0);

  const data = [
    {
      title: "Profit Gained",
      value: positionTotalPL,
      valueColor,
    },
    // {
    //   title: "Working Time",
    //   value: formatTime(botTime.workingTime),
    //   valueColor,
    // },
    {
      title: "Total Balance",
      value:
        createdAt === today
          ? availableFunds
          : botData.dynamicData?.[0]?.totalBalance || "0",
      valueColor,
    },
    {
      title: "Scheduled",
      value: moment(botData.createdAt || botData.createdAt)
        .tz("Asia/Kolkata")
        .format("D MMM, h:mm a"),
      valueColor,
    },
    {
      title: "Number of Trades",
      value:
        filteredTrades?.length > 0
          ? filteredTrades.filter(
              (trade) => trade.productType === botData.productType
            )?.length || 0
          : botData.dynamicData?.[0]?.numberOfTrades || 0,
    },
    {
      title: "Percentage Gain",
      value: `${profitPercentage || "0"}%`,
      valueColor,
    },
    {
      title: "Reinvestment",
      value: reinvestment.toFixed(2),
      valueColor,
    },
    {
      title: "Status",
      value: isEnabled ? "Running" : "Inactive", // If isActive is true, show "Running", else "Inactive"
      valueColor: isEnabled // Check if the bot is active
        ? "#00FF47" // Green for Running
        : "#FF4D4D", // Red for Inactive
    },
  ];

  const handleToggle = () => {
    if (!isEnabled) {
      // If user is activating the bot
      const newTitle = "Activate Bot";
      const newMessage = `
      Are you sure you want to activate Default Bot with profit %${botData.profitPercentage} and loss %${botData.riskPercentage}?
      <br />
      <span style="color: blue; text-decoration: underline; cursor: pointer;" id="edit-link">To edit, click here.</span>
    `;

      setModalTitle(newTitle);
      setModalMessage(newMessage);
      setConfirmAction("toggle");
      setYesNoModalOpen(true);

      // Attach an event listener to the "edit" link after the modal is shown
      setTimeout(() => {
        const editLink = document.getElementById("edit-link");
        if (editLink) {
          editLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default behavior
            setYesNoModalOpen(false); // Close the Yes/No modal
            setAutoTradeModalOpen(true); // Open the edit modal
          });
        }
      }, 0);
    } else {
      // If user is deactivating the bot
      const newTitle = "Deactivate Bot";
      const newMessage = `Are you sure you want to deactivate <strong>${botData.name}</strong>?`;

      setModalTitle(newTitle);
      setModalMessage(newMessage);
      setConfirmAction("toggle");
      setYesNoModalOpen(true);
    }
  };

  // Function to check if it's trading hours
  const isTradingHours = () => {
    const now = new Date();
    const startTradingHour = new Date();
    const endTradingHour = new Date();

    startTradingHour.setHours(9, 15, 0); // 9:15 AM
    endTradingHour.setHours(15, 30, 0); // 3:30 PM

    return now >= startTradingHour && now <= endTradingHour;
  };

  const botId = botData?._id;

  // API endpoint based on the bot type
  const getApiEndpoint = (action) => {
    if (!botId) {
      throw new Error("Bot ID not found");
    }

    return `/api/v1/autoTradeBot/${action}/users/${currentUser.id}/bots/${botId}`;
  };

  // Activate Bot
  const activateBot = async () => {
    try {
      // Always update isActive regardless of trading hours
      // console.log("Updating isActive to true...");
      
      await api.patch(
        `/api/v1/autotrade-bots/users/${currentUser.id}/bots/${botId}/activate`
      );

      // If it's trading hours, do additional logic
      if (isTradingHours()) {
        // console.log("Activating bot during trading hours...");

        const endpoint = getApiEndpoint("activate");
        const { profitPercentage, riskPercentage } = botData;

        // Update the bot status
        await updateBot(botData._id, {
          tradeRatio: 50,
          profitGained: profitGainedValue,
          totalBalance:
            createdAt === today
              ? availableFunds
              : botData.dynamicData?.[0]?.totalBalance || "0",
          scheduled: today,
          numberOfTrades:
            createdAt === today
              ? trades.tradeBook?.length || 0
              : botData.dynamicData?.[0]?.numberOfTrades || 0,
          percentageGain: 0,
          status: "Running",
          reInvestment:
            createdAt === today
              ? orders.orderBook?.length || 0
              : botData.dynamicData?.[0]?.reInvestment || 0,
          limits: 0,
        });

        // Hit the activation API
        await api.post(endpoint, {
          marginProfitPercentage: profitPercentage,
          marginLossPercentage: riskPercentage,
        });

        // console.log("Bot fully activated during trading hours");
      } else {
        // console.log(
        //   "Bot activated outside of trading hours (only isActive updated)"
        // );
      }

      await fetchBots();
    } catch (error) {
      console.error("Error activating bot:", error);
    }
  };

  // Deactivate Bot
  const deactivateBot = async () => {
    try {
      // Always update isActive regardless of trading hours
      // console.log("Updating isActive to false...");
      await api.patch(
        `/api/v1/autotrade-bots/users/${currentUser.id}/bots/${botId}/activate`
      );

      // If it's trading hours, do additional logic
      if (isTradingHours()) {
        // console.log("Deactivating bot during trading hours...");

        // Update the bot status
        await updateBot(botData._id, {
          tradeRatio: 50,
          profitGained: profitGainedValue,
          totalBalance:
            createdAt === today
              ? availableFunds
              : botData.dynamicData?.[0]?.totalBalance || "0",
          numberOfTrades:
            createdAt === today
              ? trades.tradeBook?.length || 0
              : botData.dynamicData?.[0]?.numberOfTrades || 0,
          percentageGain: 0,
          status: "Inactive",
          reInvestment:
            createdAt === today
              ? orders.orderBook?.length || 0
              : botData.dynamicData?.[0]?.reInvestment || 0,
          limits: 0,
        });

        // Hit the deactivation API
        await api.post(getApiEndpoint("deactivate"));

        // console.log("Bot fully deactivated during trading hours");
      } else {
        // console.log(
        //   "Bot deactivated outside of trading hours (only isActive updated)"
        // );
      }

      await fetchBots();
    } catch (error) {
      console.error("Error deactivating bot:", error);
    }
  };

  const handleConfirm = async () => {
    setYesNoModalOpen(false);

    if (confirmAction === "toggle") {
      if (!isEnabled) {
        await activateBot();
      } else {
        await deactivateBot();
      }

      // onToggle();
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

  return (
    <div
      style={theme === "dark" ? darkThemeStyle : { backgroundColor: "#FFFFFF" }}
      className="rounded-xl p-5 flex flex-col lg:flex-row w-full"
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
      </svg>

      <div className="flex flex-col items-center lg:items-start lg:w-1/4 w-full">
        <div className="flex items-center">
          <h1 className="mr-4 font-bold" style={{ color: color }}>
            {botData.name}
          </h1>
          <img
            src={botData.image}
            alt={`${botData.name} logo`}
            className=""
            style={{
              filter: `url(#${filterId})`,
              width: "20px",
              height: "20px",
            }} // Apply SVG filter and set dimensions
          />
        </div>
        <div className="py-6 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <h3 className="font-semibold text-md mr-2 text-[#16C8FA]">
              Profit % : <span>{botData.profitPercentage}</span>
            </h3>
            <h3 className="font-semibold text-md text-[#FFC218]">
              Risk % : <span>{botData.riskPercentage}</span>
            </h3>
          </div>
          <h3 className="text-sm text-[#FF1010]">{botData.market}</h3>
          {/* <p className="text-[10px] mt-1 text-[#A6B2CD]">{botData.timestamp}</p> */}
          <p className="text-sm mt-2 text-[#FF9800]">
            Product Type: {botData.productType}
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <img
            src={botData.extraImage}
            alt="Extra Info"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center lg:justify-start lg:w-[66%] w-full px-4 mt-4 lg:mt-0">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center lg:items-start justify-center w-1/2 sm:w-1/3 lg:w-[25%] mb-4"
          >
            <h1 className="dark:text-[#A6B2CDB2] text-[black] text-xs mb-1">
              {item.title}
            </h1>
            {item.title === "Trade Ratio" ? (
              <TradeRatioBar ratio={item.value} />
            ) : (
              <p
                className="text-sm font-semibold"
                style={{ color: item.valueColor }}
              >
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* // Switch component for toggling */}
      <div className="w-full lg:w-[8%] flex justify-center lg:justify-end mt-4 lg:mt-0">
        <Switch
          checked={isEnabled} // Switch state should reflect bot's isActive status
          onChange={handleToggle} // Call handleToggle on state change
          className="group relative flex h-6 w-14 cursor-pointer rounded-md bg-[#F01313] p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#37DD1C]"
        >
          <span
            className={`absolute right-2 top-1 text-xs font-semibold transition-opacity duration-200 ${
              isEnabled ? "opacity-0" : "opacity-100"
            }`}
          >
            OFF
          </span>

          <span
            className={`absolute left-2 top-1 text-xs font-semibold transition-opacity duration-200 ${
              isEnabled ? "opacity-100" : "opacity-0"
            }`}
          >
            ON
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block w-4 h-4 translate-x-0 rounded-sm bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
          />
        </Switch>
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

export default PaperTradeBot;