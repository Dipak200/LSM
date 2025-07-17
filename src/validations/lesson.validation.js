const Joi = require('joi');

const createLessonValidation = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Lesson title must be at least 3 characters long',
      'string.max': 'Lesson title cannot exceed 200 characters',
      'any.required': 'Lesson title is required'
    }),
  video_url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Please provide a valid video URL',
      'any.required': 'Video URL is required'
    }),
  resource_links: Joi.array()
    .items(Joi.string().uri())
    .default([])
    .messages({
      'string.uri': 'Please provide valid URLs for resource links'
    }),
  order_index: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.min': 'Order index must be at least 1',
      'any.required': 'Order index is required'
    })
});

const updateLessonValidation = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Lesson title must be at least 3 characters long',
      'string.max': 'Lesson title cannot exceed 200 characters'
    }),
  video_url: Joi.string()
    .uri()
    .messages({
      'string.uri': 'Please provide a valid video URL'
    }),
  resource_links: Joi.array()
    .items(Joi.string().uri())
    .messages({
      'string.uri': 'Please provide valid URLs for resource links'
    }),
  order_index: Joi.number()
    .min(1)
    .messages({
      'number.min': 'Order index must be at least 1'
    })
});

module.exports = {
  createLessonValidation,
  updateLessonValidation
};