const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  console.log('token -----', req.cookies, token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
});

module.exports = authenticate;
