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

// class MessageParser {
//   constructor(actionProvider, state) {
//     this.actionProvider = actionProvider;
//     this.state = state;
//   }

//   parse(message) {
//     message = message.toLowerCase();
//     // console.log(message);

//     if (message.includes("relevant news")) {
//       return this.actionProvider.askForTicker();
//     }

//     if (this.state.awaitingTicker) {
//       return this.actionProvider.fetchRelevantNews(message.toUpperCase());
//     }

//     if (message.includes("profile analysis")) {
//       return this.actionProvider.askForTickerProfile();
//     }

//     if (this.state.awaitingTickerForProfile) {
//       return this.actionProvider.fetchProfileAnalysis(message.toUpperCase());
//     }

//     if (message.includes("historical performance") || message.includes("history")) {
//       const ticker = message.split(" ")[0].toUpperCase(); // Extract ticker symbol from message
//       return this.actionProvider.fetchHistoricalPerformance(ticker);
//     }

//     if (this.state.awaitingTickerForPerformance) {
//       return this.actionProvider.fetchHistoricalPerformance(message.toUpperCase());
//     }

//     if (message.includes("thanks") || message.includes("thank you")) {
//       return this.actionProvider.handleThanks();
//     }

//     return this.actionProvider.handleOptions({ withAvatar: true });
//   }
// }

// export default MessageParser;

// class MessageParser {
//   constructor(actionProvider, state) {
//     this.actionProvider = actionProvider;
//     this.state = state;
//   }

//   parse(message) {
//     message = message.toLowerCase();

//     // Stock-specific queries
//     if (message.includes("relevant news")) {
//       return this.actionProvider.askForTicker();
//     }

//     if (this.state.awaitingTicker) {
//       return this.actionProvider.fetchRelevantNews(message.toUpperCase());
//     }

//     if (message.includes("profile analysis")) {
//       return this.actionProvider.askForTickerProfile();
//     }

//     if (this.state.awaitingTickerForProfile) {
//       return this.actionProvider.fetchProfileAnalysis(message.toUpperCase());
//     }

//     if (
//       message.includes("historical performance") ||
//       message.includes("history")
//     ) {
//       const ticker = message.split(" ")[0].toUpperCase(); // Extract ticker symbol from message
//       return this.actionProvider.fetchHistoricalPerformance(ticker);
//     }

//     if (this.state.awaitingTickerForPerformance) {
//       return this.actionProvider.fetchHistoricalPerformance(
//         message.toUpperCase()
//       );
//     }

//     if (message.includes("thanks") || message.includes("thank you")) {
//       return this.actionProvider.handleThanks();
//     }

//     // If no stock-specific query is detected, send the message to the backend API
//     return this.actionProvider.sendToBackend(message);
//   }
// }

// export default MessageParser;

// class MessageParser {
//   constructor(actionProvider, state) {
//     this.actionProvider = actionProvider;
//     this.state = state;
//   }

//   parse(message) {
//     const originalMessage = message;
//     message = message.toLowerCase().trim();

//     // Reset states if we're starting a new query
//     if (!this.isFollowUpQuery(message)) {
//       this.resetAwaitingStates();
//     }

//     // Handle thanks (simple response that should take precedence)
//     if (this.containsKeywords(message, ["thanks", "thank you"])) {
//       return this.actionProvider.handleThanks();
//     }

//     // Handle awaiting states (these take precedence because they're expecting specific input)
//     if (this.state.awaitingTicker) {
//       const potentialTicker = this.extractTicker(message);
//       return this.actionProvider.fetchRelevantNews(potentialTicker);
//     }

//     if (this.state.awaitingTickerForProfile) {
//       const potentialTicker = this.extractTicker(message);
//       return this.actionProvider.fetchProfileAnalysis(potentialTicker);
//     }

//     if (this.state.awaitingTickerForPerformance) {
//       const potentialTicker = this.extractTicker(message);
//       return this.actionProvider.fetchHistoricalPerformance(potentialTicker);
//     }

//     // Now process new queries

//     // Relevant news query
//     if (
//       this.containsKeywords(message, [
//         "relevant news",
//         "latest news",
//         "stock news",
//       ])
//     ) {
//       return this.actionProvider.askForTicker();
//     }

//     // Profile analysis query
//     if (
//       this.containsKeywords(message, [
//         "profile analysis",
//         "company profile",
//         "analyze profile",
//       ])
//     ) {
//       return this.actionProvider.askForTickerProfile();
//     }

//     // Historical performance query - look for both keywords and a potential ticker
//     if (
//       this.containsKeywords(message, [
//         "historical performance",
//         "history",
//         "performance history",
//         "past performance",
//       ])
//     ) {
//       const potentialTicker = this.extractTickerFromQuery(message);

//       if (potentialTicker) {
//         return this.actionProvider.fetchHistoricalPerformance(potentialTicker);
//       } else {
//         this.state.awaitingTickerForPerformance = true;
//         return this.actionProvider.askForTickerPerformance();
//       }
//     }

//     // If we've gotten here, it's a general query
//     return this.actionProvider.sendToBackend(originalMessage);
//   }

//   // Helper method to check if message contains any of the keywords
//   containsKeywords(message, keywords) {
//     return keywords.some(
//       (keyword) =>
//         message.includes(keyword) || this.isSimilarTo(message, keyword)
//     );
//   }

//   // Helper to extract ticker from a standalone response
//   extractTicker(message) {
//     // Clean the message and get the first word, assuming it might be a ticker
//     const cleaned = message.replace(/[^\w\s]/gi, "").trim();
//     const potentialTicker = cleaned.split(/\s+/)[0].toUpperCase();

//     // Only return if it looks like a ticker (1-5 characters, all letters)
//     if (/^[A-Z]{1,5}$/.test(potentialTicker)) {
//       return potentialTicker;
//     }

//     // If no ticker found, try to extract it from the message
//     return this.extractTickerFromQuery(message);
//   }

//   // Helper to extract ticker from a query with context
//   extractTickerFromQuery(message) {
//     // Common patterns for ticker symbols in text
//     const tickerPatterns = [
//       /\b([A-Za-z]{1,5})\b stock/i, // "AAPL stock"
//       /stock\s+([A-Za-z]{1,5})\b/i, // "stock AAPL"
//       /\bsymbol\s+([A-Za-z]{1,5})\b/i, // "symbol AAPL"
//       /\bticker\s+([A-Za-z]{1,5})\b/i, // "ticker AAPL"
//       /\bfor\s+([A-Za-z]{1,5})\b/i, // "for AAPL"
//       /\b([A-Za-z]{1,5})\b/i, // Just "AAPL" as a fallback
//     ];

//     // Try each pattern
//     for (const pattern of tickerPatterns) {
//       const match = message.match(pattern);
//       if (match && match[1]) {
//         return match[1].toUpperCase();
//       }
//     }

//     return null;
//   }

//   // Check if the message seems like a follow-up to a previous question
//   isFollowUpQuery(message) {
//     // Short responses are likely follow-ups
//     if (message.split(/\s+/).length <= 2) {
//       return true;
//     }

//     // Common follow-up patterns
//     const followUpPatterns = [
//       /^(yes|no|maybe|sure|okay|of course)/i,
//       /^(it'?s|that'?s) /i,
//     ];

//     return followUpPatterns.some((pattern) => pattern.test(message));
//   }

//   // Reset all awaiting states
//   resetAwaitingStates() {
//     this.state.awaitingTicker = false;
//     this.state.awaitingTickerForProfile = false;
//     this.state.awaitingTickerForPerformance = false;
//   }

//   // Basic similarity check to handle typos and variations
//   isSimilarTo(text, keyword) {
//     // Simple implementation - you might want to use a more robust solution
//     if (text === keyword) return true;

//     // Check if the text contains most of the letters from the keyword in order
//     let keywordIndex = 0;
//     for (let i = 0; i < text.length && keywordIndex < keyword.length; i++) {
//       if (text[i] === keyword[keywordIndex]) {
//         keywordIndex++;
//       }
//     }

//     // If we matched at least 70% of the keyword characters in order
//     return keywordIndex >= keyword.length * 0.7;
//   }
// }

// export default MessageParser;
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const originalMessage = message;
    message = message.toLowerCase().trim();

    // Reset states if we're starting a new query
    if (!this.isFollowUpQuery(message)) {
      this.resetAwaitingStates();
    }

    // Handle thanks (simple response that should take precedence)
    if (this.containsKeywords(message, ["thanks", "thank you"])) {
      return this.actionProvider.handleThanks();
    }

    // Handle awaiting states (these take precedence because they're expecting specific input)
    if (this.state.awaitingTicker) {
      const potentialTicker = this.extractTicker(message);
      return this.actionProvider.fetchRelevantNews(potentialTicker);
    }

    if (this.state.awaitingTickerForProfile) {
      const potentialTicker = this.extractTicker(message);
      return this.actionProvider.fetchProfileAnalysis(potentialTicker);
    }

    // Now process new queries

    // Relevant news query
    if (
      this.containsKeywords(message, [
        "relevant news",
        "latest news",
        "stock news",
      ])
    ) {
      return this.actionProvider.askForTicker();
    }

    // Profile analysis query
    if (
      this.containsKeywords(message, [
        "profile analysis",
        "company profile",
        "analyze profile",
      ])
    ) {
      return this.actionProvider.askForTickerProfile();
    }

    // If we've gotten here, it's a general query
    return this.actionProvider.sendToBackend(originalMessage);
  }

  // Helper method to check if message contains any of the keywords
  containsKeywords(message, keywords) {
    return keywords.some(
      (keyword) =>
        message.includes(keyword) || this.isSimilarTo(message, keyword)
    );
  }

  // Helper to extract ticker from a standalone response
  extractTicker(message) {
    // Clean the message and get the first word, assuming it might be a ticker
    const cleaned = message.replace(/[^\w\s]/gi, "").trim();
    const potentialTicker = cleaned.split(/\s+/)[0].toUpperCase();

    // Only return if it looks like a ticker (1-5 characters, all letters)
    if (/^[A-Z]{1,5}$/.test(potentialTicker)) {
      return potentialTicker;
    }

    // If no ticker found, try to extract it from the message
    return this.extractTickerFromQuery(message);
  }

  // Helper to extract ticker from a query with context
  extractTickerFromQuery(message) {
    // Common patterns for ticker symbols in text
    const tickerPatterns = [
      /\b([A-Za-z]{1,5})\b stock/i, // "AAPL stock"
      /stock\s+([A-Za-z]{1,5})\b/i, // "stock AAPL"
      /\bsymbol\s+([A-Za-z]{1,5})\b/i, // "symbol AAPL"
      /\bticker\s+([A-Za-z]{1,5})\b/i, // "ticker AAPL"
      /\bfor\s+([A-Za-z]{1,5})\b/i, // "for AAPL"
      /\b([A-Za-z]{1,5})\b/i, // Just "AAPL" as a fallback
    ];

    // Try each pattern
    for (const pattern of tickerPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].toUpperCase();
      }
    }

    return null;
  }

  // Check if the message seems like a follow-up to a previous question
  isFollowUpQuery(message) {
    // Short responses are likely follow-ups
    if (message.split(/\s+/).length <= 2) {
      return true;
    }

    // Common follow-up patterns
    const followUpPatterns = [
      /^(yes|no|maybe|sure|okay|of course)/i,
      /^(it'?s|that'?s) /i,
    ];

    return followUpPatterns.some((pattern) => pattern.test(message));
  }

  // Reset all awaiting states
  resetAwaitingStates() {
    this.state.awaitingTicker = false;
    this.state.awaitingTickerForProfile = false;
  }

  // Basic similarity check to handle typos and variations
  isSimilarTo(text, keyword) {
    // Simple implementation - you might want to use a more robust solution
    if (text === keyword) return true;

    // Check if the text contains most of the letters from the keyword in order
    let keywordIndex = 0;
    for (let i = 0; i < text.length && keywordIndex < keyword.length; i++) {
      if (text[i] === keyword[keywordIndex]) {
        keywordIndex++;
      }
    }

    // If we matched at least 70% of the keyword characters in order
    return keywordIndex >= keyword.length * 0.7;
  }
}

export default MessageParser;
