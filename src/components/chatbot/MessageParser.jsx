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

    // Handle awaiting states (these take precedence because they're expecting specific input)
    if (this.state.awaitingTicker) {
      console.log(
        "Awaiting ticker for relevant news",
        this.state.awaitingTicker
      );

      const potentialTicker = this.extractTicker(message);
      this.resetAwaitingStates(); // ✅ reset after use
      return this.actionProvider.fetchRelevantNews(potentialTicker);
    }

    if (this.state.awaitingTickerForProfile) {
      console.log("Inside Profile", this.state.awaitingTickerForProfile);
      const potentialTicker = this.extractTicker(message);
      this.resetAwaitingStates(); // ✅ reset after use
      return this.actionProvider.fetchProfileAnalysis(potentialTicker);
    }

    if (this.state.awaitingTickerForHistorical) {
      console.log("Inside Historical", this.state.awaitingTickerForHistorical);
      const potentialTicker = this.extractTicker(message);
      this.resetAwaitingStates(); // ✅ reset after use
      return this.actionProvider.fetchHistoricalPerformance(potentialTicker);
    }

    // Now process new queries

    // Relevant news query
    // if (
    //   this.containsKeywords(message, [
    //     "relevant news",
    //     "latest news",
    //     "stock news",
    //   ])
    // ) {
    //   return this.actionProvider.askForTicker();
    // }

    // Profile analysis query
    // if (
    //   this.containsKeywords(message, [
    //     "profile analysis",
    //     "company profile",
    //     "analyze profile",
    //   ])
    // ) {
    //   return this.actionProvider.askForTickerProfile();
    // }

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
    // const cleaned = message.replace(/[^\w\s]/gi, "").trim();
    // const potentialTicker = cleaned.split(/\s+/)[0].toUpperCase();

    // // Only return if it looks like a ticker (1-5 characters, all letters)
    // if (/^[A-Z]{1,5}$/.test(potentialTicker)) {
    //   return potentialTicker;
    // }

    // If no ticker found, try to extract it from the message
    return this.extractTickerFromQuery(message);
  }

  // Helper to extract ticker from a query with context
  extractTickerFromQuery(message) {
    // Updated patterns to allow tickers of any length (letters only)
    const tickerPatterns = [
      /\b([A-Za-z]+)\s+stock\b/i, // "AAPL stock"
      /\bstock\s+([A-Za-z]+)\b/i, // "stock AAPL"
      /\bsymbol\s+([A-Za-z]+)\b/i, // "symbol AAPL"
      /\bticker\s+([A-Za-z]+)\b/i, // "ticker AAPL"
      /\bfor\s+([A-Za-z]+)\b/i, // "for AAPL"
      /\b([A-Za-z]{2,})\b/, // Just a word of 2+ letters as fallback
    ];

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
    this.state.awaitingTickerForHistorical = false;
    console.log("Resetting awaiting states", this.state);
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
