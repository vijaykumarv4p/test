const express = require('express');
const { isAuthenticated } = require('../controller/authenticateController');
const router = express.Router();

const {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPasswordUsingToken,
} = require('../controller/authController');
router.post('/sign-up', signUp);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
// router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPasswordUsingToken);
router.post('/reset-password', forgotPassword);
module.exports = router;
