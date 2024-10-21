// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract the token

  if (!token) {
    return res.status(401).json({ msg: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with your secret key
    req.user = { id: decoded.id };  // Attach only the user id
    next();  // Allow the request to proceed
  } catch (error) {
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};
