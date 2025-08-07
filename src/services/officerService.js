import axios from "axios";

const API_BASE = "https://localhost:7060/api/Officer";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("superAdminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getOfficers = async () => {
  const response = await axios.get(API_BASE, getAuthHeaders());
  return response.data;
};

export const createOfficer = async (data) => {
  const response = await axios.post(
    `${API_BASE}/create`,
    data,
    getAuthHeaders()
  );
  return response.data;
};

export const updateOfficer = async (id, data) => {
  await axios.put(`${API_BASE}/${id}`, data, getAuthHeaders());
};

export const deleteOfficer = async (id) => {
  await axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
};
