const quizService = require('../services/quiz.service');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

class QuizController {
  createQuiz = asyncHandler(async (req, res) => {
    const quiz = await quizService.createQuiz(req.params.courseId, req.body, req.user._id);
    
    successResponse(res, 'Quiz created successfully', { quiz }, 201);
  });

  createQuestion = asyncHandler(async (req, res) => {
    const question = await quizService.createQuestion(req.params.quizId, req.body, req.user._id);
    
    successResponse(res, 'Question created successfully', { question }, 201);
  });

  getQuizById = asyncHandler(async (req, res) => {
    const quiz = await quizService.getQuizById(req.params.id, req.user._id);
    
    successResponse(res, 'Quiz retrieved successfully', { quiz });
  });

  attemptQuiz = asyncHandler(async (req, res) => {
    const attempt = await quizService.attemptQuiz(req.params.id, req.body.answers, req.user._id);
    
    successResponse(res, 'Quiz submitted successfully', { attempt });
  });

  getQuizAttempts = asyncHandler(async (req, res) => {
    const attempts = await quizService.getQuizAttempts(req.params.id, req.user._id);
    
    successResponse(res, 'Quiz attempts retrieved successfully', { attempts });
  });
}

module.exports = new QuizController();