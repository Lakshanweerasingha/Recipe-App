import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCategories from './MealCategories'; // Import the MealCategories component
import './Profile.css'; // Import CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
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
    fetch('http://localhost:5000/api/users/favorites', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
      fetch(`http://localhost:5000/api/recipes/details/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => data.meals ? data.meals[0] : null)
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

  const handleRecipeClick = (recipe) => {
    if (selectedRecipe && selectedRecipe.idMeal === recipe.idMeal) {
      setSelectedRecipe(null);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  const handleDeleteRecipe = (idMeal) => {
    fetch(`http://localhost:5000/api/users/favorites/${idMeal}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-content">
          <div className="meal-categories">
            <h3>Meal Categories</h3>
            <MealCategories /> {/* Render the MealCategories component */}
          </div>

          <div className="favorite-recipes">
            <h3>Favorite Recipes</h3>
            {favoriteRecipes.length > 0 ? (
              <ul>
                {favoriteRecipes.map((recipe) => (
                  <li key={recipe.idMeal}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h4
                        style={{ cursor: 'pointer', color: 'blue', marginRight: '10px' }}
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        {recipe.strMeal}
                      </h4>
                      <button
                        onClick={() => handleDeleteRecipe(recipe.idMeal)}
                        style={{
                          marginLeft: 'auto',
                          backgroundColor: 'red',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    {selectedRecipe && selectedRecipe.idMeal === recipe.idMeal && (
                      <div>
                        <p>Category: {recipe.strCategory}</p>
                        <p>Area: {recipe.strArea}</p>
                        <p>Ingredients:</p>
                        <ul>
                          {Object.keys(recipe)
                            .filter((key) => key.startsWith('strIngredient') && recipe[key])
                            .map((ingredientKey) => (
                              <li key={ingredientKey}>
                                {recipe[ingredientKey]} ({recipe[`strMeasure${ingredientKey.slice(-1)}`]})
                              </li>
                            ))}
                        </ul>
                        <p>{recipe.strInstructions}</p>
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                        <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
                          Watch Recipe Video
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No favorite recipes found.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
