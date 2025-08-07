// src/services/meetingService.js
import axios from "axios";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};
const API_BASE = "https://localhost:7060/api/MeetingRequest";

export const getMyMeetings = async () => {
  try {
    const response = await axios.get(`${API_BASE}/my`, {
      headers: getAuthHeaders(),
    });
    console.log("Meetings fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    throw error;
  }
};
