import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from './auth';

const MealCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');  // Redirect to login if not logged in
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes/categories', {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setCategories(data.categories);  // assuming 'categories' is the correct field in the response
      } catch (error) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, [navigate]);

  return (
    <div>
      <h2>Meal Categories</h2>
      {error && <p>{error}</p>}
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <Link to={`/recipes/${category.strCategory}`}>{category.strCategory}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealCategories;
