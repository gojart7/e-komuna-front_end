import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const API_BASE_URL = "https://localhost:7060/api";
const API_URL = "https://localhost:7060/api/Department";

export const requestMeeting = async (meetingData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/MeetingRequest`,
      meetingData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to request meeting", error);
    throw new Error("Failed to request meeting");
  }
};

export const getDepartments = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};
