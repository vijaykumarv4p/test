const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, 'User name is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});

const user = mongoose.model('User', userSchema);
module.exports = user;
