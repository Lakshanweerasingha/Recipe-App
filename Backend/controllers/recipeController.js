const axios = require('axios');


// Get categories
exports.getCategories = async (req, res) => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      const categories = response.data.categories;
  
      // Format the data if needed before sending the response
      const formattedCategories = categories.map(category => ({
        idCategory: category.idCategory,
        strCategory: category.strCategory,
        strCategoryThumb: category.strCategoryThumb,
        strCategoryDescription: category.strCategoryDescription
      }));
  
      res.json(formattedCategories);
    } catch (error) {
      res.status(500).json({ msg: 'Error fetching categories' });
    }
  };

  
// Get recipes by category
exports.getRecipesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching recipes' });
  }
};

// Get recipe details
exports.getRecipeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching recipe details' });
  }
};
