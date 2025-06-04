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
      const BACKEND_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : "https://api.stockgenius.ai";

      // Retrieve userId before making the request
      const userId = this.state?.userId || "defaultUserId"; // Fallback if userId is undefined
      const prompt = `
        You are a stock market assistant. Provide a brief (80–100 word) summary of the most relevant and recent news about the stock ticker "${ticker}" and its associated company. 
        If the ticker is not known or invalid, kindly suggest the user visit https://www.nseindia.com/ to verify the correct ticker symbol.
      `;

      const response = await axios.post(`${BACKEND_URL}/api/v1/chatbot/chats`, {
        userId, // Use stored userId
        prompt: prompt.trim(),
      });

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
    // try {
    //   const response = await axios.post(
    //     "https://chatbot.stockgenius.ai/Chatbot/NewsHighlights/",
    //     { ticker }
    //   );
    //   console.log("Summary", response);
    //   const summary = response.data?.Summary || "No summary available.";

    //   const newsMessage = this.createChatBotMessage(summary, {
    //     loading: false,
    //     terminateLoading: true,
    //   });

    //   this.setState((state) => ({
    //     ...state,
    //     awaitingTicker: false,
    //   }));
    //   this.addMessageToState(newsMessage);
    // } catch (error) {
    //   const errorMessage = this.createChatBotMessage(
    //     `An error occurred while fetching news for ${ticker}. Please try again.`
    //   );
    //   console.log("error is", error);
    //   this.addMessageToState(errorMessage);
    //   this.setState((state) => ({ ...state, awaitingTicker: false }));
    // }
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
        this.setState((state) => ({
          ...state,
          awaitingTickerForProfile: false,
        }));
      }
    } catch (error) {
      const errorMessage = this.createChatBotMessage(
        `An error occurred while fetching profile data for ${ticker}. Please try again.`
      );
      this.addMessageToState(errorMessage);
      this.setState((state) => ({ ...state, awaitingTickerForProfile: false }));
    }
  };

  askForTickerHistoricalPerformance = () => {
    const message = this.createChatBotMessage(
      "Please enter the ticker symbol you'd like to view historical performance for."
    );
    this.setState((state) => ({
      ...state,
      awaitingTickerForHistorical: true, // <-- new flag
      messages: [...state.messages, message],
    }));
  };



  fetchHistoricalPerformance = async (ticker) => {
    console.log("Inside Send To fetch historical: ", ticker);

    const loadingMessage = this.createChatBotMessage(
      `Fetching Historical Profile for ${ticker}...`,
      { loading: true, withAvatar: true }
    );
    this.addMessageToState(loadingMessage);
    try {
      const BACKEND_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : "https://api.stockgenius.ai";

      // Retrieve userId before making the request
      const userId = this.state?.userId || "defaultUserId"; // Fallback if userId is undefined
      const prompt = `
        You are a stock market assistant. Provide a brief (80-100 word) historical performance summary for the stock ticker "${ticker}". 
        If the ticker is not known or not valid, politely suggest the user visit https://www.nseindia.com/ to find correct details.
      `;
      const response = await axios.post(`${BACKEND_URL}/api/v1/chatbot/chats`, {
        userId, // Use stored userId
        prompt: prompt.trim(),
      });

      const botResponse = response.data?.response || "No response available.";

      const botMessage = this.createChatBotMessage(botResponse, {
        loading: false,
        terminateLoading: true,
      });


      this.addMessageToState(botMessage);

      this.setState((state) => ({
        ...state,
        awaitingTickerForHistorical: false,
      }));
    } catch (error) {
      console.error("Error fetching response from backend:", error);
      const errorMessage = this.createChatBotMessage(
        "An error occurred while processing your query. Please try again."
      );
      this.addMessageToState(errorMessage);
    }
    // try {
    //   const response = await axios.post(
    //     "https://chatbot.stockgenius.ai/Chatbot/TickerPerformance/",
    //     { ticker }
    //   );

    //   const performanceData = response.data["Trade Values"]; // Extract Trade Values directly

    //   if (performanceData && performanceData.length > 0) {
    //     const performanceMessage = this.createChatBotMessage(
    //       <HistoricalPerformanceChart performanceData={performanceData} />,
    //       {
    //         loading: false,
    //         terminateLoading: true,
    //       }
    //     );

    //     this.addMessageToState(performanceMessage);
    //   } else {
    //     const noPerformanceMessage = this.createChatBotMessage(
    //       `Sorry, no historical performance data found for ${ticker}.`
    //     );
    //     this.addMessageToState(noPerformanceMessage);
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   const errorMessage = this.createChatBotMessage(
    //     `An error occurred while fetching historical performance data for ${ticker}. Please try again.`
    //   );
    //   this.addMessageToState(errorMessage);
    // }
  };

  sendToBackend = async (message) => {
    console.log("Inside Send To Backend: ");

    // Store userId before updating state
    this.setState((state) => ({
      ...state,
      awaitingTicker: true,
      messages: [...state.messages, message],
    }));

    // const loadingMessage = this.createChatBotMessage(
    //   "Processing your query...",
    //   {
    //     loading: true,
    //     withAvatar: true,
    //   }
    // );
    // this.addMessageToState(loadingMessage);

    try {
      const BACKEND_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : "https://api.stockgenius.ai";

      // Retrieve userId before making the request
      const userId = this.state?.userId || "defaultUserId"; // Fallback if userId is undefined
      const response = await axios.post(`${BACKEND_URL}/api/v1/chatbot/chats`, {
        userId, // Use stored userId
        prompt: message,
      });

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
