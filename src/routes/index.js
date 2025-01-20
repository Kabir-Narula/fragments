const express = require('express');
const { version, author } = require('../../package.json');

const router = express.Router();

// Mount API routes under /v1
router.use('/v1', require('./api'));

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
