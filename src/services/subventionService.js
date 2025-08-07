import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const API_BASE_URL = "https://localhost:7060/api";

export const getAvailableSubventions = async () => {
  const response = await axios.get(`${API_BASE_URL}/Subvention/available`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const applyForSubvention = async (subventionId) => {
  const response = await axios.post(
    `${API_BASE_URL}/CitizenSubventionRequest/apply/${subventionId}`,
    { body: {} },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getAppliedSubventions = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/CitizenSubventionRequest/my-requests`,
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
