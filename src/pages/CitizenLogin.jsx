import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import background from "../assets/citizen.jpg";
import { Button } from "react-bootstrap";
import {
  requestLoginCode,
  verifyLoginCode,
} from "../services/citizenLoginService";
import { useAuth } from "../context/AuthContext";

// Yup schemas
const emailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});
const codeSchema = Yup.object().shape({
  code: Yup.string().required("Code is required"),
});

const CitizenLogin = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailSchema.validate({ email });
      setError("");
      const data = await requestLoginCode(email);
      setUserId(data.userId);
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      await codeSchema.validate({ code });
      setError("");
      const data = await verifyLoginCode(userId, code);
      localStorage.setItem("token", data.token);
      console.log("Login successful:", data.token);
      localStorage.setItem("citizenId", userId);

      // Update authentication context
      login({ id: userId, token: data.token }, "Citizen");

      navigate("/citizen-dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        setError(err.message);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Verification failed. Please try again.");
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
        <h2 className="text-white mb-4 text-center">Citizen Login</h2>

        {!userId ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group position-relative mb-4">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter email"
                className="form-control input-underline text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              {error && <div className="error-message">{error}</div>}
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
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <div className="form-group position-relative mb-4">
              <input
                type="text"
                placeholder="Enter verification code"
                className="form-control input-underline text-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="off"
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Verify Code
            </button>
            <Button
              className="btn w-100 mt-3"
              variant="secondary"
              onClick={() => {
                setUserId(null);
                setCode("");
                setError("");
              }}
            >
              ← Back to Email
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CitizenLogin;
