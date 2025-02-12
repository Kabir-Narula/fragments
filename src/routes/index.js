const express = require('express');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth');
const { createSuccessResponse } = require('../response');

const router = express.Router();

// All /v1 routes require authentication
router.use('/v1', authenticate(), require('./api'));

// Health check
router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/Kabir-Narula/fragments',
      version,
    })
  );
});

module.exports = router;