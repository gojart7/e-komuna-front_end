import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaIdCard } from "react-icons/fa";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import background from '../assets/citizen.jpg';
import { signUpCitizen } from '../services/citizenSignUp';
import {Button} from 'react-bootstrap';



// Yup schema for validation
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),

  personalNumber: Yup.string()
    .matches(/^\d{10}$/, "Personal number must be exactly 10 digits")
    .required("Personal number is required"),

  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
});

const CitizenSignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personalNumber, setPersonalNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = { firstName, lastName, personalNumber, email };

  try {
    await validationSchema.validate(formData, { abortEarly: false });
    setErrors({});

    const result = await signUpCitizen(formData);

    if (result.success) {
      localStorage.setItem('token', result.token);
      navigate('/citizen-request');
    } else {
      setErrors({ form: result.message });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    } else {
      setErrors({ form: 'Signup failed. Please try again.' });
    }
  }
};


  return (
    <div
      style={{
        background: `url(${background}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <style>{`
        .login-form {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 40px;
          width: 350px;
          backdrop-filter: blur(10px);
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
        <h2 className="text-white mb-4 text-center">Citizen Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="form-group position-relative mb-4">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="First Name"
              className="form-control input-underline text-white"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="off"
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>

          {/* Last Name */}
          <div className="form-group position-relative mb-4">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Last Name"
              className="form-control input-underline text-white"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="off"
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>

          {/* Personal Number */}
          <div className="form-group position-relative mb-4">
            <FaIdCard className="input-icon" />
            <input
              type="text"
              placeholder="Personal Number"
              className="form-control input-underline text-white"
              value={personalNumber}
              onChange={(e) => setPersonalNumber(e.target.value)}
              autoComplete="off"
            />
            {errors.personalNumber && <div className="error-message">{errors.personalNumber}</div>}
          </div>

          {/* Email */}
          <div className="form-group position-relative mb-4">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control input-underline text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          {/* General form error */}
          {errors.form && <div className="error-message text-center mb-3">{errors.form}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Sign Up
          </button>
          <Button className='btn w-100 mt-3' variant="secondary" onClick={() => navigate('/')}>
              ← Back to Home Page
            </Button>
        </form>
      </div>
    </div>
  );
};

export default CitizenSignUp;
