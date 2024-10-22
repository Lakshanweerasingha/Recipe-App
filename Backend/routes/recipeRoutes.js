const express = require('express');
const { getRecipesByCategory, getRecipeDetails, getAllMealCategories } = require('../controllers/recipeController');
const auth = require('../middleware/auth'); 
const router = express.Router();

router.get('/categories', auth, getAllMealCategories);
router.get('/:category', auth, getRecipesByCategory);
router.get('/details/:id', auth, getRecipeDetails);

module.exports = router;
