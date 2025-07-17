const { Course, Lesson, Quiz, Enrollment } = require('../models');
const mongoose = require('mongoose');

class CourseService {
  async createCourse(courseData, userId) {
    const course = new Course({
      ...courseData,
      created_by: userId
    });
    
    await course.save();
    return course;
  }

  async getAllCourses(queryParams) {
    const { page = 1, limit = 10, search, sort = '-createdAt' } = queryParams;
    
    // Build filter object
    const filter = { is_active: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor_name: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get courses with pagination
    const courses = await Course.find(filter)
      .populate('created_by', 'first_name last_name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Course.countDocuments(filter);

    // Add additional data for each course
    const coursesWithData = await Promise.all(
      courses.map(async (course) => {
        const [lessonCount, quizCount, enrolledCount] = await Promise.all([
          Lesson.countDocuments({ course_id: course._id }),
          Quiz.countDocuments({ course_id: course._id }),
          Enrollment.countDocuments({ course_id: course._id })
        ]);

        return {
          ...course.toObject(),
          lesson_count: lessonCount,
          quiz_count: quizCount,
          enrolled_count: enrolledCount
        };
      })
    );

    return {
      courses: coursesWithData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getCourseById(courseId, userId = null) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    const course = await Course.findOne({ _id: courseId, is_active: true })
      .populate('created_by', 'first_name last_name');

    if (!course) {
      throw new Error('Course not found');
    }

    // Get lessons and quizzes
    const [lessons, quizzes] = await Promise.all([
      Lesson.find({ course_id: courseId }).sort({ order_index: 1 }),
      Quiz.find({ course_id: courseId }).sort({ order_index: 1 })
    ]);

    // Check if user is enrolled (if userId provided)
    let userEnrollment = null;
    if (userId) {
      const enrollment = await Enrollment.findOne({
        user_id: userId,
        course_id: courseId
      });

      if (enrollment) {
        // Calculate progress
        const totalLessons = lessons.length;
        const completedLessons = await this.getCompletedLessonsCount(userId, courseId);
        
        userEnrollment = {
          is_enrolled: true,
          enrolled_at: enrollment.enrolled_at,
          progress: {
            completed_lessons: completedLessons,
            total_lessons: totalLessons,
            completion_percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
          }
        };
      } else {
        userEnrollment = {
          is_enrolled: false,
          enrolled_at: null,
          progress: null
        };
      }
    }

    return {
      ...course.toObject(),
      lessons,
      quizzes,
      user_enrollment: userEnrollment
    };
  }

  async enrollInCourse(courseId, userId) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    // Check if course exists
    const course = await Course.findOne({ _id: courseId, is_active: true });
    if (!course) {
      throw new Error('Course not found');
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId
    });

    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user_id: userId,
      course_id: courseId
    });

    await enrollment.save();
    return enrollment;
  }

  async getCompletedLessonsCount(userId, courseId) {
    const { LessonProgress } = require('../models');
    
    // Get all lessons for the course
    const lessons = await Lesson.find({ course_id: courseId });
    const lessonIds = lessons.map(lesson => lesson._id);

    // Count completed lessons
    const completedCount = await LessonProgress.countDocuments({
      user_id: userId,
      lesson_id: { $in: lessonIds }
    });

    return completedCount;
  }

  async updateCourse(courseId, updateData, userId) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }
    console.log("Dipak"+courseId + " " + updateData + " " + userId);
    const course = await Course.findOne({ _id: new mongoose.Types.ObjectId(courseId), created_by: new mongoose.Types.ObjectId(userId) });
    if (!course) {
      throw new Error('Course not found or you are not authorized to update it');
    }

    Object.assign(course, updateData);
    await course.save();
    return course;
  }

  async deleteCourse(courseId, userId) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    const course = await Course.findOne({ _id: courseId, created_by: userId });
    if (!course) {
      throw new Error('Course not found or you are not authorized to delete it');
    }

    // Soft delete by setting is_active to false
    course.is_active = false;
    await course.save();
    return course;
  }
}

module.exports = new CourseService();