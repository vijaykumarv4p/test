const express = require('express');
const {
  isAuthenticated,
  isAuthorized,
} = require('../controller/authenticateController');
const router = express.Router();
const { restrictToSelfOrAdmin } = require('../middleware/authMiddleware');
const {
  getAllUser,
  getUser,
  updateUser,
  patchUser,
  createUser,
  deleteUser,
  getNewUsers,
  resetPassword,
  refreshToken,
} = require('../controller/userController');

const { logout } = require('../controller/authController');
const User = require('../models/UserModel');
router
  .route('/')
  .get(isAuthenticated, isAuthorized('admin'), getAllUser)
  .post(createUser);
router.route('/latest').get(getNewUsers, getAllUser);

// router.post('/sign-up', signUp);
// router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', isAuthenticated, logout);
router.post('/reset-password', isAuthenticated, resetPassword);

router
  .route('/:id')
  .get(isAuthenticated, restrictToSelfOrAdmin, getUser)
  .put(isAuthenticated, restrictToSelfOrAdmin, updateUser)
  .patch(isAuthenticated, restrictToSelfOrAdmin, patchUser)
  .delete(
    isAuthenticated,
    restrictToSelfOrAdmin,
    isAuthorized('admin', 'super-admin'),
    deleteUser,
  );

router.post('/bulk-upload', (req, res) => {
  res.json({ message: 'Data received' });
});

module.exports = router;
