const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
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
  video_url: {
    type: String,
    required: true,
    trim: true
  },
  resource_links: [{
    type: String,
    trim: true
  }],
  order_index: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Ensure lessons are ordered by index
lessonSchema.index({ course_id: 1, order_index: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema);