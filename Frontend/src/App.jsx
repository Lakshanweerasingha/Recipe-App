import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Profile from './Profile'; // Import Profile component
import MealCategories from './MealCategories';
import RecipesByCategory from './RecipesByCategory';
import RecipeDetails from './RecipeDetails';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/register">Sign Up</Link> | <Link to="/login">Login</Link>
        </nav>
        <Routes>
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
