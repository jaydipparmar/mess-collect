const User = require('../models/User');

// ─── GET /api/profile ─────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp -otpExpiry');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const { name, age, address, phone } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Check if phone is taken by another user
        if (phone && phone !== user.phone) {
            const phoneExists = await User.findOne({ phone, _id: { $ne: user._id } });
            if (phoneExists) return res.status(409).json({ success: false, message: 'Phone number already in use' });
        }

        if (name) user.name = name;
        if (age !== undefined) user.age = age;
        if (address !== undefined) user.address = address;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                age: user.age,
                address: user.address,
                collegeName: user.collegeName,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
