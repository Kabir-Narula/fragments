const express = require('express');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth'); // Import the authentication middleware

const router = express.Router();

// Protect all /v1 routes with authentication
router.use('/v1', authenticate(), require('./api'));

// Define a simple health check route
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/Kabir-Narula/fragments',
    version,
  });
});

module.exports = router;
