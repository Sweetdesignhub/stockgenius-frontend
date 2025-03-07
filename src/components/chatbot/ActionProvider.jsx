// // import React from "react";
// // import HistoricalPerformanceChart from "./widgets/HistoricalPerformanceChart"; // Import the chart widget
// // import { fetchTickerData } from "./api";

// // class ActionProvider {
// //   constructor(createChatBotMessage, setStateFunc) {
// //     this.createChatBotMessage = createChatBotMessage;
// //     this.setState = setStateFunc;
// //   }

// //   askForTicker = (type) => {
// //     const message = this.createChatBotMessage(
// //       `Please provide the ticker for ${type}:`
// //     );
// //     this.updateChatbotState(message);

// //     this.setState((prevState) => ({
// //       ...prevState,
// //       waitingForTicker: type,
// //     }));
// //   };

// //   handleTickerInput = (ticker) => {
// //     this.setState((prevState) => {
// //       const type = prevState.waitingForTicker;

// //       if (type) {
// //         const endpointMap = {
// //           "Relevant News": "https://chatbot.stockgenius.ai/Chatbot/NewsHighlights/",
// //           "Profile Analysis": "https://chatbot.stockgenius.ai/Chatbot/ProfileOverview/",
// //           "Historical Performance": "https://chatbot.stockgenius.ai/Chatbot/TickerPerformance/",
// //         };

// //         const endpoint = endpointMap[type];
// //         if (endpoint) {
// //           this.fetchData(endpoint, ticker, type.toLowerCase());
// //         }
// //       }

// //       return { ...prevState, waitingForTicker: null };
// //     });
// //   };

// //   fetchData = async (endpoint, ticker, type) => {
// //     try {
// //       const data = await fetchTickerData(endpoint, ticker);

// //       console.log("Fetched Data:", data); // Log the fetched data

// //       let message;

// //       if (type === "historical performance") {
// //         // Render chart widget for historical performance
// //         message = this.createChatBotMessage("Here is the historical performance data:", {
// //           widget: "historicalPerformance",
// //           payload: data, // Pass the fetched data as payload
// //           loading: true,
// //           terminateLoading: true,
// //           withAvatar: true,
// //         });
// //       }

// //       this.updateChatbotState(message);
// //     } catch (error) {
// //       const errorMessage = this.createChatBotMessage(
// //         `Sorry, I couldn't fetch the ${type} data. Please check the ticker and try again.`
// //       );
// //       this.updateChatbotState(errorMessage);
// //       console.error("Error fetching data:", error); // Log the error
// //     }
// //   };


// //   formatSummary(summary) {
// //     const lines = summary
// //       .replace(/\*\*/g, "") // Remove any bold markdown (double asterisks)
// //       .split("\n\n") // Split the summary into paragraphs or points
// //       .map((item, index) => {
// //         if (index === 0) {
// //           return `${item.trim()}`;
// //         } else {
// //           return ` ${item.trim()}`;
// //         }
// //       })
// //       .join("\n\n");

// //     return lines;
// //   }

// //   formatProfileAnalysis(data) {
// //     return `
// //       ROI: ${data?.ROI || "N/A"}
// //       Volatility: ${data?.Volatility || "N/A"}
// //       Sentiment Score: ${data?.["Sentiment Score"] || "N/A"}
// //       RSI: ${data?.RSI || "N/A"}
// //     `;
// //   }

// //   updateChatbotState = (message) => {
// //     this.setState((prevState) => ({
// //       ...prevState,
// //       messages: [...prevState.messages, message],
// //     }));
// //   };
// // }

// // export default ActionProvider;

// // src/chatbot/ActionProvider.js


// class ActionProvider {
//   constructor(createChatBotMessage, setStateFunc, createClientMessage) {
//     this.createChatBotMessage = createChatBotMessage;
//     this.setState = setStateFunc;
//     this.createClientMessage = createClientMessage;
//   }
//   handleOptions = (options) => {
//     const message = this.createChatBotMessage(
//       "How can I help you? Below are some possible options.",
//       {
//         widget: "overview",
//         loading: true,
//         terminateLoading: true,
//         ...options
//       }
//     );

//     this.addMessageToState(message);
//   };

//   handleRelevantNews = () => {
//     const message = this.createChatBotMessage(
//       "Here's the latest Relevant News",
//       {
//         widget: "relevantNews",
//         loading: true,
//         terminateLoading: true,
//         withAvatar: true
//       }
//     );

//     this.addMessageToState(message);
//   };

//   handleProfileAnalysis = () => {
//     const message = this.createChatBotMessage(
//       "Here's the latest Profile Analysis",
//       {
//         widget: "profileAnalysis",
//         loading: true,
//         terminateLoading: true,
//         withAvatar: true
//       }
//     );

//     this.addMessageToState(message);
//   };

//   handleHistoricalPerformance = () => {
//     const message = this.createChatBotMessage(
//       "Here's the latest Historical Performance",
//       {
//         widget: "historicalPerformance",
//         loading: true,
//         terminateLoading: true,
//         withAvatar: true
//       }
//     );

//     this.addMessageToState(message);
//   };


//   handleThanks = () => {
//     const message = this.createChatBotMessage("You're welcome!");

//     this.addMessageToState(message);
//   };


//   addMessageToState = (message) => {
//     this.setState((state) => ({
//       ...state,
//       messages: [...state.messages, message]
//     }));
//   };
// }

// export default ActionProvider;


// import axios from "axios";
// import HistoricalPerformanceChart from "./widgets/HistoricalPerformanceChart";

// class ActionProvider {
//   constructor(createChatBotMessage, setStateFunc, createClientMessage) {
//     this.createChatBotMessage = createChatBotMessage;
//     this.setState = setStateFunc;
//     this.createClientMessage = createClientMessage;
//   }

//   askForTicker = () => {
//     const message = this.createChatBotMessage(
//       "Please enter the ticker symbol you'd like to get news for."
//     );
//     this.setState((state) => ({
//       ...state,
//       awaitingTicker: true,
//       messages: [...state.messages, message],
//     }));
//   };

//   fetchRelevantNews = async (ticker) => {
//     const loadingMessage = this.createChatBotMessage(
//       `Fetching news for ${ticker}...`,
//       { loading: true, withAvatar: true }
//     );
//     this.addMessageToState(loadingMessage);

//     try {
//       const response = await axios.post(
//         "https://chatbot.stockgenius.ai/Chatbot/NewsHighlights/",
//         { ticker }
//       );

//       const summary = response.data?.Summary || "No summary available.";


//       const newsMessage = this.createChatBotMessage(summary, {
//         loading: false,
//         terminateLoading: true,
//       });

//       this.setState((state) => ({
//         ...state,
//         awaitingTicker: false,
//       }));
//       this.addMessageToState(newsMessage);
//     } catch (error) {
//       const errorMessage = this.createChatBotMessage(
//         `An error occurred while fetching news for ${ticker}. Please try again.`
//       );
//       this.addMessageToState(errorMessage);
//       this.setState((state) => ({ ...state, awaitingTicker: false }));
//     }
//   };

//   askForTickerProfile = () => {
//     const message = this.createChatBotMessage(
//       "Please enter the ticker symbol you'd like to analyze."
//     );
//     this.setState((state) => ({
//       ...state,
//       awaitingTickerForProfile: true,
//       messages: [...state.messages, message],
//     }));
//   };

//   fetchProfileAnalysis = async (ticker) => {
//     const loadingMessage = this.createChatBotMessage(
//       `Fetching profile for ${ticker}...`,
//       { loading: true, withAvatar: true }
//     );
//     this.addMessageToState(loadingMessage);

//     try {
//       const response = await axios.post(
//         "https://chatbot.stockgenius.ai/Chatbot/ProfileOverview/",
//         { ticker }
//       );

//       const profile = response.data;

//       if (profile) {
//         const profileMessage = this.createChatBotMessage(
//           `Here's the profile analysis for ${ticker}:`,
//           {
//             widget: "profileAnalysis",
//             loading: false,
//             terminateLoading: true,
//           }
//         );

//         this.setState((state) => ({
//           ...state,
//           profileData: profile,
//           awaitingTickerForProfile: false,
//         }));

//         this.addMessageToState(profileMessage);
//       } else {
//         const noProfileMessage = this.createChatBotMessage(
//           `Sorry, no profile data found for ${ticker}.`
//         );
//         this.addMessageToState(noProfileMessage);
//         this.setState((state) => ({ ...state, awaitingTickerForProfile: false }));
//       }
//     } catch (error) {
//       const errorMessage = this.createChatBotMessage(
//         `An error occurred while fetching profile data for ${ticker}. Please try again.`
//       );
//       this.addMessageToState(errorMessage);
//       this.setState((state) => ({ ...state, awaitingTickerForProfile: false }));
//     }
//   };

//   askForTickerHistoricalPerformance = () => {
//     const message = this.createChatBotMessage(
//       "Please enter the ticker symbol you'd like to see the historical performance for."
//     );
//     this.setState((state) => ({
//       ...state,
//       awaitingTickerForPerformance: true,
//       messages: [...state.messages, message],
//     }));
//   };

//   fetchHistoricalPerformance = async (ticker) => {
//     const loadingMessage = this.createChatBotMessage(
//       `Fetching historical performance for ${ticker}...`,
//       { loading: true, withAvatar: true }
//     );
//     this.addMessageToState(loadingMessage);

//     try {
//       const response = await axios.post(
//         "https://chatbot.stockgenius.ai/Chatbot/TickerPerformance/",
//         { ticker }
//       );

//       // Log the entire response to verify structure
//       // console.log("API Response:", response.data);

//       const performanceData = response.data["Trade Values"]; // Extract Trade Values directly

//       if (performanceData && performanceData.length > 0) {
//         // Create a message with the chart component
//         const performanceMessage = this.createChatBotMessage(
//           <HistoricalPerformanceChart performanceData={performanceData} />,
//           {
//             loading: false,
//             terminateLoading: true,
//           }
//         );

//         // Add message to state
//         this.addMessageToState(performanceMessage);
//       } else {
//         const noPerformanceMessage = this.createChatBotMessage(
//           `Sorry, no historical performance data found for ${ticker}.`
//         );
//         this.addMessageToState(noPerformanceMessage);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       const errorMessage = this.createChatBotMessage(
//         `An error occurred while fetching historical performance data for ${ticker}. Please try again.`
//       );
//       this.addMessageToState(errorMessage);
//     }
//   };




//   addMessageToState = (message) => {
//     this.setState((state) => ({
//       ...state,
//       messages: [...state.messages, message],
//     }));
//   };
// }

// export default ActionProvider;

import axios from "axios";
import HistoricalPerformanceChart from "./widgets/HistoricalPerformanceChart";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  // works
  // Existing methods for stock-specific queries
  askForTicker = () => {

    console.log("Inside Send To ask for ticker: ");
    const message = this.createChatBotMessage(
      "Please enter the ticker symbol you'd like to get news for."
    );
    this.setState((state) => ({
      ...state,
      awaitingTicker: true,
      messages: [...state.messages, message],
    }));
  };

  // works
  fetchRelevantNews = async (ticker) => {
    console.log("Inside Send To fetch relevant news: ", ticker);

    const loadingMessage = this.createChatBotMessage(
      `Fetching news for ${ticker}...`,
      { loading: true, withAvatar: true }
    );
    this.addMessageToState(loadingMessage);

    try {
      const response = await axios.post(
        "https://chatbot.stockgenius.ai/Chatbot/NewsHighlights/",
        { ticker }
      );

      const summary = response.data?.Summary || "No summary available.";

      const newsMessage = this.createChatBotMessage(summary, {
        loading: false,
        terminateLoading: true,
      });

      this.setState((state) => ({
        ...state,
        awaitingTicker: false,
      }));
      this.addMessageToState(newsMessage);
    } catch (error) {
      const errorMessage = this.createChatBotMessage(
        `An error occurred while fetching news for ${ticker}. Please try again.`
      );
      this.addMessageToState(errorMessage);
      this.setState((state) => ({ ...state, awaitingTicker: false }));
    }
  };

  askForTickerProfile = () => {
    const message = this.createChatBotMessage(
      "Please enter the ticker symbol you'd like to analyze."
    );
    this.setState((state) => ({
      ...state,
      awaitingTickerForProfile: true,
      messages: [...state.messages, message],
    }));
  };

  // Works
  fetchProfileAnalysis = async (ticker) => {
    console.log("Inside Send To fetch Profile analysis: ", ticker);

    const loadingMessage = this.createChatBotMessage(
      `Fetching profile for ${ticker}...`,
      { loading: true, withAvatar: true }
    );
    this.addMessageToState(loadingMessage);

    try {
      const response = await axios.post(
        "https://chatbot.stockgenius.ai/Chatbot/ProfileOverview/",
        { ticker }
      );

      const profile = response.data;

      if (profile) {
        const profileMessage = this.createChatBotMessage(
          `Here's the profile analysis for ${ticker}:`,
          {
            widget: "profileAnalysis",
            loading: false,
            terminateLoading: true,
          }
        );

        this.setState((state) => ({
          ...state,
          profileData: profile,
          awaitingTickerForProfile: false,
        }));

        this.addMessageToState(profileMessage);
      } else {
        const noProfileMessage = this.createChatBotMessage(
          `Sorry, no profile data found for ${ticker}.`
        );
        this.addMessageToState(noProfileMessage);
        this.setState((state) => ({ ...state, awaitingTickerForProfile: false }));
      }
    } catch (error) {
      const errorMessage = this.createChatBotMessage(
        `An error occurred while fetching profile data for ${ticker}. Please try again.`
      );
      this.addMessageToState(errorMessage);
      this.setState((state) => ({ ...state, awaitingTickerForProfile: false }));
    }
  };

  fetchHistoricalPerformance = async (ticker) => {
    console.log("Inside Send To fetch historical: ", ticker);

    const loadingMessage = this.createChatBotMessage(
      `Fetching historical performance for ${ticker}...`,
      { loading: true, withAvatar: true }
    );
    this.addMessageToState(loadingMessage);

    try {
      const response = await axios.post(
        "https://chatbot.stockgenius.ai/Chatbot/TickerPerformance/",
        { ticker }
      );

      const performanceData = response.data["Trade Values"]; // Extract Trade Values directly

      if (performanceData && performanceData.length > 0) {
        const performanceMessage = this.createChatBotMessage(
          <HistoricalPerformanceChart performanceData={performanceData} />,
          {
            loading: false,
            terminateLoading: true,
          }
        );

        this.addMessageToState(performanceMessage);
      } else {
        const noPerformanceMessage = this.createChatBotMessage(
          `Sorry, no historical performance data found for ${ticker}.`
        );
        this.addMessageToState(noPerformanceMessage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = this.createChatBotMessage(
        `An error occurred while fetching historical performance data for ${ticker}. Please try again.`
      );
      this.addMessageToState(errorMessage);
    }
  };

  sendToBackend = async (message) => {
    console.log("Inside Send To Backend: ");

    // Store userId before updating state
    this.setState((state) => ({
      ...state,
      awaitingTicker: true,
      messages: [...state.messages, message],
    }));

    const loadingMessage = this.createChatBotMessage("Processing your query...", {
      loading: true,
      withAvatar: true,
    });
    this.addMessageToState(loadingMessage);

    try {
      // Retrieve userId before making the request
      const userId = this.state?.userId || "defaultUserId"; // Fallback if userId is undefined

      const response = await axios.post(
        "http://localhost:8080/api/v1/chatbot/chats",
        {
          userId, // Use stored userId
          prompt: message,
        }
      );

      const botResponse = response.data?.response || "No response available.";

      const botMessage = this.createChatBotMessage(botResponse, {
        loading: false,
        terminateLoading: true,
      });

      this.addMessageToState(botMessage);
    } catch (error) {
      console.error("Error fetching response from backend:", error);
      const errorMessage = this.createChatBotMessage(
        "An error occurred while processing your query. Please try again."
      );
      this.addMessageToState(errorMessage);
    }
  };

  // Helper function to add messages to the state
  addMessageToState = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message],
    }));
  };
}

export default ActionProvider;