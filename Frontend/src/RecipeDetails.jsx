import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from './auth';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');  // Redirect to login if not logged in
      return;
    }

    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/details/${id}`, {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setRecipe(data.meals ? data.meals[0] : null);  // assuming 'meals' is the correct field
      } catch (error) {
        setError('Failed to load recipe details');
      }
    };

    fetchRecipeDetails();
  }, [id, navigate]);

  return (
    <div>
      {error && <p>{error}</p>}
      {recipe ? (
        <div>
          <h2>{recipe.strMeal}</h2>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
          <h3>Instructions</h3>
          <p>{recipe.strInstructions}</p>
          <h3>Ingredients</h3>
          <ul>
            {Object.keys(recipe).map((key, index) =>
              key.startsWith('strIngredient') && recipe[key] ? (
                <li key={index}>{recipe[key]}</li>
              ) : null
            )}
          </ul>
        </div>
      ) : (
        <p>Loading recipe details...</p>
      )}
    </div>
  );
};

export default RecipeDetails;
