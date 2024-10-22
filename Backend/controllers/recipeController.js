const axios = require('axios');
const { param } = require('express-validator');

exports.getAllMealCategories = async (req, res) => {
  try {
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching meal categories' });
  }
};

// Get recipes by category
exports.getRecipesByCategory = [
  param('category').isString().not().isEmpty().trim().escape(),
  
  async (req, res) => {
    const { category } = req.params;
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ msg: 'Error fetching recipes' });
    }
  },
];

// Get single recipe details
exports.getRecipeDetails = [
  param('id').isMongoId().withMessage('Invalid recipe ID format'),

  async (req, res) => {
    const { id } = req.params;
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ msg: 'Error fetching recipe details' });
    }
  },
];
