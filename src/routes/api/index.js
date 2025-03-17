const express = require('express');
const router = express.Router();
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// Configure raw body parser for POST
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const { type } = contentType.parse(req);
        return Fragment.isSupportedType(type);
      } catch (err) {
        logger.error(err);
        return false;
      }
    },
  });

// Reference the single get.js handler that now handles all the routes
router.get('/fragments', require('./get')); // Handles /fragments
router.post('/fragments', rawBody(), require('./post')); // Handles /fragments POST
router.get('/fragments/:id', require('./get')); // Handles /fragments/:id
router.get('/fragments/:id/info', require('./get')); // Handles /fragments/:id/info
router.get('/fragments/:id.:ext', require('./get')); // Handles /fragments/:id.ext (Markdown to HTML conversion)

module.exports = router;
