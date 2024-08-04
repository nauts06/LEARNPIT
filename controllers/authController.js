const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const mailer = require('../utils/mailer');

exports.register = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ userName, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("error" , error);
    
    res.status(500).json({ message: 'Server error', error });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // console.log('Access token generated:', accessToken);
    // console.log('Refresh token generated:', refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });  // <-- Ensure this doesn't trigger validation

    console.log('Refresh token saved to user');
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.refreshToken = async (req, res) => {
  try {
    const { token: refreshToken } = req.body;

    console.log("am looking", refreshToken);
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(400).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false }); // Ensure validation is bypassed

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Error during refresh token:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:4000/reset-password?token=${token}`;
    
    // Send the reset link via email
    await mailer.sendMail(email, 'Password Reset', `Click the link to reset your password: ${resetLink}`);
    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a method to handle password reset link
