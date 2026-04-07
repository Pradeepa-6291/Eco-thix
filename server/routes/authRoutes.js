const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
