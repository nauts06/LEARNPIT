// /routes/studentRoutes.js

const express = require('express');
const { getStudentProfile, updateStudentProfile } = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getStudentProfile);
router.put('/profile', authMiddleware, updateStudentProfile);

module.exports = router;
