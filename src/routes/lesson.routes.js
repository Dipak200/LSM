const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lesson.controller');
const validate = require('../middleware/validation.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const { createLessonValidation, updateLessonValidation } = require('../validations/lesson.validation');

// Protected routes (require authentication)
router.get('/:id', authMiddleware, lessonController.getLessonById);
router.put('/:id/complete', authMiddleware, lessonController.completeLesson);

// Admin routes (require admin privileges)
router.post('/course/:courseId', authMiddleware, adminMiddleware, validate(createLessonValidation), lessonController.createLesson);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateLessonValidation), lessonController.updateLesson);
router.delete('/:id', authMiddleware, adminMiddleware, lessonController.deleteLesson);

module.exports = router;