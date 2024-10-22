import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import MealCategories from './MealCategories';
import RecipesByCategory from './RecipesByCategory';
import RecipeDetails from './RecipeDetails';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <nav>
          {!isAuthenticated ? (
            <>
            </>
          ) : (
            <>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categories" element={<MealCategories />} />
          <Route path="/recipes/:category" element={<RecipesByCategory />} />
          <Route path="/recipe/details/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
