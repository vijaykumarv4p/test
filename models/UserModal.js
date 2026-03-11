const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      // unique: true,
      lowercase: true,
      trim: true,
    },
    panNumber: {
      type: String,
      unique: true,
      required: [true, 'PAN Number is required'],
      // lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    employeeId: String,
    department: {
      type: String,
      default: 'department',
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: String,
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true },
);

const user = mongoose.model('User', userSchema);
module.exports = user;
