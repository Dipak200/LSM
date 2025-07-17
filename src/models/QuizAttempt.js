const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  total_questions: {
    type: Number,
    required: true,
    min: 1
  },
  correct_answers: {
    type: Number,
    required: true,
    min: 0
  },
  answers: [{
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selected_option: {
      type: Number,
      required: true,
      min: 0
    },
    is_correct: {
      type: Boolean,
      required: true
    }
  }],
  completed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);