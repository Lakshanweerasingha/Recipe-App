const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Use  to set security-related HTTP headers
const app = require('express')();
app.use(helmet());

// Rate limiter 
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again 10 minutes"
});
app.use('/login', loginLimiter);

exports.register = [
  body('email').isEmail().normalizeEmail().withMessage('invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters').trim().escape(),
  body('username').not().isEmpty().trim().escape().withMessage('username is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'user already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: newUser });
    } catch (error) {
      res.status(500).json({ msg: 'server error' });
    }
  },
];

exports.login = [
  body('email').isEmail().normalizeEmail().withMessage('invalid email address'),
  body('password').not().isEmpty().trim().escape().withMessage('password is required'),

  async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'user does not exist' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  },
];

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addFavoriteRecipe = [
  body('recipeID').not().isEmpty().withMessage('recipe ID is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { recipeID } = req.body;
      const user = await User.findById(req.user.id);

      if (user.favoriteRecipes.includes(recipeID)) {
        return res.status(400).json({ msg: 'recipe already in favorites' });
      }

      user.favoriteRecipes.push(recipeID);
      await user.save();
      res.json(user.favoriteRecipes);
    } catch (error) {
      res.status(500).json({ msg: 'server error' });
    }
  }
];

exports.getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'user not found' });
    }

    res.json({ favoriteRecipes: user.favoriteRecipes });
  } catch (error) {
    res.status(500).json({ msg: 'server error' });
  }
};

exports.removeFavoriteRecipe = [
  body('recipeID').not().isEmpty().withMessage('recipe ID is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { recipeID } = req.body;
      const user = await User.findById(req.user.id);
      user.favoriteRecipes = user.favoriteRecipes.filter((id) => id !== recipeID);
      await user.save();
      res.json(user.favoriteRecipes);
    } catch (error) {
      res.status(500).json({ msg: 'server error' });
    }
  }
];
