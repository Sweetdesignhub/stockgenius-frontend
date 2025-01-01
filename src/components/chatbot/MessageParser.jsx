// // class MessageParser {
// //   constructor(actionProvider, state) {
// //     this.actionProvider = actionProvider;
// //     this.state = state;
// //   }

// //   parse(message) {
// //     if (this.state.waitingForTicker) {
// //       this.actionProvider.handleTickerInput(message);
// //     } else {
// //       const lowerCaseMessage = message.toLowerCase();

// //       if (lowerCaseMessage.includes("news")) {
// //         this.actionProvider.askForTicker("Relevant News");
// //       } else if (lowerCaseMessage.includes("profile")) {
// //         this.actionProvider.askForTicker("Profile Analysis");
// //       } else if (lowerCaseMessage.includes("performance")) {
// //         this.actionProvider.askForTicker("Historical Performance");
// //       } else {
// //         const defaultMessage = this.actionProvider.createChatBotMessage(
// //           "I didn't understand that. Please try again."
// //         );
// //         this.actionProvider.updateChatbotState(defaultMessage);
// //       }
// //     }
// //   }
// // }

// // export default MessageParser;

// class MessageParser {
//   constructor(actionProvider, state) {
//     this.actionProvider = actionProvider;
//     this.state = state;
//   }

//   parse(message) {
//     message = message.toLowerCase();
//     console.log(message);

//     if (
//       message.includes("options") ||
//       message.includes("help") ||
//       message.includes("do for me")
//     ) {
//       return this.actionProvider.handleOptions({ withAvatar: true });
//     }

//     if (
//       message.includes("stats") ||
//       message.includes("statistics") ||
//       message.includes("deaths")
//     ) {
//       return [
//         this.actionProvider.handleRelevantNews(),
//         this.actionProvider.handleProfileAnalysis(),
//         this.actionProvider.handleHistoricalPerformance(),
//       ];
//     }

//     if (message.includes("thanks") || message.includes("thank you")) {
//       return this.actionProvider.handleThanks();
//     }

//     return this.actionProvider.handleOptions({ withAvatar: true });
//   }
// }

// export default MessageParser;


class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    message = message.toLowerCase();
    console.log(message);

    if (message.includes("relevant news")) {
      return this.actionProvider.askForTicker();
    }

    if (this.state.awaitingTicker) {
      return this.actionProvider.fetchRelevantNews(message.toUpperCase());
    }

    if (message.includes("profile analysis")) {
      return this.actionProvider.askForTickerProfile();
    }

    if (this.state.awaitingTickerForProfile) {
      return this.actionProvider.fetchProfileAnalysis(message.toUpperCase());
    }

    if (message.includes("historical performance") || message.includes("history")) {
      const ticker = message.split(" ")[0].toUpperCase(); // Extract ticker symbol from message
      return this.actionProvider.fetchHistoricalPerformance(ticker);
    }

    if (this.state.awaitingTickerForPerformance) {
      return this.actionProvider.fetchHistoricalPerformance(message.toUpperCase());
    }

    if (message.includes("thanks") || message.includes("thank you")) {
      return this.actionProvider.handleThanks();
    }

    return this.actionProvider.handleOptions({ withAvatar: true });
  }
}

export default MessageParser;
