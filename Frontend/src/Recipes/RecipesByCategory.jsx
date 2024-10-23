import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getAuthHeader } from '../Config/auth';
import { ENDPOINTS } from '../Config/Api'; // Import the API endpoints
import '../Css/RecipesByCategory.css'; // Import the CSS file for styling

const RecipesByCategory = () => {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLabels, setFavoriteLabels] = useState({});
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch(ENDPOINTS.recipesByCategory(category), {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        setRecipes(data.meals);
      } catch (error) {
        setError('Failed to load recipes');
      } finally {
        setLoadingRecipes(false); // Set loading to false after fetching
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch(ENDPOINTS.userProfile, {
          headers: getAuthHeader(),
        });
        const data = await response.json();
        const userFavorites = data.favoriteRecipes || [];
        setFavorites(userFavorites);
        const initialLabels = {};
        userFavorites.forEach((recipeID) => {
          initialLabels[recipeID] = 'Remove from Favorites';
        });
        setFavoriteLabels(initialLabels);
      } catch (error) {
        setError('Failed to load favorites');
      } finally {
        setLoadingFavorites(false); // Set loading to false after fetching
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [category, navigate]);

  const toggleFavorite = async (recipeID) => {
    const isFavorite = favorites.includes(recipeID);
    
    if (isFavorite) {
      await removeFromFavorites(recipeID); // Remove from favorites API call
    } else {
      await addToFavorites(recipeID); // Add to favorites API call
    }
  
    // Update the favorites state
    setFavorites((prevFavorites) => {
      if (isFavorite) {
        return prevFavorites.filter((id) => id !== recipeID); // Remove the recipe from favorites
      } else {
        return [...prevFavorites, recipeID]; // Add the recipe to favorites
      }
    });
  
    // Update the button labels
    setFavoriteLabels((prevLabels) => ({
      ...prevLabels,
      [recipeID]: isFavorite ? 'Add to Favorites' : 'Remove from Favorites',
    }));
  };
  

  const addToFavorites = async (recipeID) => {
    try {
      const response = await fetch(ENDPOINTS.userFavorites, {
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
      const response = await fetch(ENDPOINTS.deleteFavorite(recipeID), {
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
      {error && <p className="error">{error}</p>}
      {loadingRecipes || loadingFavorites ? (
        <p>Loading...</p> // Loading message
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe.idMeal} className="recipe-tile">
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
      )}
    </div>
  );
};

export default RecipesByCategory;
