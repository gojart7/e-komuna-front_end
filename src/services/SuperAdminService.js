import axios from "axios";

export const loginSuperAdmin = async (email, password) => {
  try {
    const response = await axios.post(
      "https://localhost:7060/api/SuperAdmin/login",
      { email, password }
    );
    const data = response.data;

    // Check status for success
    if (data.status === 1 && data.data && data.data.token) {
      localStorage.setItem("superAdminToken", data.data.token);
      // Add role property to user object
      const userWithRole = { ...data.data.user, role: "SuperAdmin" };
      localStorage.setItem("authUser", JSON.stringify(userWithRole));

      return {
        success: true,
        ...data,
        data: { ...data.data, user: userWithRole },
      };
    } else {
      return { success: false, message: data.message || "Login failed." };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Login failed",
    };
  }
};
