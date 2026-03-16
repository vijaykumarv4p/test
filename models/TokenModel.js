const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    deviceInfo: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);
// refresh token only
// tokenSchema.methods.compareToken = async function (candidateToken, userToken) {
//   return await bcrypt.compare(candidateToken, userToken);
// };

// tokenSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hashSync(this.refreshToken, 24);
//   next();
// });
module.exports = mongoose.model('Token', tokenSchema);
