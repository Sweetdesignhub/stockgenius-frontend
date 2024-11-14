import api from "./config";


const handleApiError = (error) => {
  console.error("API Error:", error);
  return {
    error: true,
    message: error.response?.data?.message || "An unexpected error occurred",
    status: error.response?.status
  };
};

export const getBotsByUserId = async () => {
  try {
    const response = await api.get('/api/v1/ai-trading-bots/getBotsByUserId');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createBot = async (botData) => {
  try {
    const response = await api.post(`/api/v1/ai-trading-bots/createBot`, botData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateBot = async (botId, updatedData) => {
  try {
    const response = await api.put(`/api/v1/ai-trading-bots/${botId}/updateBot`, updatedData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteBot = async (botId) => {
  try {
    await api.delete(`/api/v1/ai-trading-bots/${botId}/deleteBot`);
    return { success: true, message: "Bot deleted successfully" };
  } catch (error) {
    return handleApiError(error);
  }
};

export const toggleBotStatus = async (botId, productType) => {
  try {
    const endpoint = productType === 'INTRADAY' ? 'toggle-intraday' : 'toggle-cnc';
    const response = await api.patch(`/api/v1/ai-trading-bots/${botId}/${endpoint}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateWorkingTime = async (botId, workingTime) => {
  try {
    const response = await api.patch(`/api/v1/ai-trading-bots/${botId}/working-time`, { workingTime });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};