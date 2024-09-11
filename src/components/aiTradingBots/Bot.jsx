import React, { useCallback, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import moment from "moment";
import { useData } from "../../contexts/FyersDataContext";
import Loading from "../common/Loading";
import YesNoConfirmationModal from "../common/YesNoConfirmationModal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useSelector } from "react-redux";
import api from "../../config";

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
  currentStatus,
  onUpdateWorkingTime,
}) {
  const {
    holdings = {},
    funds = { fund_limit: [{}] },
    positions = { overall: {} },
    trades = { tradeBook: [] },
    orders = { orderBook: [] },
    loading,
  } = useData();
  // const [isModalOpen, setModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [apiBotData, setApiBotData] = useState([]);
  const [isYesNoModalOpen, setYesNoModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const [workingTime, setWorkingTime] = useState(0);

  // Get today's date in YYYY-MM-DD format
  const today = moment().format("YYYY-MM-DD");

  // Format the createdAt date to match the same format as today
  const botCreatedDate = moment(botData.createdAt).format("YYYY-MM-DD");

  const createdAt = moment(apiBotData.createdAt).format("YYYY-MM-DD");

  // const holdingsTotalPL = holdings.overall.total_pl.toFixed(2) || 0;
  const holdingsTotalPL = holdings?.overall?.total_pl?.toFixed(2) || "0.00";
  const positionTotalPL = positions?.overall?.pl_total?.toFixed(2) || "0.00";
  const availableFunds =
    funds?.fund_limit?.[9]?.equityAmount?.toFixed(2) || "0.00";

  // const positionTotalPL = positions.overall.pl_total.toFixed(2) || 0;
  // const availableFunds = funds.fund_limit[9].equityAmount.toFixed(2) || 0;

  // Compute profitGainedValue
  let profitGainedValue;
  if (apiBotData.productType === "INTRADAY") {
    profitGainedValue =
      createdAt === today
        ? positionTotalPL
        : apiBotData.dynamicData[0].profitGained;
  } else if (apiBotData.productType === "CNC") {
    profitGainedValue =
      createdAt === today
        ? holdingsTotalPL
        : apiBotData.dynamicData[0].profitGained;
  } else {
    profitGainedValue = 0;
  }

  // Determine if the bot data needs to be fetched from API or can be used from context
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
    let interval;
    if (currentStatus === "Running" && isEnabled) {
      interval = setInterval(() => {
        setWorkingTime((prevTime) => prevTime + 1);
        onUpdateWorkingTime(botData.name, 1); // Update by 1 second
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStatus, isEnabled, botData.name, onUpdateWorkingTime]);

  useEffect(() => {
    if (botCreatedDate === today) {
      // Use context data if bot was created today
      setApiBotData(botData);
    } else {
      // Fetch from API if bot was created on a different date

      fetchBotFromApi(botData._id);
    }
  }, [botData, botCreatedDate, today, fetchBotFromApi]);

   const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  useEffect(() => {
    const getTimeUntil1025PM = () => {
      const now = new Date();
      const next4PM = new Date();
      next4PM.setHours(16, 0, 0, 0);

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
            await api.put(
              `/api/v1/ai-trading-bots/users/${currentUser.id}/bots/${bot._id}`,
              {
                tradeRatio: 50,
                profitGained: profitGainedValue,
                workingTime: 0,
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
              }
            );
          })
        );
      } catch (error) {
        console.error("Error performing update:", error);
      }
    };

    const timeUntil1025PM = getTimeUntil1025PM();
    const timeoutId = setTimeout(() => {
      performUpdateRequest();

      const intervalId = setInterval(performUpdateRequest, 24 * 60 * 60 * 1000); // 24 hours
      return () => clearInterval(intervalId); // Cleanup interval
    }, timeUntil1025PM);

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [botData, currentUser.id, today]);

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
      value: `${
        apiBotData.dynamicData?.[0]?.percentageGain ||
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
      value: `$${
        apiBotData.dynamicData?.[0]?.limits?.toLocaleString() ||
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

  const isCreatedToday = botCreatedDate === today;

  // const handleConfirmationClose = () => {
  //   setModalOpen(false);
  // };

  // const handleToggle = () => {
  //   if (!isCreatedToday) {
  //     setModalOpen(true);
  //     return;
  //   }
  //   onToggle();
  // };

  const handleToggle = () => {
    if (!isCreatedToday) {
      setConfirmationModalOpen(true);
    }
     else {
      setYesNoModalOpen(true);
    }
  };

  const handleConfirm = () => {
    setYesNoModalOpen(false);
    onToggle();
  };

  const handleConfirmationClose = () => {
    setConfirmationModalOpen(false);
  };

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
          <p className="text-[10px] mt-1 text-[#A6B2CD]">{botData.timestamp}</p>
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
        message={`Are you sure you want to ${isEnabled ? "deactivate" : "activate"} <strong>${botData.name}?</strong>`}
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
