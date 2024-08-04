// /routes/tutorRoutes.js

const express = require('express');
const { getTutorProfile, updateTutorProfile } = require('../controllers/tutorController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getTutorProfile);
router.put('/profile', authMiddleware, updateTutorProfile);

module.exports = router;   
