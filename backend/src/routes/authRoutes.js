const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public Auth Endpoints
router.post('/register', register);
router.post('/login', login);

// Private Authenticated Endpoints
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);
router.put('/profile', authenticateUser, updateProfile);

module.exports = router;
