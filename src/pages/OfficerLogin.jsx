import React, { useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa";
import * as Yup from "yup";
import background from "../assets/officer.jpg";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  requestLoginCode,
  verifyLoginCode,
} from "../services/officerLoginService";
import { useAuth } from "../context/AuthContext";

// Yup validation schemas
const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const codeSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
});

const OfficerLogin = () => {
  const [step, setStep] = useState(1); // 1: email input, 2: code input
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null); // store userId from backend after requesting code
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
      setErrors({});
      setGeneralError("");

      const response = await requestLoginCode(email);
      setUserId(response.userId);

      // Proceed to Step 2
      setStep(2);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.response && err.response.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Failed to send verification code. Please try again.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await codeSchema.validate({ code }, { abortEarly: false });
      setErrors({});
      setGeneralError("");

      const response = await verifyLoginCode(userId, code);

      localStorage.setItem("token", response.token);

      // Update authentication context
      login({ token: response.token }, "Officer");

      navigate("/officer-dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.response && err.response.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Verification failed. Please try again.");
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
        <h2 className="text-white mb-4">Officer Login</h2>

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="form-group position-relative mb-4">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="form-control input-underline text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Send Code
            </button>

            <Button
              className="btn w-100 mt-3"
              variant="secondary"
              onClick={() => navigate("/")}
            >
              ← Back to Home Page
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleLogin}>
            <div className="form-group position-relative mb-4">
              <FaKey className="input-icon" />
              <input
                type="text"
                name="code"
                placeholder="Enter code"
                className="form-control input-underline text-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
              />
              {errors.code && (
                <div className="error-message">{errors.code}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Login
            </button>
          </form>
        )}

        {generalError && (
          <div className="error-message text-center mt-3">{generalError}</div>
        )}
      </div>
    </div>
  );
};

export default OfficerLogin;
