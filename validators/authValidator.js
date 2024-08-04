const { body, validationResult } = require('express-validator');

exports.register = [
  body('userName').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .exists().withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
  body('role').isIn(['ADMIN', 'TUTOR', 'STUDENT']).withMessage('Role must be one of ADMIN, TUTOR, or STUDENT'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.login = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.forgotPassword = [
  body('email').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];
