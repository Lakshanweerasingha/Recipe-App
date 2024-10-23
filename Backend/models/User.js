const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },      // First Name
  lastName: { type: String, required: true },       // Last Name
  email: { type: String, required: true, unique: true },  // Email
  phoneNumber: { type: String, required: true },    // Phone Number
  password: { type: String, required: true },       // Password
  favoriteRecipes: [{ type: String }]               // Favorite Recipes (optional)
});
const User = mongoose.model('User', userSchema);
module.exports = User;
