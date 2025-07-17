const progressService = require('../services/progress.service');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

class ProgressController {
  getCourseProgress = asyncHandler(async (req, res) => {
    const progress = await progressService.getCourseProgress(req.params.courseId, req.user._id);
    
    successResponse(res, 'Course progress retrieved successfully', { progress });
  });

  getDashboard = asyncHandler(async (req, res) => {
    const dashboard = await progressService.getDashboard(req.user._id);
    
    successResponse(res, 'Dashboard data retrieved successfully', { dashboard });
  });
}

module.exports = new ProgressController();