import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from './auth';
import './RecipesByCategory.css'; // Import the CSS file for styling

const RecipesByCategory = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLabels, setFavoriteLabels] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${category}`, {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setRecipes(data.meals);
      } catch (error) {
        setError('Failed to load recipes');
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile`, {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setFavorites(data.favoriteRecipes || []);
        const initialLabels = {};
        data.favoriteRecipes?.forEach((recipeID) => {
          initialLabels[recipeID] = 'Remove from Favorites';
        });
        setFavoriteLabels(initialLabels);
      } catch (error) {
        setError('Failed to load favorites');
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [category, navigate]);

  const toggleFavorite = async (recipeID) => {
    const isFavorite = favorites.includes(recipeID);
    if (isFavorite) {
      await removeFromFavorites(recipeID);
    } else {
      await addToFavorites(recipeID);
    }
    setFavoriteLabels((prevLabels) => ({
      ...prevLabels,
      [recipeID]: isFavorite ? 'Add to Favorites' : 'Remove from Favorites',
    }));
  };

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
    <div className="recipes-container">
      <h2>{category} Recipes</h2>
      {error && <p>{error}</p>}
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.idMeal} className="recipe-tile">
            {/* Display the recipe thumbnail image */}
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-thumbnail" />
            <Link to={`/recipe/details/${recipe.idMeal}`} className="recipe-title">
              {recipe.strMeal}
            </Link>
            <button className="favorite-btn" onClick={() => toggleFavorite(recipe.idMeal)}>
              {favoriteLabels[recipe.idMeal] || 'Add to Favorites'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesByCategory;
