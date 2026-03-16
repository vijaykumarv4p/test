const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/UserModel');
const AppError = require('../utils/appError');

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  // const token = req.cookies?.authToken;

  const token = req.headers?.authorization?.startsWith('Bearer')
    ? req.headers?.authorization.split(' ')[1]
    : null;

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 403),
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  console.log('Decoded user from token:---', decoded, user);
  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }
  req.user = user;
  console.log('Decoded user from token:---', decoded, req.user);
  next();
});

exports.isAuthorized = (...roles) => {
  return (req, res, next) => {
    console.log('roles', roles, req?.user?.role);

    if (!roles.includes(req?.user?.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
