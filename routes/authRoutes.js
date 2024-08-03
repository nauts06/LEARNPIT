const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');

router.post('/register', authValidator.register, authController.register);
router.post('/login', authValidator.login, authController.login);
router.post('/forgot-password', authValidator.forgotPassword, authController.forgotPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/reset-password', authController.forgotPassword);
module.exports = router;

