const express = require('express');

const router = express.Router();
const {
  getAllUser,
  getUser,
  updateUser,
  patchUser,
  createUser,
  checkUserBody,
  deleteUser,
} = require('../controller/userController');
router.route('/').get(getAllUser).post(checkUserBody, createUser);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .patch(patchUser)
  .delete(deleteUser);

module.exports = router;
