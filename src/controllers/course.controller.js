const courseService = require('../services/course.service');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

class CourseController {
  createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body, req.user._id);
    
    successResponse(res, 'Course created successfully', { course }, 201);
  });

  getAllCourses = asyncHandler(async (req, res) => {
    logger.info(`Welcome to getAllCourse`);
    const result = await courseService.getAllCourses(req.query);
    
    successResponse(res, 'Courses retrieved successfully', result);
  });

  getCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id, req.user?._id);
    
    successResponse(res, 'Course retrieved successfully', { course });
  });

  updateCourse = asyncHandler(async (req, res) => {
    console.log(req);
    const course = await courseService.updateCourse(req.params.id, req.body, req.user._id);
    
    successResponse(res, 'Course updated successfully', { course });
  });

  deleteCourse = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(req.params.id, req.user._id);
    
    successResponse(res, 'Course deleted successfully');
  });

  enrollInCourse = asyncHandler(async (req, res) => {
    const enrollment = await courseService.enrollInCourse(req.params.id, req.user._id);
    
    successResponse(res, 'Enrolled in course successfully', { enrollment }, 201);
  });
}

module.exports = new CourseController();