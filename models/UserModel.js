const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ms = require('ms');
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
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
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
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordResetExpires: Date,
  },

  { timestamps: true },
);

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = new Date(
    Date.now() + ms(process.env.RESTORE_PASSWORD_TOKEN_EXPIRES_IN),
  );

  return resetToken;
};

userSchema.pre([/^find/, 'countDocuments'], function (next) {
  this.where({ status: true });
  this.select('-__v -createdAt -updatedAt');
});

// userSchema.pre(/^find/, function (next) {
//   this.where({ status: true });
//   // here no need to add the password fileds since its automatically excluded by select: false in the schema definition
//   // only available when we explicitly select it in the query

// });

userSchema.pre('save', async function (next) {
  if (this.isModified('email') && !this.isNew) {
    //exit if email is try to modified
    next(new Error('Email cannot be modifi  ed/not allowed '));
  }
  if (this.isModified('password') || this.isNew) {
    // has the password or encrypt the password here
    this.password = await bcrypt.hashSync(this.password, 12);
  }
  // next();
});
userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

const User = mongoose.models.Employee || mongoose.model('Employee', userSchema);
// const User = mongoose.model('Employee', userSchema);
module.exports = User;
