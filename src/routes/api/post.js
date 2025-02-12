const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    // Validate input
    const type = req.get('Content-Type');
    if (!type) {
      return res.status(400).json(createErrorResponse(400, 'Content-Type header required'));
    }

    // Parse and validate Content-Type
    let parsedType;
    try {
      parsedType = contentType.parse(type);
    } catch (err) {
      logger.error(err);
      return res.status(415).json(createErrorResponse(415, 'Invalid Content-Type format'));
    }

    if (!Fragment.isSupportedType(parsedType.type)) {
      return res.status(415).json(createErrorResponse(415, 'Unsupported media type'));
    }

    // Validate body
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json(createErrorResponse(400, 'Request body must be binary data'));
    }

    if (req.body.length === 0) {
      return res.status(400).json(createErrorResponse(400, 'Fragment data cannot be empty'));
    }

    // Create fragment
    const fragment = new Fragment({
      ownerId: req.user,
      type: parsedType.type,
      size: req.body.length,
    });

    // Save data
    await fragment.save();
    await fragment.setData(req.body);

    // Build location URL
    const baseUrl = process.env.API_URL || `http://${req.headers.host}`;
    const location = new URL(`/v1/fragments/${fragment.id}`, baseUrl).toString();

    // Send response
    res.set('Location', location);
    res.status(201).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
        },
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error creating fragment');
    res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
