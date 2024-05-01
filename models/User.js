const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0
  },
  etatDelete: {
    type: Boolean,
    default: false
  },
  forgetPwd: {
    type: String
  },
    AddWalet:{
        type: String,
        default: ''
    },
    pkeyWalet:{
        type: String,
        default: ''
    },
  resetPasswordToken: String, // New field to store reset password token
  resetPasswordExpires: Date // New field to store reset password token expiration time
});

const User = mongoose.model('User', userSchema);

module.exports = User;
