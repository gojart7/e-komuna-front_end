import axios from "axios";

const API = "https://localhost:7060/api/CitizenAddress";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAddresses = async (citizenId) => {
  try {
    const { data } = await axios.get(`${API}/${citizenId}`, {
      headers: getAuthHeaders(),
    });
    return data.addresses; // array of AddressInfo
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return []; // Return empty array on error
  }
};

export const addAddress = async (citizenId, body) => {
  return axios.post(`${API}/${citizenId}`, body, {
    headers: getAuthHeaders(),
  });
};

export const updateAddress = async (citizenId, label, body) => {
  return axios.put(`${API}/${citizenId}/address/${label}`, body, {
    headers: getAuthHeaders(),
  });
};

export const deleteAddress = async (citizenId, label) => {
  return axios.delete(`${API}/${citizenId}/address/${label}`, {
    headers: getAuthHeaders(),
  });
};
