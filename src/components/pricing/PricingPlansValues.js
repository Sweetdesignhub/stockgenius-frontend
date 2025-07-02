const PRICING_PLANS = {
  india: {
    symbol: "₹ ",
    basic: {
      price: "₹ 0",
      paperTradeFundCap: "1 lakh",
      aiBotTransactionLimit: "N/A",
      simulationLimit: "5 simulations/month",
      description: "Free Access",
    },
    pro: {
      price: "₹ 25",
      paperTradeFundCap: "10 lakhs",
      aiBotTransactionLimit: "10 daily/50 weekly transactions using bots",
      simulationLimit: "25 simulations/month",
      description: "Past 7 days per ticker (News & Sentiments)",
      one_month: {
        symbol: "₹ ",
        price: "25",
        access: "1 month access",
        discount: "Pay as you go",
      },
      three_months: {
        symbol: "₹ ",
        price: "50",
        access: "3 month access",
        discount: "10% discount applied",
      },
      twelve_months: {
        symbol: "₹ ",
        price: "200",
        access: "Best value for money",
        discount: "20% discount applied",
      },
    },
    master: {
      price: "₹ 50",
      paperTradeFundCap: "50 lakhs",
      aiBotTransactionLimit: "Unlimited bots, full trading hours",
      simulationLimit: "Unlimited simulations",
      description: "Full history with insights",
      one_month: {
        price: "50",
        access: "1 month access",
        discount: "Pay as you go",
      },
      three_months: {
        price: "120",
        access: "3 month access",
        discount: "10% discount applied",
      },
      twelve_months: {
        price: "400",
        access: "Best value for money",
        discount: "20% discount applied",
      },
    },
  },
  usa: {
    symbol: "$ ",
    basic: {
      price: "$ 0",
      paperTradeFundCap: "1 lakh",
      aiBotTransactionLimit: "N/A",
      simulationLimit: "5 simulations/month",
      description: "Free Access",
    },
    pro: {
      price: "$ 25",
      paperTradeFundCap: "10 lakhs",
      aiBotTransactionLimit: "10 daily / 50 weekly transactions",
      simulationLimit: "25 simulations/month",
      description: "Past 7 days per ticker (News & Sentiments)",
      one_month: {
        price: "35",
        access: "1 month access",
        discount: "Pay as you go",
      },
      three_months: {
        price: "70",
        access: "3 month access",
        discount: "10% discount applied",
      },
      twelve_months: {
        price: "220",
        access: "Best value for money",
        discount: "20% discount applied",
      },
    },
    master: {
      price: "$ 50",
      paperTradeFundCap: "50 lakhs",
      aiBotTransactionLimit: "Unlimited bots, full trading hours",
      simulationLimit: "Unlimited simulations",
      description: "Full history with insights",
      one_month: {
        price: "60",
        access: "1 month access",
        discount: "Pay as you go",
      },
      three_months: {
        price: "130",
        access: "3 month access",
        discount: "10% discount applied",
      },
      twelve_months: {
        price: "420",
        access: "Best value for money",
        discount: "20% discount applied",
      },
    },
  },
};

export default PRICING_PLANS;
