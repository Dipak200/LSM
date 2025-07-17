const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    
    successResponse(res, 'User registered successfully', result, 201);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    successResponse(res, 'Login successful', result);
  });

  getProfile = asyncHandler(async (req, res) => {
    // logger.info(`Inside getprofile`);
    successResponse(res, 'Profile retrieved successfully', { user: req.user });
  });
}

module.exports = new AuthController();