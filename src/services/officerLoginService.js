import axios from 'axios';

const API_BASE_URL = 'https://localhost:7060/api/Officer';

export const requestLoginCode = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email });
    return response.data; // { message, userId }
  } catch (error) {
    console.error('Failed to request officer login code:', error.response?.data || error.message);
    throw error;
  }
};

export const verifyLoginCode = async (userId, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, { userId, code });
    return response.data; // { token }
  } catch (error) {
    console.error('Failed to verify officer login code:', error.response?.data || error.message);
    throw error;
  }
};
