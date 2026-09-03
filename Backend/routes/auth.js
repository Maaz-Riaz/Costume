const express = require('express');
const { login, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/register', register); // Should be restricted in production
router.get('/me', protect, getMe);

module.exports = router;
