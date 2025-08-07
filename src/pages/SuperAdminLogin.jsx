import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FaUser, FaLock } from "react-icons/fa";
import background from "../assets/city.jpg";
import { loginSuperAdmin } from "../services/SuperAdminService";
import { useAuth } from "../context/AuthContext";

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .matches(/[A-Z]/, "Minimum 1 uppercase character"),
});

const SuperAdminLogin = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setLoginError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate(values, { abortEarly: false });
      setErrors({});
      setLoginError("");

      const result = await loginSuperAdmin(values.email, values.password);

      if (result.success) {
        // Add role property to user object
        const userWithRole = { ...result.data.user, role: "SuperAdmin" };
        localStorage.setItem("authUser", JSON.stringify(userWithRole)); // Ensure localStorage is correct

        // Update authentication context
        login(userWithRole, "SuperAdmin");

        navigate("/admin-dashboard");
      } else {
        setLoginError(result.message || "Login failed.");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.response && err.response.data) {
        setLoginError(err.response.data.message || "Login failed.");
      } else {
        setLoginError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      style={{
        background: `url(${background}) no-repeat center center fixed`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <style>{`
        .login-form {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 40px;
          width: 350px;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
        }

        .input-underline {
          background-color: transparent !important;
          border: none;
          border-bottom: 1px solid #fff;
          border-radius: 0;
          padding-left: 30px;
          padding-bottom: 8px;
          color: #fff;
        }

        .input-underline::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .input-underline:focus {
          box-shadow: none;
          outline: none;
          background-color: transparent;
          border-bottom: 1px solid #0d6efd;
          color: #fff;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          top: 10px;
          color: white;
        }

        .error-message {
          color: #ff4d4d;
          font-size: 0.85rem;
          margin-top: 5px;
        }
      `}</style>

      <div className="login-form">
        <h2 className="text-white mb-4">Super Admin Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group position-relative mb-4">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              className="form-control input-underline text-white"
              value={values.email}
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group position-relative mb-4">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="form-control input-underline text-white"
              value={values.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Login
          </button>

          {loginError && (
            <div className="error-message text-center mt-3">{loginError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
