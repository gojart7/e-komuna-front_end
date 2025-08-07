import axios from "axios";

const API_BASE_URL = "https://localhost:7060/api/Citizen";

export const requestLoginCode = async (identifier) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { identifier });
    return response.data; // { message, userId }
  } catch (error) {
    console.error(
      "Failed to request login code:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const verifyLoginCode = async (userId, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, {
      userId,
      code,
    });
    console.log("Login successful:", response.data.token);
    return response.data; // { token }
  } catch (error) {
    console.error(
      "Failed to verify login code:",
      error.response?.data || error.message
    );
    throw error;
  }
};
