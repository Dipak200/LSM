const Joi = require('joi');

const paginationValidation = Joi.object({
  page: Joi.number()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1'
    }),
  limit: Joi.number()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 50'
    }),
  search: Joi.string()
    .allow('')
    .max(100)
    .messages({
      'string.max': 'Search query cannot exceed 100 characters'
    }),
  sort: Joi.string()
    .valid('createdAt', '-createdAt', 'title', '-title', 'price', '-price')
    .default('-createdAt')
    .messages({
      'any.only': 'Sort must be one of: createdAt, -createdAt, title, -title, price, -price'
    })
});

const mongoIdValidation = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Invalid ID format',
    'any.required': 'ID is required'
  });

module.exports = {
  paginationValidation,
  mongoIdValidation
};