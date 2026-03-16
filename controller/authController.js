const User = require('../models/UserModel');
const APIfeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../models/TokenModel');
const ms = require('ms');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
// const jwtService= require('../utils/service/jwtService');
exports.signUp = asyncHandler(async (req, res, next) => {
  let user = await User.create(req.body);
  res.status(200).json({
    message: 'User Created Successfully',
    data: { id: user._id, pan: user.panNumber },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 403));
  }
  const authToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },

    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );

  const expiresAt = new Date(
    Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN),
  );

  await Token.create({
    userId: user._id,
    authToken,
    refreshToken,
    expiresAt,
    deviceInfo: req.headers['user-agent'] || 'Unknown device',
    ipAddress: req.ip || req.connection.remoteAddress || 'Unknown IP',
  });

  res.status(200).json({
    message: 'Login successful',
    authToken,
    refreshToken,
    data: { user },
  });
  // res.cookie('authToken', authToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  //   maxAge: 3600000,
  // });
  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // });
  // res.status(200).json({
  //   message: 'Login successful',
  //   data: { id: user._id, pan: user.panNumber },
  // });
});

exports.logout = asyncHandler(async (req, res, next) => {
  let token = req.headers?.authorization || req.headers?.authtoken;
  const authToken = token?.startsWith('Bearer') ? token.split(' ')[1] : null;
  const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
  //  delete the token
  let removeToken = await Token.deleteOne({
    userId: decoded.id,
    authToken,
  });
  console.log('removeToken', removeToken);

  if (removeToken?.deletedCount === 0) {
    return next(new AppError('Invalid token', 401));
  }
  // res.clearCookie('authToken');
  // res.clearCookie('refreshToken');
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

  const resetToken = await user.generateResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset (valid for 10min)',
      message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
  // logic to send the email to the user with the reset token
  res.status(200).json({ message: 'Password reset token sent to email' });
});

exports.resetPasswordUsingToken = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const token = req.params.token;
  if (!token || !password) {
    return next(new AppError('Please provide token and new password', 400));
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  } else {
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }

  // logic goes here to find the user by the token and reset the password
  // decode the token and find the user by the decoded token
  res.status(200).json({ message: 'Password reset successful' });
});
