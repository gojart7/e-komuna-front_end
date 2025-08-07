import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = () => {
  const containerStyle = {
    backdropFilter: 'blur(14px)',                   
    backgroundColor: 'rgba(255, 255, 255, 0.07)',   
    border: '1px solid rgba(255, 255, 255, 0.2)',    
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    color: 'white',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  };

  const inputGroupStyle = {
    position: 'relative',
    marginBottom: '30px',
  };

  const iconStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: '#ccc',
    fontSize: '1.1rem',
    pointerEvents: 'none',
  };

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #aaa',
    borderRadius: 0,
    paddingLeft: '35px',
    paddingBottom: '6px',
    color: 'white',
    boxShadow: 'none',
    outline: 'none',
  };

  const inputFocusStyle = {
    borderBottom: '2px solid white',
  };

  const labelStyle = {
    marginBottom: '5px',
    fontWeight: '500',
    fontSize: '0.9rem',
  };

  return (
    <div style={containerStyle}>
      <h3 className="text-center mb-4">Super Admin Login</h3>
      <Form>
        <div style={inputGroupStyle}>
          <FaUser style={iconStyle} />
          <Form.Label style={labelStyle}>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottom = inputFocusStyle.borderBottom)}
            onBlur={(e) => (e.target.style.borderBottom = inputStyle.borderBottom)}
          />
        </div>

        <div style={inputGroupStyle}>
          <FaLock style={iconStyle} />
          <Form.Label style={labelStyle}>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottom = inputFocusStyle.borderBottom)}
            onBlur={(e) => (e.target.style.borderBottom = inputStyle.borderBottom)}
          />
        </div>

        <div className="d-grid">
          <Button variant="light" type="submit" style={{ fontWeight: '500' }}>
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
