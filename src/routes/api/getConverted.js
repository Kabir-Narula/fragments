const { Fragment } = require('../../model/fragment');
const {createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    // Extract the id and extension from the request parameters
    const { id: idWithExt } = req.params;

    // Split the idWithExt to separate the UUID and the extension
    const [id, ext] = idWithExt.split('.');

    // Retrieve the fragment
    const fragment = await Fragment.byId(req.user, id);
    const data = await fragment.getData();

    // Determine the target type based on the extension
    const toType = ext === 'html' ? 'text/html' : null;

    // Log the fragment and target type for debugging
    logger.debug({ fragment, toType }, 'Fragment and target type');

    // Check if the conversion is supported
    if (!toType || !fragment.formats.includes(toType)) {
      logger.warn({ toType, formats: fragment.formats }, 'Unsupported conversion');
      return res.status(415).json(createErrorResponse(415, 'Unsupported conversion'));
    }

    // Convert the data
    const convertedData = await Fragment.convertData(data, fragment.type, toType);

    // Send the response
    res.set('Content-Type', toType);
    res.status(200).send(convertedData);
  } catch (err) {
    logger.error({ err }, 'Error in GET /fragments/:id.ext');
    if (err.message === 'Fragment not found') {
      res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    } else {
      res.status(500).json(createErrorResponse(500, 'Internal server error'));
    }
  }
};