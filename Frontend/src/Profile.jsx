import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCategories from './MealCategories'; // Import the MealCategories component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // State for storing favorite recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State to track the clicked recipe
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      // Fetch user profile
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data); // Set user data
          // Fetch favorite recipes after setting user data
          fetchFavoriteRecipes();
        })
        .catch(() => {
          navigate('/login'); // Redirect to login if token is invalid
        });
    }
  }, [navigate]);

  // Fetch favorite recipes
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
          // Fetch recipe details for each favorite recipe ID
          fetchRecipeDetails(data.favoriteRecipes);
        }
      })
      .catch((err) => {
        console.error('Error fetching favorite recipes:', err);
      });
  };

  // Fetch recipe details for each favorite recipe ID
  const fetchRecipeDetails = (recipeIds) => {
    const fetchPromises = recipeIds.map((id) =>
      fetch(`http://localhost:5000/api/recipes/details/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => data.meals ? data.meals[0] : null) // Assuming the response contains the 'meals' array
        .catch((err) => {
          console.error('Error fetching recipe details:', err);
          return null; // Return null if there's an error fetching this recipe
        })
    );

    // Wait for all fetches to complete and update the state with the recipe details
    Promise.all(fetchPromises).then((recipes) => {
      // Filter out any null results if the fetch failed for a recipe
      const validRecipes = recipes.filter((recipe) => recipe !== null);
      setFavoriteRecipes(validRecipes); // Set the valid recipes to state
    });
  };

  // Toggle recipe details visibility
  const handleRecipeClick = (recipe) => {
    if (selectedRecipe && selectedRecipe.idMeal === recipe.idMeal) {
      setSelectedRecipe(null); // If the clicked recipe is already selected, collapse it
    } else {
      setSelectedRecipe(recipe); // Otherwise, set the clicked recipe to show its details
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Profile</h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>

          {/* Include the Meal Categories */}
          <h3>Meal Categories</h3>
          <MealCategories /> {/* Render the MealCategories component */}

          {/* Display favorite recipes */}
          <h3>Favorite Recipes</h3>
          {favoriteRecipes.length > 0 ? (
            <ul>
              {favoriteRecipes.map((recipe) => (
                <li key={recipe.idMeal}>
                  <h4
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => handleRecipeClick(recipe)} // When recipe name is clicked
                  >
                    {recipe.strMeal}
                  </h4>
                  {/* Show details if the recipe is selected */}
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
