const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};


// Add favorite recipe
exports.addFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.favoriteRecipes.includes(req.body.recipeID)) {
      return res.status(400).json({ msg: 'Recipe already in favorites' });
    }

    user.favoriteRecipes.push(req.body.recipeID);
    await user.save();
    res.json(user.favoriteRecipes);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Remove favorite recipe
exports.removeFavoriteRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favoriteRecipes = user.favoriteRecipes.filter(
      (recipeID) => recipeID !== req.params.recipeID
    );
    await user.save();
    res.json(user.favoriteRecipes);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

