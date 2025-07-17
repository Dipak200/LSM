const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');
const config = require('../config');
const asyncHandler = require('../utils/asyncHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return errorResponse(res, 'Access denied. No token provided.', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return errorResponse(res, 'Token is not valid', 401);
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Token is not valid', 401);
  }
});

module.exports = authMiddleware;