import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../Config/Api'; // Import the API endpoints
import '../Css/Login.css';  // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Basic email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Basic password validation (e.g., minimum 6 characters)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // If validation passes, clear error
    setError('');

    try {
      const response = await fetch(ENDPOINTS.login, {  // Use the login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);  // Save token to localStorage
        navigate('/profile');  // Redirect to profile page
      } else {
        setError(data.msg);
      }
    } catch (error) {
      setError('Server error');
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="/path/to/your/logo.png" alt="Logo" />
      </div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        Don’t have an account? <a href="/register" className="create-account-link">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
