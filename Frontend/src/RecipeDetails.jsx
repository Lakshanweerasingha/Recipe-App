import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from './auth';
import { ENDPOINTS } from './Api'; // Import the API endpoints
import './RecipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(ENDPOINTS.recipeDetails(id), {
          headers: getAuthHeader(), // Use the auth header
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setRecipe(data.meals ? data.meals[0] : null);
      } catch (error) {
        setError('Failed to load recipe details');
      }
    };

    fetchRecipeDetails();
  }, [id, navigate]);

  return (
    <div className="recipe-details-container">
      {error && <p className="error">{error}</p>}
      {recipe ? (
        <div className="recipe-details">
          <h2 className="recipe-title">{recipe.strMeal}</h2>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-image" />
          <div className="recipe-content">
            <div className="recipe-section">
              <h3>Instructions</h3>
              <p>{recipe.strInstructions}</p>
            </div>
            <div className="recipe-section">
              <h3>Ingredients</h3>
              <ul>
                {Object.keys(recipe).map((key, index) =>
                  key.startsWith('strIngredient') && recipe[key] ? (
                    <li key={index}>{recipe[key]}</li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading">Loading recipe details...</p>
      )}
    </div>
  );
};

export default RecipeDetails;
