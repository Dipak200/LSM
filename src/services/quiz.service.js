const { Quiz, Question, Course, QuizAttempt, Enrollment } = require('../models');
const mongoose = require('mongoose');

class QuizService {
  async createQuiz(courseId, quizData, userId) {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID');
    }

    // Check if course exists and user is authorized
    const course = await Course.findOne({ _id: courseId, created_by: userId });
    if (!course) {
      throw new Error('Course not found or you are not authorized to add quizzes');
    }

    const quiz = new Quiz({
      ...quizData,
      course_id: courseId
    });

    await quiz.save();
    return quiz;
  }

  async createQuestion(quizId, questionData, userId) {
    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new Error('Invalid quiz ID');
    }

    const quiz = await Quiz.findById(quizId).populate('course_id');
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check if user is authorized
    if (quiz.course_id.created_by.toString() !== userId.toString()) {
      throw new Error('You are not authorized to add questions to this quiz');
    }

    // Validate correct_option is within bounds
    if (questionData.correct_option >= questionData.options.length) {
      throw new Error('Correct option must be less than total options');
    }

    const question = new Question({
      ...questionData,
      quiz_id: quizId
    });

    await question.save();
    return question;
  }

  async getQuizById(quizId, userId) {
    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new Error('Invalid quiz ID');
    }

    const quiz = await Quiz.findById(quizId).populate('course_id', 'title');
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: quiz.course_id._id
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Get questions (without correct answers for students)
    const questions = await Question.find({ quiz_id: quizId })
      .sort({ order_index: 1 })
      .select('-correct_option');

    // Get user's previous attempts
    const attempts = await QuizAttempt.find({
      user_id: userId,
      quiz_id: quizId
    }).sort({ completed_at: -1 });

    return {
      ...quiz.toObject(),
      questions,
      user_attempts: attempts
    };
  }

  async attemptQuiz(quizId, answers, userId) {
    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new Error('Invalid quiz ID');
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: quiz.course_id
    });

    if (!enrollment) {
      throw new Error('You are not enrolled in this course');
    }

    // Get all questions for this quiz
    const questions = await Question.find({ quiz_id: quizId }).sort({ order_index: 1 });
    
    if (questions.length === 0) {
      throw new Error('No questions found for this quiz');
    }

    // Validate answers
    if (answers.length !== questions.length) {
      throw new Error('Number of answers must match number of questions');
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = questions.find(q => q._id.toString() === answer.question_id);
      if (!question) {
        throw new Error(`Question not found: ${answer.question_id}`);
      }

      const isCorrect = answer.selected_option === question.correct_option;
      if (isCorrect) {
        correctAnswers++;
      }

      return {
        question_id: answer.question_id,
        selected_option: answer.selected_option,
        is_correct: isCorrect
      };
    });

    const score = Math.round((correctAnswers / questions.length) * 100);

    // Create quiz attempt
    const attempt = new QuizAttempt({
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: questions.length,
      correct_answers: correctAnswers,
      answers: processedAnswers
    });

    await attempt.save();
    return attempt;
  }

  async getQuizAttempts(quizId, userId) {
    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new Error('Invalid quiz ID');
    }

    const attempts = await QuizAttempt.find({
      user_id: userId,
      quiz_id: quizId
    }).sort({ completed_at: -1 });

    return attempts;
  }
}

module.exports = new QuizService();