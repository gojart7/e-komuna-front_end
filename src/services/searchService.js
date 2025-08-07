import axios from "axios";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("superAdminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const globalSearch = async (criteria) => {
  try {
    const response = await axios.post(
      "https://localhost:7060/api/Search/global",
      criteria,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Global search failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
