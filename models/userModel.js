// /models/userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'TUTOR', 'STUDENT'], required: true },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  profilePicture: { type: String },
  phoneNumber: { type: String },
  // Tutor-specific fields
  teachingExperience: { type: Number },
  subjects: [{ type: String }],
  // Student-specific fields
  grade: { type: String },
  courses: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);
