import React from "react";
import { useNavigate } from "react-router-dom";

const CitizenRequest = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/citizen-login");
  };
  return (
    <div style={styles.container}>
      <div style={styles.messageBox}>
        <h2>Your Sign Up request has been sent</h2>
        <p>Please wait for confirmation.</p>
        <button onSubmit={handleGoBack} style={styles.button}>
          Go back to Log In
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  messageBox: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default CitizenRequest;
