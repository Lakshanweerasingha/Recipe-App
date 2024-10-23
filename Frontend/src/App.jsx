import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Profile from './Recipes/Profile';
import MealCategories from './Recipes/MealCategories';
import RecipesByCategory from './Recipes/RecipesByCategory';
import RecipeDetails from './Recipes/RecipeDetails';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

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
        <Route path="/" element={<Register />} />
          <Route path="/register" element={<Login />} />
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
