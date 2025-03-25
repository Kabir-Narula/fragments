// src/auth/basic-auth.js
const auth = require('http-auth');
const authPassport = require('http-auth-passport');
const logger = require('../logger');
const authorize = require('./auth-middleware');

if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

logger.info('Using HTTP Basic Auth for auth');

// Modified configuration with explicit challenge
const basicAuth = auth.basic({
  file: process.env.HTPASSWD_FILE,
  challenge: true,  // THIS IS CRUCIAL FOR THE HEADER
  realm: 'Fragments API',  // Custom realm name
  unauthorizedResponse: {
    status: 'error',
    error: {
      code: 401,
      message: 'Unauthorized'
    }
  }
});

module.exports.strategy = () => authPassport(basicAuth);

// Modified authenticate middleware
module.exports.authenticate = () => {
  return (req, res, next) => {
    // Manually set WWW-Authenticate header if not present
    if (!res.get('WWW-Authenticate')) {
      res.set('WWW-Authenticate', 'Basic realm="Fragments API"');
    }
    
    // Apply the authorization
    authorize('http')(req, res, next);
  };
};