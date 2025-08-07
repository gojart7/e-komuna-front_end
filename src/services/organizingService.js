import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const API_BASE_URL = "https://localhost:7060/api";

export const requestOrganizing = async (payload) => {
  const response = await axios.post(
    `${API_BASE_URL}/OrganizingRequest`,
    payload,
    { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
  );
  return response.data;
};
