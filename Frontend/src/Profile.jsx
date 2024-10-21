import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data); // Set user data
        })
        .catch(() => {
          navigate('/login'); // Redirect to login if token is invalid
        });
    }
  }, [navigate]);

  return (
    <div>
      {user ? (
        <div>
          <h2>Profile</h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
