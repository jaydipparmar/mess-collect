const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const User = require('../models/User');

// ─── POST /api/fees  (Contractor only) ────────────────────────────────────────
const createFee = async (req, res) => {
    try {
        const { month, year, amount } = req.body;
        const collegeName = req.user.collegeName;

        // Prevent duplicate fee
        const existing = await Fee.findOne({ collegeName, month, year });
        if (existing) {
            return res.status(409).json({ success: false, message: `Fee for ${month} ${year} already exists` });
        }

        const fee = await Fee.create({ collegeName, month, year, amount, createdBy: req.user._id });

        // Auto-create pending payment records for all verified students in same college
        const students = await User.find({ collegeName, role: 'student', isVerified: true });
        if (students.length > 0) {
            const paymentDocs = students.map((s) => ({
                studentId: s._id,
                feeId: fee._id,
                status: 'pending',
            }));
            await Payment.insertMany(paymentDocs, { ordered: false });
        }

        res.status(201).json({ success: true, message: 'Fee created successfully', fee });
    } catch (error) {
        console.error('Create fee error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/fees  (Contractor) ──────────────────────────────────────────────
const getFees = async (req, res) => {
    try {
        const collegeName = req.user.collegeName;
        const fees = await Fee.find({ collegeName }).sort({ year: -1, createdAt: -1 });
        res.status(200).json({ success: true, fees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/fees/:id  (Contractor only) ─────────────────────────────────────
const updateFee = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);
        if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });

        // Ensure contractor can only edit fees for their college
        if (fee.collegeName !== req.user.collegeName) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this fee' });
        }

        const { month, year, amount } = req.body;
        if (month) fee.month = month;
        if (year) fee.year = year;
        if (amount) fee.amount = amount;

        await fee.save();
        res.status(200).json({ success: true, message: 'Fee updated successfully', fee });
    } catch (error) {
        console.error('Update fee error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── DELETE /api/fees/:id  (Contractor only) ──────────────────────────────────
const deleteFee = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);
        if (!fee) return res.status(404).json({ success: false, message: 'Fee not found' });

        if (fee.collegeName !== req.user.collegeName) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this fee' });
        }

        // Delete related payments
        await Payment.deleteMany({ feeId: fee._id });
        await fee.deleteOne();

        res.status(200).json({ success: true, message: 'Fee and related payments deleted' });
    } catch (error) {
        console.error('Delete fee error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/fees/student-fees  (Student) ────────────────────────────────────
// Returns all fees for student's college, enriched with payment status
const getStudentFees = async (req, res) => {
    try {
        const collegeName = req.user.collegeName;
        const fees = await Fee.find({ collegeName }).sort({ year: -1, createdAt: -1 });

        // Fetch existing payment records for this student
        const feeIds = fees.map((f) => f._id);
        const payments = await Payment.find({ studentId: req.user._id, feeId: { $in: feeIds } });

        const paymentMap = {};
        payments.forEach((p) => {
            paymentMap[p.feeId.toString()] = p;
        });

        const enriched = fees.map((fee) => ({
            ...fee.toObject(),
            payment: paymentMap[fee._id.toString()] || null,
        }));

        res.status(200).json({ success: true, fees: enriched });
    } catch (error) {
        console.error('Get student fees error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createFee, getFees, updateFee, deleteFee, getStudentFees };
