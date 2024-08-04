// /controllers/studentController.js

const User = require('../models/userModel');
const upload = require('../middleware/uploadMiddleware');

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || user.role !== 'STUDENT') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    const { name, phoneNumber, grade, courses } = req.body;
    let profilePicture = req.file ? req.file.path : undefined;

    try {
      let user = await User.findById(req.user.id);
      if (!user || user.role !== 'STUDENT') {
        return res.status(404).json({ msg: 'Student not found' });
      }

      user.name = name || user.name;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.grade = grade || user.grade;
      user.courses = courses.length ? courses : user.courses;
      if (profilePicture) user.profilePicture = profilePicture;

      await user.save();

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
};
