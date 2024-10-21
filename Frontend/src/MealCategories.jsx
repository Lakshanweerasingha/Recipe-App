import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from './auth';
import './MealCategories.css'

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
      <div className="categories-container">
        {categories.slice(0, 6).map((category, index) => (
          <div key={index} className="category-item">
            <Link to={`/recipes/${category.strCategory}`} className="category-link">
              <img 
                src={category.strCategoryThumb} 
                alt={category.strCategory} 
                className="category-image" 
              />
              <p className="category-name">{category.strCategory}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealCategories;
