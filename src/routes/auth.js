const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updatePassword,
  getUsers
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../middleware/validators');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

// Admin only routes
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
