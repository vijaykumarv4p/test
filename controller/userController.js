const User = require('../models/UserModel');
const APIfeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const Token = require('../models/TokenModel');
const ms = require('ms');
exports.getNewUsers = (req, res, next) => {
  req.query.sort = 'createdAt:desc';
  req.query.limit = 5;
  req.query.fields = 'firstName,lastName,email,panNumber,createdAt';
  req.query.page = 1;
  res.locals.endpoint = 'latestUsers';

  next();
};

exports.getAllUser = asyncHandler(async (req, res, next) => {
  const features = new APIfeatures(User.find({}), req.query);
  features.filter();
  let total = await User.countDocuments(features.query);
  features.sort().limitFields().paginate();
  const users = await features.query.exec();

  if (res.locals.endpoint === 'latestUsers') {
    return res.status(200).json({
      data: { users },
    });
  }
  res.status(200).json({
    message: 'Success',
    data: { total, users },
  });
});
exports.createUser = async (req, res) => {
  try {
    // const existingUser = await User.findOne({ email: req.body.email });
    // if (existingUser) {
    //   return res.status(400).json({
    //     message: 'Email already exists\n,Please try to login ',
    //   });
    // }

    // let user = new userModel(req.body);
    // let createdUser = await user.save();
    // console.log(req.bady);
    let user = await User.create(req.body);

    res.status(200).json({
      message: 'User Created Successfully',
      data: { id: user._id, pan: user.panNumber },
    });
  } catch (error) {
    let errorMsg = error.message ?? 'User creation failed';
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      errorMsg = `${field} already exists`;
    }
    res.status(400).json({
      message: errorMsg,
      error: error,
    });
  }
};
exports.getUser = asyncHandler(async (req, res) => {
  let query = User.findById(String(req.params.id));

  const features = new APIfeatures(query, {});
  features.limitFields();
  const user = await features.query.exec();

  //  await User.findById(String(req.params.id));

  res.status(200).json({
    message: 'Success',
    data: { user },
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  if (req.body.role) {
    delete req.body.role;
  }
  let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    message: 'Success',
    data: { updatedUser },
  });
});

exports.patchUser = async (req, res) => {
  try {
    // remove rolefileds from body
    if (req.body.role) {
      delete req.body.role;
    }
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: 'Success',
      data: { updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong ',
      info: error.message,
    });
  }
};

exports.deleteUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { status: false, isDeleted: true, deletedAt: new Date() },
    { new: true, runValidators: true },
  );
  if (!updatedUser) {
    return res.status(404).json({
      message: 'User not found/Invalid user ID',
    });
  }
  res.status(200).json({
    message: 'User deleted successfully',
    info: { updatedUser },
  });
});

exports.bulkUpload = async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'User deleted successfully',
      info: { updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong ',
      info: error.message,
    });
  }
};

exports.refreshToken = asyncHandler(async (req, res, next) => {
  // const refreshToken = req.cookies?.refreshToken;
  let token = req.headers?.refreshtoken;
  console.log('refreshToken', req.headers, token);
  const refreshToken = token?.startsWith('Bearer') ? token.split(' ')[1] : null;
  if (!refreshToken) {
    return next(new AppError('No refresh token provided', 403));
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  // Generate a new access token
  const newToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  const newRefreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );
  // res.cookie('token', newToken, {
  //   httpOnly: true,
  //   secure: true,
  //   // sameSite: 'strict',
  //   maxAge: 3600000,
  // });
  // res.cookie('refreshToken', newRefreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // });
  const tokenDoc = await Token.findOneAndUpdate(
    { userId: decoded.id, refreshToken },
    {
      authToken: newToken,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN)),
    },
    { new: true },
  );
  if (!tokenDoc) {
    return next(new AppError('Refresh token invalid or expired', 403));
  }

  res.status(200).json({
    message: 'Token refreshed successfully',
    authToken: newToken,
    refreshToken: newRefreshToken,
  });
  //cookies only
  // res.status(200).json({
  //   message: 'Token refreshed successfully',
  //   data: { user },
  // });
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  let { currentPassword, newPassword } = req?.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'New and old password required' });
  }
  let user = await User.findById(req?.user?.id).select('+password');
  console.log(user.password, user);

  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Invalid current password', 403));
  }
  user.password = newPassword;
  await user.save();
  // let updatedUser = await User.findByIdAndUpdate(
  //   req?.user?.id,
  //   { password: newPassword },
  //   { new: true, runValidators: true },
  // );

  res.status(200).json({ message: 'Password Updated Successfully' });
});
