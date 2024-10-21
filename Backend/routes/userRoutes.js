const express = require('express');
const { register, login, getProfile, addFavoriteRecipe, removeFavoriteRecipe, getFavoriteRecipes } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { body, param } = require('express-validator');
const router = express.Router();

// User routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

router.post('/favorites', auth, addFavoriteRecipe);
router.get('/favorites', auth, getFavoriteRecipes);  // Get all favorite recipes
router.delete('/favorites/:recipeID', auth, removeFavoriteRecipe);

module.exports = router;
