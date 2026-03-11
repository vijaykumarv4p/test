const User = require('../modals/UserModal');
const APIfeatures = require('../utils/apiFeatures');
exports.getNewUsers = (req, res, next) => {
  req.query.sort = 'createdAt:desc';
  req.query.limit = 5;
  req.query.fields = 'firstName,lastName,email,panNumber,createdAt';
  req.query.page = 1;
  res.locals.endpoint = 'latestUsers';

  next();
};

exports.getAllUser = async (req, res) => {
  try {
    let queryParams = req.query;
    const features = new APIfeatures(User.find({}), req.query);
    features.filter();
    let total = await User.countDocuments(features.query);
    features.sort().limitFields().paginate();
    const users = await features.query.exec();

    if (res.locals.endpoint === 'latestUsers') {
      return res.json({
        data: { users },
      });
    }
    res.status(200).json({
      message: 'Success',
      data: { total, users },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ?? 'Something went wrong ',
    });
  }
};
exports.createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists\n,Please try to login ',
      });
    }

    // let user = new userModal(req.body);
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
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(String(req.params.id));
    res.status(200).json({
      message: 'Success',
      data: { user },
    });
  } catch (error) {
    res.status(404).json({
      message: 'Something went wrong ',
      info: error.message,
    });
  }
  // const id = Number(req.params.id);{ id:
};

exports.updateUser = async (req, res) => {
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
