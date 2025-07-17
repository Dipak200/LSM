const Joi = require('joi');

const createQuizValidation = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Quiz title must be at least 3 characters long',
      'string.max': 'Quiz title cannot exceed 200 characters',
      'any.required': 'Quiz title is required'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Quiz description cannot exceed 1000 characters'
    }),
  order_index: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Order index must be at least 1',
      'any.required': 'Order index is required'
    })
});

const createQuestionValidation = Joi.object({
  question_text: Joi.string()
    .min(5)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Question text must be at least 5 characters long',
      'string.max': 'Question text cannot exceed 1000 characters',
      'any.required': 'Question text is required'
    }),
  options: Joi.array()
    .items(Joi.string().min(1).max(200))
    .min(2)
    .max(6)
    .required()
    .messages({
      'array.min': 'Question must have at least 2 options',
      'array.max': 'Question cannot have more than 6 options',
      'any.required': 'Options are required'
    }),
  correct_option: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Correct option must be at least 0',
      'any.required': 'Correct option is required'
    }),
  order_index: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Order index must be at least 1',
      'any.required': 'Order index is required'
    })
});

const quizAttemptValidation = Joi.object({
  answers: Joi.array()
    .items(Joi.object({
      question_id: Joi.string()
        .required()
        .messages({
          'any.required': 'Question ID is required'
        }),
      selected_option: Joi.number()
        .min(0)
        .required()
        .messages({
          'number.min': 'Selected option must be at least 0',
          'any.required': 'Selected option is required'
        })
    }))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one answer is required',
      'any.required': 'Answers are required'
    })
});

module.exports = {
  createQuizValidation,
  createQuestionValidation,
  quizAttemptValidation
};