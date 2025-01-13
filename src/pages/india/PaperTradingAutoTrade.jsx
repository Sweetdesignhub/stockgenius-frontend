import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";
import AutoTradeModal from "../../components/brokers/AutoTradeModal";

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
  const location = useLocation();
  const isAITradingPage =
    location.pathname === "/india/paper-trading/auto-trade";

  const [autoTradeModalOpen, setAutoTradeModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleScheduleTrade = () => {
    setAutoTradeModalOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setAutoTradeModalOpen(false);
  };

  const createBot = async (botData) => {
    try {
      const response = await api.post(
        `api/v1/ai-trading-bots/createBot/${currentUser.id}`,
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

  const calculateCardData = [
    {
      title: "Today's Profit %",
      value: "12%",
    },
    {
      title: "Last Week Profit %",
      value: "23.12%",
    },
    {
      title: "Today's Bot Time",
      value: "3hr 23min",
    },
    {
      title: "Week's Bot Time",
      value: "29hr 46min",
    },
    {
      title: "No. of AI Bots",
      value: "06",
    },
    {
      title: "Re-investments",
      value: "42",
    },
    {
      title: "Total Investment",
      value: "42350.38",
    },
    {
      title: "Total Profit",
      value: "98675.91",
    },
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

        <div
          className={`lg:min-h-[85vh] news-table rounded-2xl ${
            isAITradingPage ? "bg-gradient" : "bg-white"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between p-4 border-[#FFFFFF1A] mx-5 border-b">
            <h2 className="font-semibold text-xl text-center lg:text-left mb-4 lg:mb-0">
              AI Trading Bot
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center w-full lg:w-auto justify-center items-center space-x-4 flex-grow">
              <button className="text-sm py-2 font-semibold px-4 rounded-xl bg-[#3A6FF8] dark:text-blue-700 dark:bg-white w-full sm:w-auto flex flex-col items-center text-white">
                <span>Activate Bots</span>
              </button>
              <button
                className="text-sm py-2 font-semibold text-blue-700 px-4 rounded-xl bg-white dark:text-white dark:bg-[#3A6FF8] w-full sm:w-auto flex flex-col items-center text-white"
                onClick={handleScheduleTrade}
              >
                <span>Schedule Bot</span>
              </button>
            </div>
            <div className="flex gap-3">
              <Link to={"/india/paper-trading/portfolio"}>
                <div className="bg-white rounded-2xl px-4 py-1">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F1724f58fc6384ce29b80e805d16be7d8"
                    alt="portfolio"
                  />
                </div>
              </Link>

              <Link to={"/india/paper-trading"}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ff3ddd6a4e36e44b584511bae99659775"
                  alt=""
                />
              </Link>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
              {calculateCardData.map((card, index) => (
                <Cards key={index} title={card.title} value={card.value} />
              ))}
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
