const User = require('../models/userModel');
const APIfeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');

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

exports.deleteUser = async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'User deletedsuccessfully',
      info: { updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong ',
      info: error.message,
    });
  }
};

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
