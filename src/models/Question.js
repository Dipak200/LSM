const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question_text: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correct_option: {
    type: Number,
    required: true,
    min: 0
  },
  order_index: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Validation for options array
questionSchema.path('options').validate(function(options) {
  return options.length >= 2 && options.length <= 6;
}, 'Question must have between 2 and 6 options');

// Validation for correct option
questionSchema.pre('save', function(next) {
  if (this.correct_option >= this.options.length) {
    return next(new Error('Correct option must be less than total options'));
  }
  next();
});

// Ensure questions are ordered by index
questionSchema.index({ quiz_id: 1, order_index: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);