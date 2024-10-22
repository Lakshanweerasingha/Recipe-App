// config.js
const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const ENDPOINTS = {
  userProfile: `${API_BASE_URL}/users/profile`,
  userFavorites: `${API_BASE_URL}/users/favorites`,
  recipeDetails: (id) => `${API_BASE_URL}/recipes/details/${id}`,
  recipesByCategory: (category) => `${API_BASE_URL}/recipes/${category}`,
  deleteFavorite: (idMeal) => `${API_BASE_URL}/users/favorites/${idMeal}`,
  login: `${API_BASE_URL}/users/login`,  // Login endpoint
  register: `${API_BASE_URL}/users/register`,  // Register endpoint
  mealCategories: `${API_BASE_URL}/recipes/categories`,  // Meal categories endpoint
};
