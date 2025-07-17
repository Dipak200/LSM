const { Course, Lesson, Quiz, LessonProgress, QuizAttempt, Enrollment } = require('../models');
const mongoose = require('mongoose');

class ProgressService {
  async getCourseProgress(courseId, userId) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Get all lessons and quizzes for the course
    const [lessons, quizzes] = await Promise.all([
      Lesson.find({ course_id: courseId }).sort({ order_index: 1 }),
      Quiz.find({ course_id: courseId }).sort({ order_index: 1 })
    ]);

    // Get user's progress
    const [completedLessons, quizAttempts] = await Promise.all([
      LessonProgress.find({
        user_id: userId,
        lesson_id: { $in: lessons.map(l => l._id) }
      }),
      QuizAttempt.find({
        user_id: userId,
        quiz_id: { $in: quizzes.map(q => q._id) }
      }).sort({ completed_at: -1 })
    ]);

    // Calculate completion percentage
    const totalLessons = lessons.length;
    const completedLessonsCount = completedLessons.length;
    const totalQuizzes = quizzes.length;
    const attemptedQuizzes = [...new Set(quizAttempts.map(a => a.quiz_id.toString()))].length;
    const totalItems = totalLessons + totalQuizzes;
    const completedItems = completedLessonsCount + attemptedQuizzes;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

// Calculate average quiz score
const averageQuizScore = quizAttempts.length > 0 
  ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length)
  : 0;

// Get last activity
const lastActivity = await this.getLastActivity(userId, courseId);

return {
  course_id: courseId,
  user_id: userId,
  completion_percentage: completionPercentage,
  lessons_completed: completedLessonsCount,
  total_lessons: totalLessons,
  quizzes_attempted: attemptedQuizzes,
  total_quizzes: totalQuizzes,
  average_quiz_score: averageQuizScore,
  last_activity: lastActivity
};
}

async getLastActivity(userId, courseId) {
  // Get latest lesson completion
  const latestLessonProgress = await LessonProgress.findOne({
    user_id: userId
  })
  .populate({
    path: 'lesson_id',
    match: { course_id: courseId },
    select: 'title'
  })
  .sort({ completed_at: -1 });

  // Get latest quiz attempt
  const latestQuizAttempt = await QuizAttempt.findOne({
    user_id: userId
  })
  .populate({
    path: 'quiz_id',
    match: { course_id: courseId },
    select: 'title'
  })
  .sort({ completed_at: -1 });

  // Determine which is more recent
  let lastActivity = null;

  if (latestLessonProgress && latestLessonProgress.lesson_id) {
    lastActivity = {
      type: 'lesson_completed',
      title: latestLessonProgress.lesson_id.title,
      timestamp: latestLessonProgress.completed_at
    };
  }

  if (latestQuizAttempt && latestQuizAttempt.quiz_id) {
    if (!lastActivity || latestQuizAttempt.completed_at > lastActivity.timestamp) {
      lastActivity = {
        type: 'quiz_attempted',
        title: latestQuizAttempt.quiz_id.title,
        timestamp: latestQuizAttempt.completed_at
      };
    }
  }

  return lastActivity;
}

async getDashboard(userId) {
  // Get all enrollments for the user
  const enrollments = await Enrollment.find({ user_id: userId })
    .populate('course_id', 'title');

  const enrolledCourses = enrollments.length;

  // Calculate completed and in-progress courses
  let completedCourses = 0;
  let inProgressCourses = 0;
  let totalLessonsCompleted = 0;

  for (const enrollment of enrollments) {
    const progress = await this.getCourseProgress(enrollment.course_id._id, userId);
    
    if (progress.completion_percentage === 100) {
      completedCourses++;
    } else if (progress.completion_percentage > 0) {
      inProgressCourses++;
    }
    
    totalLessonsCompleted += progress.lessons_completed;
  }

  // Get recent activity across all courses
  const recentActivity = await this.getRecentActivity(userId);

  return {
    enrolled_courses: enrolledCourses,
    completed_courses: completedCourses,
    in_progress_courses: inProgressCourses,
    total_lessons_completed: totalLessonsCompleted,
    recent_activity: recentActivity
  };
}

async getRecentActivity(userId, limit = 5) {
  // Get recent lesson completions
  const recentLessons = await LessonProgress.find({ user_id: userId })
    .populate({
      path: 'lesson_id',
      select: 'title course_id',
      populate: {
        path: 'course_id',
        select: 'title'
      }
    })
    .sort({ completed_at: -1 })
    .limit(limit);

  // Get recent quiz attempts
  const recentQuizzes = await QuizAttempt.find({ user_id: userId })
    .populate({
      path: 'quiz_id',
      select: 'title course_id',
      populate: {
        path: 'course_id',
        select: 'title'
      }
    })
    .sort({ completed_at: -1 })
    .limit(limit);

  // Combine and sort activities
  const activities = [];

  recentLessons.forEach(progress => {
    if (progress.lesson_id) {
      activities.push({
        type: 'lesson_completed',
        course_title: progress.lesson_id.course_id.title,
        lesson_title: progress.lesson_id.title,
        timestamp: progress.completed_at
      });
    }
  });

  recentQuizzes.forEach(attempt => {
    if (attempt.quiz_id) {
      activities.push({
        type: 'quiz_attempted',
        course_title: attempt.quiz_id.course_id.title,
        quiz_title: attempt.quiz_id.title,
        score: attempt.score,
        timestamp: attempt.completed_at
      });
    }
  });

  // Sort by timestamp (most recent first) and limit
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}
}

module.exports = new ProgressService();