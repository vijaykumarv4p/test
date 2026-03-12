const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    panNumber: {
      type: String,
      unique: true,
      required: [true, 'PAN Number is required'],
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/.test(value);
        },
        message: 'PAN Number must be 10 characters long',
      },
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
      select: false,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      maxlength: [10, 'Password must be at most 10 characters'],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._])/.test(value);
        },
        message:
          'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
      },
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['admin', 'user', 'manager'],
      default: 'user',
    },
    employeeId: {
      type: String,
      unique: true,
    },
    department: {
      type: String,
      enum: ['HR', 'Finance', 'Engineering', 'Sales'],
      default: 'Engineering',
    },
    status: {
      type: Boolean,
      default: true,
    },
    image: String,
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          // atleat 18 year old
          const eighteenYearsAgo = new Date();
          eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
          return value <= eighteenYearsAgo;
        },
        message: 'User must be at least 18 years old',
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return true;
  // await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('email') && !this.isNew) {
    //exit if email is try to modified
    next(new Error('Email cannot be modified/not allowed '));
  }
  if (this.isModified('password') || this.isNew) {
    // has the password or encrypt the password here
    this.password = await bcrypt.hashSync(this.password, 12);
  }
});

const User = mongoose.models.Employee || mongoose.model('Employee', userSchema);
// const User = mongoose.model('Employee', userSchema);
module.exports = User;
