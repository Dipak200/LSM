const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const validate = require('../middleware/validation.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const { createQuizValidation, createQuestionValidation, quizAttemptValidation } = require('../validations/quiz.validation');

// Protected routes (require authentication)
router.get('/:id', authMiddleware, quizController.getQuizById);
router.post('/:id/attempt', authMiddleware, validate(quizAttemptValidation), quizController.attemptQuiz);
router.get('/:id/attempts', authMiddleware, quizController.getQuizAttempts);

// Admin routes (require admin privileges)
router.post('/course/:courseId', authMiddleware, adminMiddleware, validate(createQuizValidation), quizController.createQuiz);
router.post('/:quizId/questions', authMiddleware, adminMiddleware, validate(createQuestionValidation), quizController.createQuestion);

module.exports = router;