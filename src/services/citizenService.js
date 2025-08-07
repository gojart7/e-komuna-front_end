import axios from "axios";

const API_BASE_URL = "https://localhost:7060/api/Citizen";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("superAdminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all citizens
export const getAllCitizens = async () => {
  try {
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Failed to fetch citizens", error);
    throw error;
  }
};

// Get only pending requests
export const getPendingCitizens = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pending`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching pending citizens:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Approve citizen
export const approveCitizen = async (citizenId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/approve/${citizenId}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to approve citizen:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Reject citizen
export const rejectCitizen = async (citizenId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/reject/${citizenId}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to reject citizen:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get citizen by ID (optional, if you plan to use it)
export const getCitizenById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching citizen by ID:", error);
    throw error;
  }
};

export const updateCitizen = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${id}`,
      data,
      getAuthHeaders()
    );
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error(
      "Failed to update citizen:",
      error.response?.data || error.message
    );
    return false;
  }
};
