const express = require('express');
const { validateLogin, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { login, getMe, changePassword } = require('../controllers/authController');

const router = express.Router();

// POST /api/admin/login
router.post('/login', validateLogin, handleValidationErrors, login);

// GET /api/admin/me
router.get('/me', authenticateToken, getMe);

// POST /api/admin/change-password
router.post('/change-password', authenticateToken, changePassword);

module.exports = router;