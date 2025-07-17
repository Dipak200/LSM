const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes (require authentication)
router.get('/dashboard', authMiddleware, progressController.getDashboard);
router.get('/courses/:courseId', authMiddleware, progressController.getCourseProgress);

module.exports = router;