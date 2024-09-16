import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import moment from "moment";
import { useData } from "../../contexts/FyersDataContext";
import Loading from "../common/Loading";
import YesNoConfirmationModal from "../common/YesNoConfirmationModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useSelector } from "react-redux";
import api from "../../config";
import { isWithinTradingHours } from "../../utils/helper";
import { useBotTime } from "../../contexts/BotTimeContext";

// New component for Trade Ratio Bar
const TradeRatioBar = ({ ratio }) => {
  const percentage = isNaN(parseFloat(ratio)) ? 0 : parseFloat(ratio);
  const greenPercentage = percentage.toFixed(1);
  const redPercentage = (100 - percentage).toFixed(1);

  return (
    <div className="w-full max-w-[6rem] min-w-[4rem]">
      <div className="flex justify-between mb-1">
        <span className="text-[#00FF47] font-semibold text-xs">
          {greenPercentage}%
        </span>
        <span className="text-[#FF0000] font-semibold text-xs">
          {redPercentage}%
        </span>
      </div>
      <div className="w-full h-1.5 flex rounded-full overflow-hidden">
        <div
          style={{ width: `${greenPercentage}%` }}
          className="h-full bg-[#00FF47]"
        ></div>
        <div
          style={{ width: `${redPercentage}%`, backgroundColor: "#FF0000" }}
          className="h-full"
        ></div>
      </div>
    </div>
  );
};

function Bot({
  botData,
  isEnabled,
  onToggle,
  //  currentStatus,
  //  onUpdateWorkingTime,
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
  const [apiBotData, setApiBotData] = useState([]);
  const [activeBots, setActiveBots] = useState([]);
  const [isYesNoModalOpen, setYesNoModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // console.log(apiBotData?.dynamicData[0]?.status);
  const currentStatus = apiBotData.dynamicData?.[0]?.status || "Inactive";

  const { botTimes, updateBotTime, formatTime } = useBotTime();
  // Use botTimes from context
  const botTime = botTimes[botData._id] || { workingTime: 0, todaysBotTime: 0, currentWeekTime: 0 };
  const { workingTime, todaysBotTime, currentWeekTime } = botTime;

  // Get today's date in YYYY-MM-DD format
  const today = moment().format("YYYY-MM-DD");

  // Format the createdAt date to match the same format as today
  const botCreatedDate = moment(botData.createdAt).format("YYYY-MM-DD");

  const isCreatedToday = botCreatedDate === today;

  const createdAt = moment(apiBotData.createdAt).format("YYYY-MM-DD");

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
      await api.put(
        `/api/v1/ai-trading-bots/users/${currentUser.id}/bots/${botId}`,
        updateData
      );

      // Update localStorage after successful API update
      localStorage.setItem(`bot_${botId}_workingTime`, workingTime.toString());
    } catch (error) {
      console.error("Error updating bot :", error);
    }
  };

  // automatic hit deactive api, after that data to be updated at 3:30pm
  useEffect(() => {
    const getTimeUntil4PM = () => {
      const now = new Date();
      const next4PM = new Date();
      next4PM.setHours(15, 30, 0, 0);

      if (now > next4PM) {
        next4PM.setDate(next4PM.getDate() + 1);
      }

      return next4PM - now; // Time in milliseconds
    };

    const performUpdateRequest = async () => {
      try {
        const todaysBots = [apiBotData].filter((bot) => {
          const botCreatedDate = moment(bot.createdAt).format("YYYY-MM-DD");
          return botCreatedDate === today;
        });

        await Promise.all(
          todaysBots.map(async (bot) => {
            await deactivateBot();

            await updateBot(bot._id, {
              tradeRatio: 50,
              profitGained: profitGainedValue,
              workingTime: formatTime(workingTime),
              todaysBotTime: formatTime(todaysBotTime),
              currentWeekTime: formatTime(currentWeekTime),
              totalBalance:
                createdAt === today
                  ? availableFunds
                  : apiBotData.dynamicData?.[0]?.totalBalance || "0",
              numberOfTrades:
                createdAt === today
                  ? trades.tradeBook?.length || 0
                  : apiBotData.dynamicData?.[0]?.numberOfTrades || 0,
              percentageGain: 0,
              status: currentStatus,
              reInvestment:
                createdAt === today
                  ? orders.orderBook?.length || 0
                  : apiBotData.dynamicData?.[0]?.reInvestment || 0,
              limits: 0,
            });
          })
        );
      } catch (error) {
        console.error("Error performing update:", error);
      }
    };

    const timeUntil4PM = getTimeUntil4PM();
    const timeoutId = setTimeout(() => {
      performUpdateRequest();

      const intervalId = setInterval(performUpdateRequest, 24 * 60 * 60 * 1000); // 24 hours
      return () => clearInterval(intervalId); // Cleanup interval
    }, timeUntil4PM);

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [
    botData,
    currentUser.id,
    today,
    formatTime,
    profitGainedValue,
    availableFunds,
    trades,
    orders,
    currentStatus,
    todaysBotTime,
    currentWeekTime,
  ]);

  useEffect(() => {
    // Update bot time in context when status changes
    updateBotTime(botData._id, currentStatus);
  }, [currentStatus, botData._id, updateBotTime]);

  const data = [
    {
      title: "Trade Ratio",
      value: apiBotData.dynamicData?.[0]?.tradeRatio || 0,
      valueColor: "#00FF47",
    },
    {
      title: "Profit Gained",
      value: profitGainedValue,
      valueColor: "white",
    },
    {
      title: "Working Time",
      value: formatTime(workingTime),
      // value: `${
      //   apiBotData.dynamicData?.[0]?.workingTime ||
      //   botData.dynamicData[0]?.workingTime ||
      //   "0"
      // } hours`,
      valueColor: "white",
    },
    {
      title: "Total Balance",
      value:
        createdAt === today
          ? availableFunds
          : apiBotData.dynamicData?.[0]?.totalBalance || "0",
      valueColor: "white",
    },
    {
      title: "Scheduled",
      value: moment(apiBotData.createdAt || botData.createdAt).format(
        "D MMM, h:mm a"
      ),
      valueColor: "white",
    },
    {
      title: "Number of Trades",
      value:
        createdAt === today
          ? trades.tradeBook?.length || 0
          : apiBotData.dynamicData?.[0]?.numberOfTrades || 0,
      valueColor: "white",
    },
    {
      title: "Percentage Gain",
      value: `${apiBotData.dynamicData?.[0]?.percentageGain ||
        botData.dynamicData[0]?.percentageGain ||
        "0"
        }%`,
      valueColor: "white",
    },
    {
      title: "Reinvestment",
      value:
        createdAt === today
          ? orders.orderBook?.length || 0
          : apiBotData.dynamicData?.[0]?.reInvestment || 0,
      valueColor: "white",
    },
    {
      title: "Limits",
      value: `${apiBotData.dynamicData?.[0]?.limits?.toLocaleString() ||
        botData.dynamicData[0]?.limits?.toLocaleString() ||
        "0"
        }`,
      valueColor: "white",
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
      setConfirmationModalOpen(true);
    } else {
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
        workingTime: formatTime(workingTime),
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

      console.log("bot activated");
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
        workingTime: formatTime(workingTime),
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

      setActiveBots((prevBots) => [
        ...prevBots,
        { id: botData._id, type: botData.productType },
      ]);

      console.log("bot deactivated");
    } catch (error) {
      console.error("Error deactivating bot:", error);
    }
  };

  // is status = active then automatic start bot at 9:30am
  useEffect(() => {
    const getTimeUntil930AM = () => {
      const now = moment();
      const targetTime = now
        .clone()
        .startOf("day")
        .set({ hour: 9, minute: 30, second: 0 });
      if (now.isAfter(targetTime)) {
        targetTime.add(1, "day");
      }
      return targetTime.diff(now); // Time in milliseconds
    };

    const performActivationRequest = async () => {
      try {
        const todaysBots = [apiBotData].filter((bot) => {
          console.log("bot", bot);

          const botCreatedDate = moment(bot.createdAt).format("YYYY-MM-DD");
          return botCreatedDate === today;
        });

        await Promise.all(
          todaysBots.map(async (bot) => {
            if (currentStatus === "Schedule") {
              console.log("bot activated", bot);

              await activateBot();
            }
          })
        );
      } catch (error) {
        console.error("Error performing activation:", error);
      }
    };

    const timeUntil930AM = getTimeUntil930AM();
    const timeoutId = setTimeout(() => {
      console.log("started");

      performActivationRequest();
      console.log("ended");

      const intervalId = setInterval(
        performActivationRequest,
        24 * 60 * 60 * 1000
      ); // 24 hours
      return () => clearInterval(intervalId); // Cleanup interval
    }, timeUntil930AM);

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [apiBotData, currentStatus, today]);

  const handleConfirm = async () => {
    setYesNoModalOpen(false);

    const activeCNC = activeBots.some((bot) => bot.type === "CNC");
    const activeIntraday = activeBots.some((bot) => bot.type === "Intraday");

    // Check if current time is within trading hours
    if (isWithinTradingHours()) {
      if (!isEnabled) {
        if (botData.productType === "CNC" && activeCNC) {
          alert(
            "The CNC bot cannot be activated because another CNC bot is already scheduled."
          );
          return;
        }
        if (botData.productType === "Intraday" && activeIntraday) {
          alert(
            "The INTRADAY bot cannot be activated because another INTRADAY bot is already scheduled.."
          );
          return;
        }

        await activateBot();
      } else {
        await deactivateBot();
      }
    } else {
      console.log(
        "Bot can only be activated or deactivated during trading hours."
      );
    }

    onToggle();
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false);
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (
    !apiBotData ||
    !apiBotData.dynamicData ||
    apiBotData.dynamicData.length === 0
  ) {
    return <div>Error: Bot data is missing or empty</div>;
  }

  return (
    <div
      style={{
        boxShadow:
          "0px 9.67px 29.02px 0px #497BFFB2 inset, 0px 9.67px 38.7px 0px #3F4AAF80",
        borderImageSource:
          "linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), " +
          "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), " +
          "linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)",
        background:
          "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
      }}
      className="rounded-xl p-5 flex flex-col lg:flex-row w-full"
    >
      <div className="flex flex-col items-center lg:items-start lg:w-1/4 w-full">
        <div className="flex items-center">
          <h1 className="mr-2">{botData.name}</h1>
          <img src={botData.image} alt={`${botData.name} logo`} className="" />
        </div>
        <div className="py-6 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <h3 className="font-semibold text-md mr-2 text-[#63ECFF]">
              Profit % : <span>{botData.profitPercentage}</span>
            </h3>
            <h3 className="font-semibold text-md text-[#FBFF4E]">
              Risk % : <span>{botData.riskPercentage}</span>
            </h3>
          </div>
          <h3 className="text-sm text-[#FFA8A8]">{botData.market}</h3>
          {/* <p className="text-[10px] mt-1 text-[#A6B2CD]">{botData.timestamp}</p> */}
          <p className="text-sm mt-2 text-[#63ECFF]">
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
            className="flex flex-col items-center lg:items-start justify-center w-1/2 sm:w-1/3 lg:w-1/5 mb-4"
          >
            <h1 className="text-[#A6B2CDB2] text-xs mb-1">{item.title}</h1>
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

      <div className="w-full lg:w-[8%] flex justify-center lg:justify-end mt-4 lg:mt-0">
        <Switch
          checked={isEnabled && currentStatus !== "Inactive"}
          onChange={handleToggle}
          // disabled={!isCreatedToday}
          className="group relative flex h-6 w-14 cursor-pointer rounded-md bg-[#F01313] p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#37DD1C]"
        >
          <span
            className={`absolute right-2 top-1 text-xs font-semibold transition-opacity duration-200 ${isEnabled && currentStatus !== "Inactive"
              ? "opacity-0"
              : "opacity-100"
              }`}
          >
            OFF
          </span>

          <span
            className={`absolute left-2 top-1 text-xs font-semibold transition-opacity duration-200 ${isEnabled && currentStatus !== "Inactive"
              ? "opacity-100"
              : "opacity-0"
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
        title={isEnabled ? "Deactivate Bot" : "Activate Bot"}
        message={`Are you sure you want to ${isEnabled ? "deactivate" : "activate"
          } <strong>${botData.name}?</strong>`}
        onConfirm={handleConfirm}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleConfirmationClose}
        title="Cannot Activate Bot"
        message={`This bot cannot be activated as it was not created today.`}
        onConfirm={handleConfirmationClose}
      />
    </div>
  );
}

export default Bot;
