const express = require('express');
const router = express.Router();
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const logger = require("../../logger")

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

// GET /v1/fragments
router.get('/fragments', require('./get'));

// POST /v1/fragments
router.post('/fragments', rawBody(), require('./post'));

module.exports = router;