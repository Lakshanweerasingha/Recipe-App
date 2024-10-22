import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCategories from './MealCategories';
import { isLoggedIn, getAuthHeader } from './auth'; // Import your auth functions
import { ENDPOINTS } from './Api'; // Import your API endpoints
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [showContent, setShowContent] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else {
      fetch(ENDPOINTS.userProfile, {
        headers: getAuthHeader(),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          fetchFavoriteRecipes();
        })
        .catch(() => {
          navigate('/login');
        });
    }
  }, [navigate]);

  const fetchFavoriteRecipes = () => {
    fetch(ENDPOINTS.userFavorites, {
      headers: getAuthHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.favoriteRecipes && data.favoriteRecipes.length > 0) {
          fetchRecipeDetails(data.favoriteRecipes);
        }
      })
      .catch((err) => {
        console.error('Error fetching favorite recipes:', err);
      });
  };

  const fetchRecipeDetails = (recipeIds) => {
    const fetchPromises = recipeIds.map((id) =>
      fetch(ENDPOINTS.recipeDetails(id), {
        headers: getAuthHeader(),
      })
        .then((res) => res.json())
        .then((data) => (data.meals ? data.meals[0] : null))
        .catch((err) => {
          console.error('Error fetching recipe details:', err);
          return null;
        })
    );

    Promise.all(fetchPromises).then((recipes) => {
      const validRecipes = recipes.filter((recipe) => recipe !== null);
      setFavoriteRecipes(validRecipes);
    });
  };

  const fetchRecipesByCategory = (category) => {
    setSelectedCategory(category);
    fetch(ENDPOINTS.recipesByCategory(category), {
      headers: getAuthHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoryRecipes(data.meals || []);
      })
      .catch((err) => {
        console.error('Error fetching recipes by category:', err);
      });
  };

  const handleDeleteRecipe = (idMeal) => {
    fetch(ENDPOINTS.deleteFavorite(idMeal), {
      method: 'DELETE',
      headers: getAuthHeader(),
    })
      .then((res) => {
        if (res.ok) {
          setFavoriteRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe.idMeal !== idMeal)
          );
        } else {
          console.error('Failed to delete the recipe from favorites.');
        }
      })
      .catch((err) => {
        console.error('Error deleting the recipe:', err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/details/${recipe.idMeal}`);
  };

  return (
    <div className="profile-container">
      <div className="profile-buttons">
        {!user && (
          <>
            <button onClick={() => navigate('/signup')}>Signup</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </>
        )}
        <button onClick={() => setShowContent('home')}>Home</button>
        <button onClick={() => setShowContent('favorites')}>Favorites</button>
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {user ? (
        <div className="profile-content">
          {showContent === 'home' && (
            <div>
              <div className="categories-navbar">
                <MealCategories onSelectCategory={fetchRecipesByCategory} />
              </div>
            </div>
          )}

          {showContent === 'favorites' && (
            <div className="favorite-recipes">
              <h3>Favorite Recipes</h3>
              {favoriteRecipes.length > 0 ? (
                <div className="recipes-grid">
                  {favoriteRecipes.map((recipe) => (
                    <div
                      key={recipe.idMeal}
                      className="recipe-tile"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                      <div className="recipe-header">
                        <h4 className="recipe-title">{recipe.strMeal}</h4>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecipe(recipe.idMeal);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No favorite recipes found.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
