import axios from "axios";

const API_URL = "https://localhost:7060/api/Department";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("superAdminToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getDepartments = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
