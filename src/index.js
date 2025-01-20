// Load environment variables from .env
require('dotenv').config();

const logger = require('./logger');

// Log uncaught exceptions for debugging
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// Log unhandled promise rejections for debugging
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Start the server
require('./server');
