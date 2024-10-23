const API_BASE_URL = 'https://recipe-app-umber-phi.vercel.app//api';

export const ENDPOINTS = {
  userProfile: `${API_BASE_URL}/users/profile`,
  userFavorites: `${API_BASE_URL}/users/favorites`,
  recipeDetails: (id) => `${API_BASE_URL}/recipes/details/${id}`,
  recipesByCategory: (category) => `${API_BASE_URL}/recipes/${category}`,
  deleteFavorite: (idMeal) => `${API_BASE_URL}/users/favorites/${idMeal}`,
  login: `${API_BASE_URL}/users/login`, 
  register: `${API_BASE_URL}/users/register`,  
  mealCategories: `${API_BASE_URL}/recipes/categories`,  
};
