const express = require('express');
const authenticate = require('../controller/authenticate');
const router = express.Router();

const { signUp, login, logout } = require('../controller/authController');
router.post('/sign-up', signUp);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/refresh', logout);

module.exports = router;
