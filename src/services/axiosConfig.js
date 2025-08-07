import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create();

// Request interceptor to add auth headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const superAdminToken = localStorage.getItem("superAdminToken");

    // Add the appropriate token based on what's available
    if (superAdminToken) {
      config.headers.Authorization = `Bearer ${superAdminToken}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401 (Unauthorized) or 403 (Forbidden), clear auth data
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("superAdminToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("citizenId");

      // Dispatch logout event to notify AuthContext
      window.dispatchEvent(new Event("logout"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
