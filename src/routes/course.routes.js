const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const validate = require('../middleware/validation.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const { createCourseValidation, updateCourseValidation } = require('../validations/course.validation');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes (require authentication)
router.post('/:id/enroll', authMiddleware, courseController.enrollInCourse);

// Admin routes (require admin privileges)
router.post('/', authMiddleware, adminMiddleware, validate(createCourseValidation), courseController.createCourse);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateCourseValidation), courseController.updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, courseController.deleteCourse);

module.exports = router;