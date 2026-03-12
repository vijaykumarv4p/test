const express = require('express');
const authenticate = require('../controller/authenticate');
const router = express.Router();

const {
  getAllUser,
  getUser,
  updateUser,
  patchUser,
  createUser,
  deleteUser,
  getNewUsers,
} = require('../controller/userController');

const { signUp, login, logout } = require('../controller/authController');
router.route('/').get(getAllUser).post(createUser);
router.route('/latest').get(getNewUsers, getAllUser);

router.post('/sign-up', signUp);
router.post('/login', login);
router.post('/logout', authenticate, logout);
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
