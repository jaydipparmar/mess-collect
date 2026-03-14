const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/sendEmail');

/**
 * Generate a 6-digit OTP
 */
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signup = async (req, res) => {
    try {
        const { collegeName, name, age, address, phone, email, password, role } = req.body;

        // Check for VERIFIED existing user
        const verifiedUser = await User.findOne({
            $or: [{ email }, { phone }],
            isVerified: true
        });

        if (verifiedUser) {
            if (verifiedUser.email === email) {
                return res.status(409).json({ success: false, message: 'Email already registered' });
            }
            return res.status(409).json({ success: false, message: 'Phone number already registered' });
        }

        // Delete any UNVERIFIED existing users with this email or phone so they can retry
        await User.deleteMany({
            $or: [{ email }, { phone }],
            isVerified: false
        });

        // Generate OTP with 5-min expiry
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Create user (password hashed by pre-save hook)
        const user = await User.create({
            collegeName,
            name,
            age,
            address,
            phone,
            email,
            password,
            role,
            otp,
            otpExpiry,
        });

        // Send OTP email
        await sendOtpEmail({ to: email, name, otp });

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email for the OTP.',
            email: user.email,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: `Server error during registration: ${error.message}` });
    }
};

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Activate account and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Account verified successfully! You can now log in.' });
    } catch (error) {
        console.error('OTP verify error:', error);
        res.status(500).json({ success: false, message: 'Server error during OTP verification' });
    }
};

// ─── POST /api/auth/resend-otp ────────────────────────────────────────────────
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified' });

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        await sendOtpEmail({ to: user.email, name: user.name, otp });

        res.status(200).json({ success: true, message: 'New OTP sent to your email' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
    try {
        const { emailOrPhone, password, role } = req.body;

        // Find by email or phone
        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Account not verified. Please verify your OTP.',
                email: user.email,
            });
        }

        if (user.role !== role) {
            return res.status(401).json({ success: false, message: `This account is registered as a ${user.role}. Please select the correct role.` });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                collegeName: user.collegeName,
                age: user.age,
                address: user.address,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};

module.exports = { signup, verifyOtp, resendOtp, login, getMe };
