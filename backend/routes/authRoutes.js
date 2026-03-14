const express = require('express');
const router = express.Router();
const { signup, verifyOtp, resendOtp, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, signupSchema, verifyOtpSchema, loginSchema } = require('../middleware/validate');

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
