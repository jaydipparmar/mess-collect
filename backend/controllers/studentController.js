const User = require('../models/User');
const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const { sendOtpEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

// ─── GET /api/students  (Contractor) ─────────────────────────────────────────
const getAllStudents = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;
        const collegeName = req.user.collegeName;

        const query = { collegeName, role: 'student' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        const students = await User.find(query)
            .select('-password -otp -otpExpiry')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        // If filtering by payment status, enrich students and filter
        if (status === 'paid' || status === 'pending') {
            const fees = await Fee.find({ collegeName });
            const feeIds = fees.map((f) => f._id);

            const enriched = await Promise.all(
                students.map(async (student) => {
                    const payments = await Payment.find({ studentId: student._id, feeId: { $in: feeIds } });
                    const hasPending = payments.some((p) => p.status === 'pending');
                    const paymentStatus = hasPending ? 'pending' : 'paid';
                    return { ...student.toObject(), paymentStatus };
                })
            );

            const filtered = enriched.filter((s) => s.paymentStatus === status);
            return res.status(200).json({ success: true, students: filtered, total: filtered.length });
        }

        res.status(200).json({ success: true, students, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/students/add  (Contractor) ────────────────────────────────────
const addStudent = async (req, res) => {
    try {
        const { name, email, phone, age, address } = req.body;

        const existing = await User.findOne({ $or: [{ email }, { phone }] });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email or phone already registered' });
        }

        const tempPassword = crypto.randomBytes(6).toString('hex'); // Temporary password
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const student = await User.create({
            collegeName: req.user.collegeName,
            name,
            email,
            phone,
            age,
            address,
            password: tempPassword,
            role: 'student',
            otp,
            otpExpiry,
        });

        // Send OTP for the new student to verify
        await sendOtpEmail({ to: email, name, otp });

        // Create pending payments for all existing fees
        const fees = await Fee.find({ collegeName: req.user.collegeName });
        if (fees.length > 0) {
            const paymentDocs = fees.map((f) => ({
                studentId: student._id,
                feeId: f._id,
                status: 'pending',
            }));
            await Payment.insertMany(paymentDocs, { ordered: false });
        }

        res.status(201).json({
            success: true,
            message: 'Student added. An OTP has been sent to their email for account verification.',
            student: { id: student._id, name: student.name, email: student.email, phone: student.phone },
        });
    } catch (error) {
        console.error('Add student error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/students/:id  (Contractor) ─────────────────────────────────────
const updateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student || student.collegeName !== req.user.collegeName) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const { name, age, address, phone } = req.body;
        if (name) student.name = name;
        if (age) student.age = age;
        if (address) student.address = address;
        if (phone) student.phone = phone;

        await student.save();
        res.status(200).json({ success: true, message: 'Student updated', student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── DELETE /api/students/:id  (Contractor) ──────────────────────────────────
const removeStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student || student.collegeName !== req.user.collegeName || student.role !== 'student') {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Delete associated payment records
        await Payment.deleteMany({ studentId: student._id });
        await student.deleteOne();

        res.status(200).json({ success: true, message: 'Student removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getAllStudents, addStudent, updateStudent, removeStudent };
