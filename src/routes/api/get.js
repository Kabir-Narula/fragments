const { createSuccessResponse } = require('../../response'); // Import response utility functions

module.exports = (req, res) => {
  res.status(200).json(
    createSuccessResponse({
      fragments: [], // Placeholder for future implementation
    })
  );
};
