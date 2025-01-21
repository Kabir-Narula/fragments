// src/logger.js

// Use `info` as the default log level if not specified
const options = { level: process.env.LOG_LEVEL || 'info' };

// If debugging, use pretty-printed logs
if (options.level === 'debug') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// Export a configured Pino logger instance
const logger = require('pino')(options);
module.exports = logger;
