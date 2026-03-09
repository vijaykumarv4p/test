const userModal = require('../modals/UserModal');
exports.checkUserBody = (req, res, next) => {
  if (!req.body.userName || !req.body.password) {
    return res.status(400).json({
      message: 'Invalid request : userName or Password missing ',
      data: {},
    });
  }
  next();
};
exports.getAllUser = (req, res) => {
  res.status(200).json({
    message: 'Success',
    // data: { User: User, total: User.length },
  });
};
exports.createUser = async (req, res) => {
  try {
    const userName = req.body.userName;
    const password = req.body.password;

    // let user = new userModal({
    //   userName,
    //   password,
    // });
    // let createdUser = await user.save();
    let user = await userModal.create({
      userName,
      password,
    });

    res.status(200).json({
      message: 'User Created Successfully',
      data: { id: user._id, userName: user.userName },
    });
  } catch (error) {
    console.log('error userCerate  ', error);
    res.status(500).json({
      message: error.message ?? 'User creation failed',
      error: error,
    });
  }
};
exports.getUser = (req, res) => {
  console.log(`Received a request for User with ID: ${req.params.id}`);
  const id = Number(req.params.id);
  res.status(200).json({
    message: 'Success',
    // data: { user, meta: { type: 'all route ' } },
  });
};
exports.updateUser = (req, res) => {
  console.log(`Received a PUT request for User with ID: ${req.params.id}`);
  const id = Number(req.params.id);
};
exports.patchUser = (req, res) => {
  console.log(`Received a PATCH request for User with ID: ${req.params.id}`);
  const id = Number(req.params.id);
};

exports.deleteUser = (req, res) => {
  console.log(`Received a DELETE request for User with ID: ${req.params.id}`);
  const id = Number(req.params.id);
};
