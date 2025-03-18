const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const markdownIt = require('markdown-it');  // Import markdown-it for converting Markdown to HTML

module.exports = async (req, res) => {
  try {
    const url = req.originalUrl.split('?')[0];  // Remove query string from URL
    // Handle GET
    //  /fragments (4.3)
    logger.debug({ originalUrl: req.originalUrl }, 'Handling GET request');
    if (url === '/v1/fragments') {
      const expand = req.query.expand === '1';
      const fragments = await Fragment.byUser(req.user, expand);

      return res.status(200).json(
        createSuccessResponse({
          fragments: fragments.map((fragment) => ({
            id: fragment.id,
            ownerId: fragment.ownerId,
            created: fragment.created,
            updated: fragment.updated,
            type: fragment.type,
            size: fragment.size,
          })),
        })
      );
    }

    // Handle GET /fragments/:id (4.5)
    if (req.originalUrl.startsWith('/v1/fragments/') && req.params.id) {
      const fragment = await Fragment.byId(req.user, req.params.id);
      if (!fragment) {
        return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
      }

      const data = await fragment.getData();
      res.set('Content-Type', fragment.type);
      return res.status(200).send(data);
    }

    // Handle GET /fragments/:id/info (4.7)
    if (req.originalUrl.startsWith('/v1/fragments/') && req.params.id && req.originalUrl.endsWith('/info')) {
      const fragment = await Fragment.byId(req.user, req.params.id);
      if (!fragment) {
        return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
      }

      return res.status(200).json(createSuccessResponse({
        id: fragment.id,
        ownerId: fragment.ownerId,
        created: fragment.created,
        updated: fragment.updated,
        type: fragment.type,
        size: fragment.size,
      }));
    }

    // Handle GET /fragments/:id.ext (4.7.1 - Markdown to HTML conversion)
    if (req.originalUrl.startsWith('/v1/fragments/') && req.params.id && req.params.ext) {
      const { id: idWithExt, ext } = req.params;
      const [id] = idWithExt.split('.');  // Extract ID from URL

      // Get fragment by ID
      const fragment = await Fragment.byId(req.user, id);
      if (!fragment) {
        return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
      }

      const data = await fragment.getData();

      // Check if the requested extension is valid
      const toType = ext === 'html' ? 'text/html' : null;
      if (!toType || !fragment.formats.includes(toType)) {
        return res.status(415).json(createErrorResponse(415, 'Unsupported conversion'));
      }

      // Convert the data if the extension is valid
      if (ext === 'html') {
        const md = markdownIt();
        const convertedData = md.render(data.toString());

        res.set('Content-Type', toType);
        return res.status(200).send(convertedData);
      }

      // If extension is not supported
      return res.status(415).json(createErrorResponse(415, 'Unsupported conversion'));
    }

    // If no conditions match, return 404 for unhandled paths
    return res.status(404).json(createErrorResponse(404, 'Not found'));
  } catch (err) {
    logger.error({ err }, 'Error in GET /fragments handler');
    return res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
