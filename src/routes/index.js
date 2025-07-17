const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const lessonRoutes = require('./lesson.routes');
const quizRoutes = require('./quiz.routes');
const progressRoutes = require('./progress.routes');

// Health check for API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LMS API v1.0.0',
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/profile'
      ],
      courses: [
        'GET /api/courses',
        'GET /api/courses/:id',
        'POST /api/courses',
        'PUT /api/courses/:id',
        'DELETE /api/courses/:id',
        'POST /api/courses/:id/enroll'
      ],
      lessons: [
        'GET /api/lessons/:id',
        'POST /api/lessons/course/:courseId',
        'PUT /api/lessons/:id',
        'DELETE /api/lessons/:id',
        'PUT /api/lessons/:id/complete'
      ],
      quizzes: [
        'GET /api/quizzes/:id',
        'POST /api/quizzes/course/:courseId',
        'POST /api/quizzes/:quizId/questions',
        'POST /api/quizzes/:id/attempt',
        'GET /api/quizzes/:id/attempts'
      ],
      progress: [
        'GET /api/progress/dashboard',
        'GET /api/progress/courses/:courseId'
      ]
    }
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);

module.exports = router;