import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from '../Config/auth';
import { ENDPOINTS } from '../Config/Api'; // Import the API endpoints
import '../Css/MealCategories.css';

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
        const response = await fetch(ENDPOINTS.mealCategories, { // Use the meal categories endpoint
          headers: getAuthHeader(),
        });
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCategories(data.categories);  // Assuming 'categories' is the correct field in the response
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
