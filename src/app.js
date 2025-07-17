const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const logger = require('./utils/logger');
const connectDB = require('./config/database'); // Uncomment this
const errorHandler = require('./middleware/error.middleware');

const apiRoutes = require('./routes');

// Connect to database
connectDB(); // Uncomment this

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW * 60 * 1000,
  max: config.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LMS API is running!',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

app.use('/api', apiRoutes);

// Simple API route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'LMS API v1.0.0',
    endpoints: [
      'GET /api/',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/courses',
      'POST /api/courses/:id/enroll'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;