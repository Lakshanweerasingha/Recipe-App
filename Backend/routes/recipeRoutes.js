const express = require('express');
const { getRecipesByCategory, getRecipeDetails, getCategories } = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/categories', getCategories);
router.get('/:category', getRecipesByCategory);
router.get('/details/:id', getRecipeDetails);

module.exports = router;
