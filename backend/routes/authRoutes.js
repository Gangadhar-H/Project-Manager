const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register User
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('country', 'Country is required').not().isEmpty()
], register);

// Login User
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], login);

// Get current user
router.get('/me', protect, getMe);

// Update user profile
router.put('/updateprofile', protect, updateProfile);

module.exports = router;