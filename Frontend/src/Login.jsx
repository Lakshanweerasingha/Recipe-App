import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile', { replace: true });  // Redirect to profile page if logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);  // Save token to localStorage
        navigate('/profile', { replace: true });  // Redirect to profile page
      } else {
        setError(data.msg);
      }
    } catch (error) {
      setError('Server error');
    }
  };

  return (
    <div className="login-container">
      {/* Add a logo placeholder or import your actual logo */}
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
      {/* Link to Sign Up */}
      <p>
        Don’t have an account? <a href="/signup">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
