const express = require('express');

const router = express.Router();
const {
  getAllUser,
  getUser,
  updateUser,
  patchUser,
  createUser,
  deleteUser,
} = require('../controller/userController');
router.route('/').get(getAllUser).post(createUser);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .patch(patchUser)
  .delete(deleteUser);

router.post('/bulk-upload', (req, res) => {
  res.json({ message: 'Data received' });
});

module.exports = router;
