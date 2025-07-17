const lessonService = require('../services/lesson.service');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

class LessonController {
  createLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.createLesson(req.params.courseId, req.body, req.user._id);
    
    successResponse(res, 'Lesson created successfully', { lesson }, 201);
  });

  getLessonById = asyncHandler(async (req, res) => {
    const lesson = await lessonService.getLessonById(req.params.id, req.user._id);
    
    successResponse(res, 'Lesson retrieved successfully', { lesson });
  });

  updateLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.updateLesson(req.params.id, req.body, req.user._id);
    
    successResponse(res, 'Lesson updated successfully', { lesson });
  });

  deleteLesson = asyncHandler(async (req, res) => {
    await lessonService.deleteLesson(req.params.id, req.user._id);
    
    successResponse(res, 'Lesson deleted successfully');
  });

  completeLesson = asyncHandler(async (req, res) => {
    const progress = await lessonService.completeLesson(req.params.id, req.user._id);
    
    successResponse(res, 'Lesson marked as completed', { progress });
  });
}

module.exports = new LessonController();