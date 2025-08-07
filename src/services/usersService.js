import axios from "axios";

const BASE_URL = "https://localhost:7060/api/Citizen"; // Adjust to match your backend

const getAllUsers = async () => {
  const res = await axios.get(`${BASE_URL}/users`);
  return res.data;
};

const createUser = async (user) => {
  const res = await axios.post(`${BASE_URL}/users`, user);
  return res.data;
};

const updateUser = async (id, user) => {
  const res = await axios.put(`${BASE_URL}/users/${id}`, user);
  return res.data;
};

const deleteUser = async (id) => {
  const res = await axios.delete(`${BASE_URL}/users/${id}`);
  return res.data;
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
