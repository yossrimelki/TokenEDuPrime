const jwt = require('jsonwebtoken');

// Load environment variables
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    // Use the JWT_SECRET from .env file
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = {
  verifyToken
};
