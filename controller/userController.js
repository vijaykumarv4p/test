const user = require('../modals/UserModal');
const User = require('../modals/UserModal');

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: 'Success',
      data: { users, total: users.length },
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
