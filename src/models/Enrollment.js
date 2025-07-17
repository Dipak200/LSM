const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure user can only enroll once per course
enrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);