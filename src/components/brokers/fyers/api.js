const BASE_URL = "/api/v1/fyers"; // Replace with your actual base URL

export const fetchProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/fetchProfile`);
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const fetchHoldings = async () => {
  try {
    const response = await fetch(`${BASE_URL}/fetchHoldings`);
    if (!response.ok) {
      throw new Error("Failed to fetch holdings");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching holdings:", error);
    throw error;
  }
};

export const fetchFunds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/fetchFunds`);
    if (!response.ok) {
      throw new Error("Failed to fetch funds");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching funds:", error);
    throw error;
  }
};

export const fetchPositions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/fetchPositions`);
    if (!response.ok) {
      throw new Error("Failed to fetch positions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

export const fetchTrades = async () => {
  try {
    const response = await fetch(`${BASE_URL}/fetchTrades`);
    if (!response.ok) {
      throw new Error("Failed to fetch trades");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getOrders`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
