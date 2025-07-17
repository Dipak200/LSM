const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');

// Public routes
router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;