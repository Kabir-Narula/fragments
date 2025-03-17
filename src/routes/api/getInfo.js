// const { Fragment } = require('../../model/fragment');
// const { createSuccessResponse, createErrorResponse } = require('../../response');

// module.exports = async (req, res) => {
//   try {
//     const fragment = await Fragment.byId(req.user, req.params.id);

//     res.status(200).json(
//       createSuccessResponse({
//         fragment: {
//           id: fragment.id,
//           ownerId: fragment.ownerId,
//           created: fragment.created,
//           updated: fragment.updated,
//           type: fragment.type,
//           size: fragment.size,
//         },
//       })
//     );
//   } catch (err) {
//     if (err.message === 'Fragment not found') {
//       res.status(404).json(createErrorResponse(404, 'Fragment not found'));
//     } else {
//       res.status(500).json(createErrorResponse(500, 'Internal server error'));
//     }
//   }
// };