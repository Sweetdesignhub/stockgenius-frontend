// // import { createChatBotMessage } from "react-chatbot-kit";
// // import Options from "./widgets/Options";
// // import CoBotAvatar from "./CoBotAvatar";
// // import ProfileAnalysis from "./widgets/ProfileAnalysis";
// // import HistoricalPerformanceChart from "./widgets/HistoricalPerformanceChart";

// // const config = {
// //   botName: "StockBot",
// //   initialMessages: [
// //     createChatBotMessage("Hi! How can I assist you today?", {
// //       widget: "options",
// //     }),
// //   ],
// //   customStyles: {
// //     botMessageBox: {
// //       backgroundColor: "#1E3A8A", // Tailwind blue-900
// //     },
// //     chatButton: {
// //       backgroundColor: "#1E3A8A", // Tailwind blue-900
// //     },
// //   },
// //   state: {},
// //   customComponents: { botAvatar: (props) => <CoBotAvatar {...props} /> },
// //   widgets: [
// //     {
// //       widgetName: "options",
// //       widgetFunc: (props) => <Options {...props} />,
// //     },
// //     {
// //       widgetName: "profileAnalysis",
// //       widgetFunc: (props) => <ProfileAnalysis {...props} />,
// //     },
// //     {
// //       widgetName: "historicalPerformance",
// //       widgetFunc: (props) => <HistoricalPerformanceChart {...props} />,
// //     },
// //   ],
// // };

// // export default config;

// // src/chatbot/config.js

// import { createChatBotMessage } from "react-chatbot-kit";
// import Overview from "./widgets/Overview";
// import RelevantNews from "./widgets/RelevantNews";
// import ProfileAnalysis from "./widgets/ProfileAnalysis";
// import HistoricalPerformance from "./widgets/HistoricalPerformance";
// import CoBotAvatar from "./CoBotAvatar";

// const config = {
//   lang: "no",
//   botName: "CoBot",
//   customStyles: {
//     botMessageBox: {
//       backgroundColor: "#04668a",
//     },
//     chatButton: {
//       backgroundColor: "#0f5faf",
//     },
//   },
//   initialMessages: [
//     createChatBotMessage(`Welcome to StockGenius!`),
//     createChatBotMessage(
//       "How can I assist you today? Please choose one of the following options:",
//       {
//         withAvatar: false,
//         delay: 400,
//         widget: "overview",
//       }
//     ),
//   ],
//   state: {},
//   customComponents: { botAvatar: (props) => <CoBotAvatar {...props} /> },
//   widgets: [
//     {
//       widgetName: "overview",
//       widgetFunc: (props) => <Overview {...props} />,
//       mapStateToProps: ["messages"],
//     },
//     {
//       widgetName: "relevantNews",
//       widgetFunc: (props) => <RelevantNews />,
//     },
//     {
//       widgetName: "profileAnalysis",
//       widgetFunc: (props) => <ProfileAnalysis />,
//     },
//     {
//       widgetName: "historicalPerformance",
//       widgetFunc: (props) => <HistoricalPerformance />,
//     },
//   ],
// };

// export default config;

import { createChatBotMessage } from "react-chatbot-kit";
import Overview from "./widgets/Overview";
import RelevantNews from "./widgets/RelevantNews";
import CoBotAvatar from "./CoBotAvatar";
import ProfileAnalysis from "./widgets/ProfileAnalysis";
import HistoricalPerformance from "./widgets/HistoricalPerformance";

// const config = {
//   lang: "en",
//   botName: "StockBot",
//   customStyles: {
//     botMessageBox: {
//       backgroundColor: "#04668a",
//     },
//     chatButton: {
//       backgroundColor: "#0f5faf",
//     },
//   },
//   initialMessages: [
//     createChatBotMessage("Welcome to StockGenius!"),
//     createChatBotMessage(
//       "How can I assist you today? Please choose one of the following options:",
//       {
//         widget: "overview",
//       }
//     ),
//   ],
//   state: {
//     awaitingTicker: false,
//     newsData: [],
//   },
//   customComponents: {
//     botAvatar: (props) => <CoBotAvatar {...props} />,
//   },
//   widgets: [
//     {
//       widgetName: "overview",
//       widgetFunc: (props) => <Overview {...props} />,
//     },
//     {
//       widgetName: "relevantNews",
//       widgetFunc: (props) => <RelevantNews {...props} />,
//     },
//     {
//       widgetName: "profileAnalysis",
//       widgetFunc: (props) => <ProfileAnalysis {...props} />,
//       mapStateToProps: ["profileData"],
//     },
//     {
//       widgetName: "historicalPerformance",
//       widgetFunc: (props) => (
//         <HistoricalPerformance performanceData={props.performanceData} />
//       ),
//     },
//   ],
// };

// export default config;

const config = (userId) => ({
  lang: "en",
  botName: "StockBot",
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
