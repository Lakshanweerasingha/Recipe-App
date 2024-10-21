// routes/recipeRoutes.js
const express = require('express');
const { getRecipesByCategory, getRecipeDetails, getAllMealCategories } = require('../controllers/recipeController');
const auth = require('../middleware/auth');  // Ensure the auth middleware is imported
const router = express.Router();

// Apply the auth middleware here to protect these routes
router.get('/categories', auth, getAllMealCategories);
router.get('/:category', auth, getRecipesByCategory);
router.get('/details/:id', auth, getRecipeDetails);

module.exports = router;
