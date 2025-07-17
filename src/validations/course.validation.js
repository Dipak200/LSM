const Joi = require('joi');

const createCourseValidation = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Course title must be at least 3 characters long',
      'string.max': 'Course title cannot exceed 200 characters',
      'any.required': 'Course title is required'
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Course description must be at least 10 characters long',
      'string.max': 'Course description cannot exceed 2000 characters',
      'any.required': 'Course description is required'
    }),
  instructor_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Instructor name must be at least 2 characters long',
      'string.max': 'Instructor name cannot exceed 100 characters',
      'any.required': 'Instructor name is required'
    }),
  price: Joi.number()
    .min(0)
    .max(10000)
    .required()
    .messages({
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed $10,000',
      'any.required': 'Price is required'
    })
});

const updateCourseValidation = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .messages({
      'string.min': 'Course title must be at least 3 characters long',
      'string.max': 'Course title cannot exceed 200 characters'
    }),
  description: Joi.string()
    .min(10)
    .max(2000)
    .messages({
      'string.min': 'Course description must be at least 10 characters long',
      'string.max': 'Course description cannot exceed 2000 characters'
    }),
  instructor_name: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Instructor name must be at least 2 characters long',
      'string.max': 'Instructor name cannot exceed 100 characters'
    }),
  price: Joi.number()
    .min(0)
    .max(10000)
    .messages({
      'number.min': 'Price cannot be negative',
      'number.max': 'Price cannot exceed $10,000'
    })
});

module.exports = {
  createCourseValidation,
  updateCourseValidation
};