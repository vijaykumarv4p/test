const User = require('../models/UserModel');
const APIfeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = asyncHandler(async (req, res, next) => {
  // const existingUser = await User.findOne({ email: req.body.email });
  // if (existingUser) {
  //   return res.status(400).json({
  //     message: 'Email already exists\n,Please try to login ',
  //   });
  // }
  let user = await User.create(req.body);
  res.status(200).json({
    message: 'User Created Successfully',
    data: { id: user._id, pan: user.panNumber },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    console.log('AppError ', email, password);
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  // const checkPassword = await bcrypt.compare(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    // sameSite: 'strict',
    maxAge: 3600000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.status(200).json({
    message: 'Login successful',
    data: { id: user._id, pan: user.panNumber },
  });
});
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 401));
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  // Generate a new access token
  const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const newRefreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );
  res.cookie('token', newToken, {
    httpOnly: true,
    secure: true,
    // sameSite: 'strict',
    maxAge: 3600000,
  });
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: 'Token refreshed successfully',
    data: { id: user._id, pan: user.panNumber },
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  console.log('Logout successful');
  res.status(200).json({
    message: 'Logout successful',
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Please provide email', 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }
  // logic to send the email to the user with the reset token
  res.status(200).json({ message: 'Password reset token sent to email' });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return next(new AppError('Please provide token and new password', 400));
  }
  // logic goes here to find the user by the token and reset the password
  // decode the token and find the user by the decoded token
  res.status(200).json({ message: 'Password reset successful' });
});
