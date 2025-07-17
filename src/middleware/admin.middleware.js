const { errorResponse } = require('../utils/response');

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Access denied. Admin privileges required.', 403);
  }
};

module.exports = adminMiddleware;