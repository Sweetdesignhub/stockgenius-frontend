import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import BrokerModal from "../../components/brokers/BrokerModal";
import AutoTradeModal from "../../components/brokers/AutoTradeModal";
import Bot from "../../components/aiTradingBots/Bot";
import NotAvailable from "../../components/common/NotAvailable";
import api from "../../config";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import moment from "moment";

const startHour = 9;
const endHour = 15;

const isWithinTradingHours = () => {
  const now = new Date();
  // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
  const istTime = new Date(now.getTime());

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  return (
    (hours > startHour || (hours === startHour && minutes >= 30)) &&
    (hours < endHour || (hours === endHour && minutes <= 30))
  );
};

const isAfterMarketClose = () => {
  const now = new Date();
  // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
  const istTime = new Date(now.getTime());

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  return hours > endHour || (hours === endHour && minutes > 30);
};

const isBeforeMarketOpen = () => {
  const now = new Date();
  // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
  const istTime = new Date(now.getTime());

  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  return hours < startHour || (hours === startHour && minutes < 30);
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
  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [botWorkingTimes, setBotWorkingTimes] = useState({});
  const [todaysBotTime, setTodaysBotTime] = useState(0);
  const [lastWeekBotTime, setLastWeekBotTime] = useState(0);
  const [lastReset, setLastReset] = useState({
    daily: null,
    weekly: null
  });

  const fyersAccessToken = useSelector((state) => state.fyers);
  const { currentUser } = useSelector((state) => state.user);

  const fetchBots = useCallback(async () => {
    try {
      const response = await api.get(`/api/v1/ai-trading-bots/getBotsByUserId/${currentUser.id}`);
      const sortedBots = response.data.bots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBotDataList(sortedBots);
      setBotStates(sortedBots.reduce((acc, bot) => {
        acc[bot.name] = { isActive: false, status: "Inactive" };
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
        for (const botName of Object.keys(prevStates)) {
          const { isActive } = prevStates[botName];
          newStates[botName] = {
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

  const updateBotWorkingTime = useCallback((botName, seconds) => {
    setBotWorkingTimes(prev => {
      const updatedTimes = {
        ...prev,
        [botName]: (prev[botName] || 0) + seconds
      };

      // Update today's bot time
      const newTodaysBotTime = Object.values(updatedTimes).reduce((sum, time) => sum + time, 0);
      setTodaysBotTime(newTodaysBotTime);

      // Update this week's bot time
      setLastWeekBotTime(prevWeekTime => prevWeekTime + seconds);

      return updatedTimes;
    });
  }, []);

  useEffect(() => {
    const now = moment();
    const today = now.startOf('day');
    const startOfWeek = now.startOf('isoWeek'); // Monday

    // Check and reset daily
    if (!lastReset.daily || !moment(lastReset.daily).isSame(today, 'day')) {
      setTodaysBotTime(0);
      setBotWorkingTimes({});
      setLastReset(prev => ({ ...prev, daily: today.toDate() }));
    }

    // Check and reset weekly
    if (!lastReset.weekly || !moment(lastReset.weekly).isSame(startOfWeek, 'isoWeek')) {
      setLastWeekBotTime(0);
      setLastReset(prev => ({ ...prev, weekly: startOfWeek.toDate() }));
    }

    // Save to localStorage
    localStorage.setItem('botTimes', JSON.stringify({
      todaysBotTime,
      lastWeekBotTime,
      lastReset
    }));
  }, [todaysBotTime, lastWeekBotTime, lastReset]);

  useEffect(() => {
    // Load from localStorage on component mount
    const savedTimes = JSON.parse(localStorage.getItem('botTimes'));
    if (savedTimes) {
      setTodaysBotTime(savedTimes.todaysBotTime);
      setLastWeekBotTime(savedTimes.lastWeekBotTime);
      setLastReset(savedTimes.lastReset);
    }
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
        setMessage(`${botData.name} created successfully`);
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

  const handleToggle = (botName) => {
    if (isAfterMarketClose()) {
      setTitle("Action Not Allowed");
      setMessage("You can't activate the bot after market closes.");
      setConfirmationAction(() => () => setConfirmationOpen(false));
      setConfirmationOpen(true);
      return;
    }

    // setTitle("Confirm Action");
    // setMessage(`Are you sure you want to ${botStates[botName].isActive ? "deactivate" : "activate"} the bot?`);
    // setConfirmationAction(() => () => {
    setBotStates((prevStates) => {
      const currentState = prevStates[botName];
      const newIsActive =
        isWithinTradingHours() || isBeforeMarketOpen()
          ? !currentState.isActive
          : false;
      return {
        ...prevStates,
        [botName]: {
          isActive: newIsActive,
          status: getBotStatus(newIsActive),
        },
      };
    });
    //   setConfirmationOpen(false);
    //   });
    //   setConfirmationOpen(true);
  };


  // const handleToggle = (botName) => {
  //   if (isAfterMarketClose()) {
  //     setTitle("Action Not Allowed");
  //     setMessage("You can't activate the bot after market closes.");
  //     setConfirmationAction(() => () => setConfirmationOpen(false));
  //     setConfirmationOpen(true);
  //     return;
  //   }

  //   setTitle("Confirm Action");
  //   setMessage(`Are you sure you want to ${botStates[botName].isActive ? "deactivate" : "activate"} the bot?`);
  //   setConfirmationAction(() => () => {
  //     setBotStates((prevStates) => {
  //       const currentState = prevStates[botName];
  //       const newIsActive =
  //         isWithinTradingHours() || isBeforeMarketOpen()
  //           ? !currentState.isActive
  //           : false;
  //       return {
  //         ...prevStates,
  //         [botName]: {
  //           isActive: newIsActive,
  //           status: getBotStatus(newIsActive),
  //         },
  //       };
  //     });
  //     setConfirmationOpen(false);
  //   });
  //   setConfirmationOpen(true);
  // };

  const handleScheduleTrade = () => {
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

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setAutoTradeModalOpen(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const cardData = [
    { title: "Today's Profit %", value: "12%" },
    { title: "Last Week Profit %", value: "23.12%" },
    { title: "Today's Bot Time", value: formatTime(todaysBotTime) },
    { title: "Last Week Bot Time", value: formatTime(lastWeekBotTime) },
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
              <button
                className="text-gray-800 text-sm py-2 font-semibold px-4 rounded-xl bg-[#3A6FF8] bg-blue-700 dark:text-blue-700 dark:bg-white w-full sm:w-auto flex flex-col items-center text-white"
                onClick={handleScheduleTrade}
              >
                <span>Schedule Bot</span>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
              {cardData.map((card, index) => (
                <Cards key={index} title={card.title} value={card.value} />
              ))}
            </div>
          </div>

          <div className="p-4 overflow-scroll max-h-[60vh]">
            <div className="flex flex-col gap-10">
              {botDataList.length > 0 ? (
                botDataList.map((bot) => (
                  <Bot
                    key={bot.name}
                    botData={bot}
                    isEnabled={botStates[bot.name].isActive}
                    onToggle={() => handleToggle(bot.name)}
                    currentStatus={botStates[bot.name].status}
                    onUpdateWorkingTime={updateBotWorkingTime}
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
