const { Lesson, Course, LessonProgress, Enrollment } = require('../models');
const mongoose = require('mongoose');

class LessonService {
  async createLesson(courseId, lessonData, userId) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    // Check if course exists and user is authorized
    const course = await Course.findOne({ _id: courseId, created_by: userId });
    if (!course) {
      throw new Error('Course not found or you are not authorized to add lessons');
    }

    const lesson = new Lesson({
      ...lessonData,
      course_id: courseId
    });

    await lesson.save();
    return lesson;
  }

  async getLessonById(lessonId, userId) {
    // Validate lessonId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID');
    }

    const lesson = await Lesson.findById(lessonId).populate('course_id', 'title');
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: lesson.course_id._id
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Check if lesson is completed
    const progress = await LessonProgress.findOne({
      user_id: userId,
      lesson_id: lessonId
    });

    return {
      ...lesson.toObject(),
      is_completed: !!progress
    };
  }

  async completeLesson(lessonId, userId) {
    // Validate lessonId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID');
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: lesson.course_id
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Check if lesson is already completed
    const existingProgress = await LessonProgress.findOne({
      user_id: userId,
      lesson_id: lessonId
    });

    if (existingProgress) {
      throw new Error('Lesson already completed');
    }

    // Create lesson progress
    const progress = new LessonProgress({
      user_id: userId,
      lesson_id: lessonId
    });

    await progress.save();
    return progress;
  }

  async updateLesson(lessonId, updateData, userId) {
    // Validate lessonId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID');
    }

    const lesson = await Lesson.findById(lessonId).populate('course_id');
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if user is authorized to update
    if (lesson.course_id.created_by.toString() !== userId.toString()) {
      throw new Error('You are not authorized to update this lesson');
    }

    Object.assign(lesson, updateData);
    await lesson.save();
    return lesson;
  }

  async deleteLesson(lessonId, userId) {
    // Validate lessonId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID');
    }

    const lesson = await Lesson.findById(lessonId).populate('course_id');
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if user is authorized to delete
    if (lesson.course_id.created_by.toString() !== userId.toString()) {
      throw new Error('You are not authorized to delete this lesson');
    }

    await Lesson.findByIdAndDelete(lessonId);
    
    // Also delete any progress records for this lesson
    await LessonProgress.deleteMany({ lesson_id: lessonId });
    
    return lesson;
  }
}

module.exports = new LessonService();