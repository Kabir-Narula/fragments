const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id || typeof id !== 'string' || id.trim() === '') {
      logger.warn({ id }, 'Invalid fragment ID');
      return res.status(400).json(createErrorResponse(400, 'Invalid fragment ID'));
    }

    logger.debug({ id }, 'Handling DELETE request');

    // Check if fragment exists
    const fragment = await Fragment.byId(req.user, id);
    if (!fragment) {
      logger.warn({ id }, 'Fragment not found');
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    // Delete the fragment
    await Fragment.delete(req.user, id);

    logger.debug({ id }, 'Successfully deleted fragment');
    return res.status(200).json(createSuccessResponse());

  } catch (err) {
    logger.error({ err }, 'Error in DELETE /fragments handler');
    
    if (err.message.includes('not found')) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    return res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};