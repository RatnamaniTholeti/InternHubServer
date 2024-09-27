// routes/authRoutes.js
const express = require('express');
const { login, createUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', login);

// @route   POST /api/auth/create-user
// @desc    Admin creates Manager/Intern users
router.post('/create-user', authMiddleware, createUser);

module.exports = router;
