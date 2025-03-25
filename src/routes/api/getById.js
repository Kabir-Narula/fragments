// const { Fragment } = require('../../model/fragment');
// const {createErrorResponse } = require('../../response');

// module.exports = async (req, res) => {
//   try {
//     const fragment = await Fragment.byId(req.user, req.params.id);
//     const data = await fragment.getData();

//     // Set Content-Type without charset
//     res.set('Content-Type', fragment.type.split(';')[0]);
//     res.status(200).send(data);
//   } catch (err) {
//     if (err.message === 'Fragment not found') {
//       res.status(404).json(createErrorResponse(404, 'Fragment not found'));
//     } else {
//       res.status(500).json(createErrorResponse(500, 'Internal server error'));
//     }
//   }
// };