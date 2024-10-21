import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from './auth';

const RecipesByCategory = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');  // Redirect to login if not logged in
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${category}`, {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setRecipes(data.meals);  // Assuming 'meals' is the correct field in the response
      } catch (error) {
        setError('Failed to load recipes');
      }
    };

    // Fetch user favorite recipes
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile`, {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setFavorites(data.favoriteRecipes || []);
      } catch (error) {
        setError('Failed to load favorites');
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [category, navigate]);

  // Add to favorites function
  const addToFavorites = async (recipeID) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/favorites', {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeID }),
      });
      const data = await response.json();
      if (data.favoriteRecipes) {
        setFavorites(data.favoriteRecipes);
      }
    } catch (error) {
      setError('Failed to add recipe to favorites');
    }
  };

  // Remove from favorites function
  const removeFromFavorites = async (recipeID) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/favorites/${recipeID}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (data.favoriteRecipes) {
        setFavorites(data.favoriteRecipes);
      }
    } catch (error) {
      setError('Failed to remove recipe from favorites');
    }
  };

  return (
    <div>
      <h2>{category} Recipes</h2>
      {error && <p>{error}</p>}
      <ul>
        {recipes && recipes.map((recipe, index) => (
          <li key={index}>
            <Link to={`/recipe/details/${recipe.idMeal}`}>{recipe.strMeal}</Link>
            {favorites.includes(recipe.idMeal) ? (
              <button onClick={() => removeFromFavorites(recipe.idMeal)}>
                Remove from Favorites
              </button>
            ) : (
              <button onClick={() => addToFavorites(recipe.idMeal)}>
                Add to Favorites
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipesByCategory;
