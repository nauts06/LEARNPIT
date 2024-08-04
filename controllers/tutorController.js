// /controllers/tutorController.js

const User = require('../models/userModel');
const upload = require('../middleware/uploadMiddleware');

// Get tutor profile
exports.getTutorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || user.role !== 'TUTOR') {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update tutor profile
exports.updateTutorProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    const { userName, phoneNumber, teachingExperience, subjects } = req.body;
    let profilePicture = req.file ? req.file.path : undefined;

    try {
      let user = await User.findById(req.user.id);
      if (!user || user.role !== 'TUTOR') {
        return res.status(404).json({ msg: 'Tutor not found' });
      }

      user.userName = userName || user.userName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.teachingExperience = teachingExperience || user.teachingExperience;
      user.subjects = subjects.length ? subjects : user.subjects;
      if (profilePicture) user.profilePicture = profilePicture;

      await user.save();

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
};
