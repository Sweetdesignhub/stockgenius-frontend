import React, { useEffect, useState } from "react";
import Bot from "../../components/aiTradingBots/Bot";

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
        { title: "Trade Ratio", value: "50%" },
        { title: "Profit Gained", value: "560743" },
        { title: "Working Time", value: "8hr 45min" },
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
        { title: "Working Time", value: "8hr 45min" },
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
        { title: "Working Time", value: "8hr 45min" },
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
        { title: "Working Time", value: "8hr 45min" },
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

  const cardData = [
    { title: "Today's Profit %", value: "12%" },
    { title: "Last Week Profit %", value: "23.12%" },
    { title: "Today’s Bot Time", value: "3hr 23min" },
    { title: "Last Week Bot Time", value: "29hr 46min" },
    { title: "No. of AI Bots", value: botDataList.length },
    { title: "Re-investments", value: "42" },
    { title: "Total Investment", value: "42350.38" },
    { title: "Total Profit", value: "98675.91" },
  ];

 

  const isWithinTradingHours = () => {
    const now = new Date();
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istTime = new Date(now.getTime());

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    return (
      (hours > 9 || (hours === 9 && minutes >= 30)) &&
      (hours < 16 || (hours === 16 && minutes <= 30))
    );
  };

  const isAfterMarketClose = () => {
    const now = new Date();
    // const istOffset = 5.5 * 60 * 60 * 1000; // IST is GMT+5:30
    const istTime = new Date(now.getTime());

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    return hours > 16 || (hours === 16 && minutes > 30);
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

  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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
      return {
        ...prevStates,
        [botName]: {
          isActive: newIsActive,
          status: getBotStatus(newIsActive),
        },
      };
    });
  };
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
              <button className="bg-white text-sm py-2 font-semibold px-4 rounded-xl text-[#3A6FF8] mb-3 sm:mb-0 sm:mr-3 w-full sm:w-auto">
                Activate Bots
              </button>
              <button className="text-white text-sm py-2 font-semibold px-4 rounded-xl bg-[#3A6FF8] w-full sm:w-auto">
                Schedule
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
              {botDataList.map((bot) => (
                <Bot
                  key={bot.name}
                  botData={bot}
                  isEnabled={botStates[bot.name].isActive}
                  onToggle={() => handleToggle(bot.name)}
                  currentStatus={botStates[bot.name].status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITradingBots;
