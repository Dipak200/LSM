const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order_index: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Ensure quizzes are ordered by index
quizSchema.index({ course_id: 1, order_index: 1 }, { unique: true });

module.exports = mongoose.model('Quiz', quizSchema);