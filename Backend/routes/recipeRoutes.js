const express = require('express');
const { getRecipesByCategory, getRecipeDetails, getAllMealCategories } = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/categories', getAllMealCategories);
router.get('/:category', getRecipesByCategory);
router.get('/details/:id', getRecipeDetails);

module.exports = router;
