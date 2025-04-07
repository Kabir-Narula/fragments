const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const authenticate = require('./auth');
const { createErrorResponse } = require('./response');
const logger = require('./logger');
const pino = require('pino-http')({ logger });

const app = express();

// Use pino logging middleware
app.use(pino);

// Use helmetjs security middleware
app.use(helmet());

// Use CORS middleware
app.use(cors());

// Use gzip/deflate compression middleware
app.use(compression());

// Critical Fix: Body parser configuration
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/v1/fragments') {
    express.raw({
      type: ['text/plain', 'application/json', 'text/markdown'],
      limit: '5mb'
    })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// Initialize Passport
passport.use(authenticate.strategy());
app.use(passport.initialize());

// Use modularized routes
app.use('/', require('./routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json(createErrorResponse(404, 'not found'));
});

// Error handler
app.use((err, req, res) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  if (status > 499) {
    logger.error({ err }, 'Error processing request');
  }

  res.status(status).json(createErrorResponse(status, message));
});

module.exports = app;