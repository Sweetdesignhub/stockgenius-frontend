

import { createChatBotMessage } from "react-chatbot-kit";
import Overview from "./widgets/Overview";
import RelevantNews from "./widgets/RelevantNews";
import CoBotAvatar from "./CoBotAvatar";
import ProfileAnalysis from "./widgets/ProfileAnalysis";
import HistoricalPerformance from "./widgets/HistoricalPerformance";

const config = (userId) => ({
  lang: "en",
  botName: "Stockgenius Agent",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#04668a",
    },
    chatButton: {
      backgroundColor: "#0f5faf",
    },
  },
  initialMessages: [
    createChatBotMessage("Welcome to StockGenius!"),
    createChatBotMessage(
      "How can I assist you today? Please choose one of the following options:",
      {
        widget: "overview",
      }
    ),
  ],
  state: {
    awaitingTicker: false,
    newsData: [],
    userId: userId || "12345", // Add userId to the state
  },
  customComponents: {
    botAvatar: (props) => <CoBotAvatar {...props} />,
  },
  widgets: [
    {
      widgetName: "overview",
      widgetFunc: (props) => <Overview {...props} />,
    },
    {
      widgetName: "relevantNews",
      widgetFunc: (props) => <RelevantNews {...props} />,
    },
    {
      widgetName: "profileAnalysis",
      widgetFunc: (props) => <ProfileAnalysis {...props} />,
      mapStateToProps: ["profileData"],
    },
    {
      widgetName: "historicalPerformance",
      widgetFunc: (props) => (
        <HistoricalPerformance performanceData={props.performanceData} />
      ),
    },
  ],
});

export default config;
