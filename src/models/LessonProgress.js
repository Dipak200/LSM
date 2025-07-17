const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  completed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure user can only complete lesson once
lessonProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);