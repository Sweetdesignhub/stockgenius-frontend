import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import BrokerModal from "../../components/brokers/BrokerModal";
import AutoTradeModal from "../../components/brokers/AutoTradeModal";
import Modal from "../../components/common/Modal";
import Bot from "../../components/aiTradingBots/Bot";
import NotAvailable from "../../components/common/NotAvailable";

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
  const botDataList = [
    {
      name: "Bot 1",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fec1600c1a6ac4434aaa71d89b447fec8",
      profitPercentage: "12%",
      riskPercentage: "2%",
      market: "NSE NIFTY 100",
      timestamp: "21 Apr-2024 04:51",
      extraImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fab3b7e83271a4c3eb160f4e52b6158b4",
      dynamicData: [
        { title: "Trade Ratio", value: "80%" },
        { title: "Profit Gained", value: "560743" },
        { title: "Working Time", value: "0hr 0min" },
        { title: "Total Balance", value: "1347600.56" },
        { title: "Scheduled", value: "24 Apr 05:23 pm" },
        { title: "Number of trades", value: "373" },
        { title: "Percentage gain", value: "23.65%" },
        { title: "Status", value: "Active", valueColor: "#00FF47" },
        { title: "Re-Investment", value: "29" },
        { title: "Limits", value: "2000" },
      ],
    },
    {
      name: "Bot 2",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fec1600c1a6ac4434aaa71d89b447fec8",
      profitPercentage: "12%",
      riskPercentage: "2%",
      market: "NSE NIFTY 100",
      timestamp: "21 Apr-2024 04:51",
      extraImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fab3b7e83271a4c3eb160f4e52b6158b4",
      dynamicData: [
        { title: "Trade Ratio", value: "50%" },
        { title: "Profit Gained", value: "560743" },
        { title: "Working Time", value: "0hr 0min" },
        { title: "Total Balance", value: "1347600.56" },
        { title: "Scheduled", value: "24 Apr 05:23 pm" },
        { title: "Number of trades", value: "373" },
        { title: "Percentage gain", value: "23.65%" },
        { title: "Status", value: "Inactive", valueColor: "#FF4D4D" },
        { title: "Re-Investment", value: "29" },
        { title: "Limits", value: "2000" },
      ],
    },
    {
      name: "Bot 3",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fec1600c1a6ac4434aaa71d89b447fec8",
      profitPercentage: "12%",
      riskPercentage: "2%",
      market: "NSE NIFTY 100",
      timestamp: "21 Apr-2024 04:51",
      extraImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fab3b7e83271a4c3eb160f4e52b6158b4",
      dynamicData: [
        { title: "Trade Ratio", value: "50%" },
        { title: "Profit Gained", value: "560743" },
        { title: "Working Time", value: "0hr 0min" },
        { title: "Total Balance", value: "1347600.56" },
        { title: "Scheduled", value: "24 Apr 05:23 pm" },
        { title: "Number of trades", value: "373" },
        { title: "Percentage gain", value: "23.65%" },
        { title: "Status", value: "Inactive", valueColor: "#FF4D4D" },
        { title: "Re-Investment", value: "29" },
        { title: "Limits", value: "2000" },
      ],
    },
    {
      name: "Bot 4",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fec1600c1a6ac4434aaa71d89b447fec8",
      profitPercentage: "12%",
      riskPercentage: "2%",
      market: "NSE NIFTY 100",
      timestamp: "21 Apr-2024 04:51",
      extraImage:
        "https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fab3b7e83271a4c3eb160f4e52b6158b4",
      dynamicData: [
        { title: "Trade Ratio", value: "50%" },
        { title: "Profit Gained", value: "560743" },
        { title: "Working Time", value: "0hr 0min" },
        { title: "Total Balance", value: "1347600.56" },
        { title: "Scheduled", value: "24 Apr 05:23 pm" },
        { title: "Number of trades", value: "373" },
        { title: "Percentage gain", value: "23.65%" },
        { title: "Status", value: "Inactive", valueColor: "#FF4D4D" },
        { title: "Re-Investment", value: "29" },
        { title: "Limits", value: "2000" },
      ],
    },
  ];

  const [botWorkingTimes, setBotWorkingTimes] = useState({});
  const [botStartTimes, setBotStartTimes] = useState({});
  const [todayBotTime, setTodayBotTime] = useState(0);
  const [lastWeekBotTime, setLastWeekBotTime] = useState(0);
  const [dailyBotTimes, setDailyBotTimes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [brokerModalOpen, setBrokerModalOpen] = useState(false);
  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(false);
  const fyersAccessToken = useSelector((state) => state.fyers);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0hr 0min 0sec";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}hr ${minutes}min ${secs}sec`;
  };

  const isWithinTradingHours = () => {
    const now = new Date();
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istTime = new Date(now.getTime());

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    return (
      (hours > 9 || (hours === 9 && minutes >= 30)) &&
      (hours < 15 || (hours === 30 && minutes <= 30))
    );
  };

  const isAfterMarketClose = () => {
    const now = new Date();
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istTime = new Date(now.getTime());

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    return hours > 15 || (hours === 30 && minutes > 30);
  };

  const isBeforeMarketOpen = () => {
    const now = new Date();
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istTime = new Date(now.getTime());

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    return hours < 9 || (hours === 9 && minutes < 30);
  };

  const getBotStatus = (isActive) => {
    if (isAfterMarketClose()) {
      return "Inactive";
    } else if (isWithinTradingHours()) {
      return isActive ? "Running" : "Inactive";
    } else if (isBeforeMarketOpen()) {
      return isActive ? "Active" : "Inactive";
    } else {
      return "Inactive";
    }
  };

  const [botStates, setBotStates] = useState(() => {
    const initialStates = botDataList.reduce((acc, bot) => {
      acc[bot.name] = { isActive: false, status: "Inactive" };
      return acc;
    }, {});
    return initialStates;
  });

  const updateBotTime = useCallback(() => {
    const now = new Date();
    setBotWorkingTimes((prevTimes) => {
      const newTimes = { ...prevTimes };
      Object.keys(botStartTimes).forEach((botName) => {
        if (botStates[botName].status === "Running") {
          newTimes[botName] = (newTimes[botName] || 0) + 1; // Increment by 1 second
        }
      });
      return newTimes;
    });
  }, [botStartTimes, botStates]);

  useEffect(() => {
    const interval = setInterval(updateBotTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, [updateBotTime]);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const timeToMidnight = midnight - now;

    const midnightTimeout = setTimeout(() => {
      const totalDailyTime = Object.values(botWorkingTimes).reduce(
        (sum, time) => sum + time,
        0
      );
      setDailyBotTimes((prev) => {
        const newDailyTimes = [...prev, totalDailyTime];
        if (newDailyTimes.length > 7) newDailyTimes.shift(); // Keep only last 7 days
        return newDailyTimes;
      });
      setBotWorkingTimes({});
      setBotStartTimes({});
      setTodayBotTime(0);
    }, timeToMidnight);

    return () => clearTimeout(midnightTimeout);
  }, [botWorkingTimes]);

  useEffect(() => {
    const totalTime = Object.values(botWorkingTimes).reduce(
      (sum, time) => sum + time,
      0
    );
    setTodayBotTime(totalTime);

    const lastWeekTotal =
      dailyBotTimes.reduce((sum, time) => sum + time, 0) + totalTime;
    setLastWeekBotTime(lastWeekTotal);
  }, [botWorkingTimes, dailyBotTimes]);

  const handleToggle = (botName) => {
    if (isAfterMarketClose()) {
      alert(
        "You can't activate the bot after market closes, but you can schedule the bot tomorrow"
      );
      return;
    }

    setBotStates((prevStates) => {
      const currentState = prevStates[botName];
      const newIsActive =
        isWithinTradingHours() || isBeforeMarketOpen()
          ? !currentState.isActive
          : false;

      if (newIsActive) {
        setBotStartTimes((prev) => ({ ...prev, [botName]: new Date() }));
      } else {
        setBotStartTimes((prev) => {
          const newStartTimes = { ...prev };
          delete newStartTimes[botName];
          return newStartTimes;
        });
      }

      return {
        ...prevStates,
        [botName]: {
          isActive: newIsActive,
          status: getBotStatus(newIsActive),
        },
      };
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setActionType(null);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    console.log(
      `${actionType} action confirmed for bot:`,
      selectedRow,
      "Quantity:",
      quantity
    );
    setModalOpen(false);
  };

  const handleBotAction = (bot, action) => {
    setSelectedRow(bot);
    setActionType(action);
    setQuantity(1);
    setModalOpen(true);
  };

  const closeBrokerModal = () => {
    setBrokerModalOpen(false);
  };

  const closeAutoTradeModal = () => {
    setAutoTradeModalOpen(false);
  };

  const [activatedBots, setActivatedBots] = useState([]);
  const [isAutoTradeActivated, setIsAutoTradeActivated] = useState(false);
  const [availableBots, setAvailableBots] = useState([...botDataList]);
  const [isActivatingBot, setIsActivatingBot] = useState(false);

  const handleAutoTrade = () => {
    if (!fyersAccessToken) {
      setBrokerModalOpen(true);
      console.log("First connect to your broker to start auto trade feature.");
    } else {
      console.log(fyersAccessToken);
      console.log("Successfully connected to broker");
      setIsActivatingBot(true);
      setAutoTradeModalOpen(true);
    }
  };

  const activateBot = (botConfig) => {
    if (availableBots.length > 0) {
      const botToActivate = {
        ...availableBots[0],
        profitPercentage: botConfig.marginProfitPercentage,
        riskPercentage: botConfig.marginLossPercentage,
        productType: botConfig.productType,
      };
      setActivatedBots([...activatedBots, botToActivate]);
      setAvailableBots(availableBots.slice(1));
    }
  };

  const handleAutoTradeActivation = (isActivated, botConfig) => {
    if (!isAutoTradeActivated) {
      setIsAutoTradeActivated(true);
    }
    if (isActivated && availableBots.length > 0) {
      activateBot(botConfig);
    }
    setIsActivatingBot(false);
  };

  const handleActivateAnotherBot = () => {
    if (availableBots.length > 0) {
      setIsActivatingBot(true);
      setAutoTradeModalOpen(true);
    } else {
      alert("No more bots available for activation.");
    }
  };

  const cardData = [
    { title: "Today's Profit %", value: "12%" },
    { title: "Last Week Profit %", value: "23.12%" },
    { title: "Today's Bot Time", value: todayBotTime },
    { title: "Last Week Bot Time", value: lastWeekBotTime },
    { title: "No. of AI Bots", value: botDataList.length },
    { title: "Re-investments", value: "42" },
    { title: "Total Investment", value: "42350.38" },
    { title: "Total Profit", value: "98675.91" },
  ];

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
              {/* <button className="bg-white text-sm py-2 font-semibold px-4 rounded-xl text-[#3A6FF8] mb-3 sm:mb-0 sm:mr-3 w-full sm:w-auto">
                Activate Bots
              </button> */}
              {!isAutoTradeActivated ? (
                <button
                  className="text-gray-800 text-sm py-2 font-semibold px-4 rounded-xl bg-[#3A6FF8] dark:bg-blue-700 w-full sm:w-auto flex flex-col items-center dark:text-white"
                  onClick={handleAutoTrade}
                >
                  <span>Activate Auto Trade Bot</span>
                </button>
              ) : (
                <button
                  className="text-gray-800 text-sm py-2 font-semibold px-4 rounded-xl bg-[#3A6FF8] dark:bg-blue-700 w-full sm:w-auto flex flex-col items-center dark:text-white"
                  onClick={handleActivateAnotherBot}
                >
                  <span>Activate Auto Trade Bot</span>
                </button>
              )}
            </div>
          </div>

          {isAutoTradeActivated ? (
            <>
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
                  {cardData.map((card, index) => (
                    <Cards
                      key={index}
                      title={card.title}
                      value={
                        card.title.includes("Bot Time")
                          ? formatTime(card.value)
                          : card.value
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 overflow-scroll max-h-[60vh]">
                <div className="flex flex-col gap-10">
                  {activatedBots.map((bot) => (
                    <Bot
                      key={bot.name}
                      botData={{
                        ...bot,
                        dynamicData: bot.dynamicData.map((item) =>
                          item.title === "Working Time"
                            ? {
                                ...item,
                                value: formatTime(
                                  botWorkingTimes[bot.name] || 0
                                ),
                              }
                            : item.title === "Status"
                            ? {
                                ...item,
                                value:
                                  botStates[bot.name]?.status || "Inactive",
                                valueColor:
                                  botStates[bot.name]?.status === "Running"
                                    ? "#00FF47"
                                    : "#FF4D4D",
                              }
                            : item
                        ),
                      }}
                      isEnabled={botStates[bot.name]?.isActive || false}
                      onToggle={() => handleToggle(bot.name)}
                      currentStatus={botStates[bot.name]?.status || "Inactive"}
                      onAction={(action) => handleBotAction(bot, action)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-40">
              <NotAvailable dynamicText="<strong>No bots available.</strong> Activate Auto Trade Bot to start trading." />
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        rowData={selectedRow}
        actionType={actionType}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        handleConfirm={handleConfirm}
        handleInputChange={handleInputChange}
      />
      <BrokerModal isOpen={brokerModalOpen} onClose={closeBrokerModal} />
      <AutoTradeModal
        isOpen={autoTradeModalOpen}
        onClose={() => {
          setAutoTradeModalOpen(false);
          setIsActivatingBot(false);
        }}
        onActivate={handleAutoTradeActivation}
      />
    </div>
  );
}

export default AITradingBots;
