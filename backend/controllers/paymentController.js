const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const User = require('../models/User');
const { sendReceiptEmail } = require('../utils/sendEmail');
const { generateReceiptHtml } = require('../utils/generateReceipt');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── POST /api/payments/create-order ─────────────────────────────────────────
const createOrder = async (req, res) => {
    try {
        const { paymentId } = req.body; // Payment document _id

        const payment = await Payment.findById(paymentId).populate('feeId');
        if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

        if (payment.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // If the payment is already paid (due to an earlier crash before frontend could fetch it), 
        // return success so the frontend UI can move forward!
        if (payment.status === 'paid') {
            return res.status(200).json({
                success: true,
                orderId: payment.razorpayOrderId || `order_dummy_${crypto.randomBytes(4).toString('hex')}`,
                amount: Math.round(payment.feeId.amount * 100),
                currency: 'INR',
                keyId: 'dummy_key',
            });
        }

        const amountInPaise = Math.round(payment.feeId.amount * 100);

        // --- DUMMY PAYMENT SYSTEM ---
        const dummyOrderId = `order_dummy_${crypto.randomBytes(4).toString('hex')}`;

        // Store active order ID
        payment.razorpayOrderId = dummyOrderId;
        await payment.save();

        res.status(200).json({
            success: true,
            orderId: dummyOrderId,
            amount: amountInPaise,
            currency: 'INR',
            keyId: 'dummy_key',
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create dummy payment order',
            error: error.message || 'Unknown error'
        });
    }
};

// ─── POST /api/payments/verify ────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;

        // --- DUMMY PAYMENT SYSTEM ---
        // (Bypassing Razorpay Signature Verification entirely)

        const payment = await Payment.findById(paymentId).populate('feeId');
        if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

        // Prevent duplicate payments from throwing errors and locking the UI
        if (payment.status === 'paid') {
            return res.status(200).json({
                success: true,
                message: 'Payment was already verified successfully!',
                payment: {
                    _id: payment._id,
                    status: payment.status,
                    transactionId: payment.transactionId,
                    paidAt: payment.paidAt,
                    fee: payment.feeId,
                },
            });
        }

        const dummyTransactionId = `pay_dummy_${crypto.randomBytes(6).toString('hex')}`;

        // Update payment record
        payment.status = 'paid';
        payment.transactionId = dummyTransactionId;
        payment.paidAt = new Date();
        await payment.save();

        // Fetch student for receipt
        const student = await User.findById(payment.studentId);

        // Generate receipt HTML and email
        const receiptHtml = generateReceiptHtml({
            studentName: student?.name || 'Student',
            collegeName: student?.collegeName || payment.feeId.collegeName,
            email: student?.email || 'N/A',
            month: payment.feeId.month,
            year: payment.feeId.year,
            amount: payment.feeId.amount,
            transactionId: dummyTransactionId,
            paidAt: payment.paidAt,
        });

        if (student && student.email) {
            await sendReceiptEmail({
                to: student.email,
                receiptHtml,
                studentName: student.name,
                month: payment.feeId.month,
                year: payment.feeId.year,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Dummy Payment verified successfully! Receipt sent to your email.',
            payment: {
                _id: payment._id,
                status: payment.status,
                transactionId: payment.transactionId,
                paidAt: payment.paidAt,
                fee: payment.feeId,
            },
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during dummy payment verification',
            error: error.message
        });
    }
};

// ─── GET /api/payments/my-payments  (Student) ────────────────────────────────
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ studentId: req.user._id })
            .populate('feeId')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/payments/all  (Contractor) ──────────────────────────────────────
const getAllPayments = async (req, res) => {
    try {
        const collegeName = req.user.collegeName;

        // Find all fees for this college
        const fees = await Fee.find({ collegeName });
        const feeIds = fees.map((f) => f._id);

        const payments = await Payment.find({ feeId: { $in: feeIds } })
            .populate('studentId', 'name email phone collegeName')
            .populate('feeId', 'month year amount')
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/payments/analytics  (Contractor) ───────────────────────────────
const getAnalytics = async (req, res) => {
    try {
        const collegeName = req.user.collegeName;
        const fees = await Fee.find({ collegeName });
        const feeIds = fees.map((f) => f._id);

        const totalStudents = await User.countDocuments({ collegeName, role: 'student', isVerified: true });
        const paidPayments = await Payment.find({ feeId: { $in: feeIds }, status: 'paid' }).populate('feeId', 'amount');
        const pendingCount = await Payment.countDocuments({ feeId: { $in: feeIds }, status: 'pending' });

        const totalCollected = paidPayments.reduce((sum, p) => sum + (p.feeId?.amount || 0), 0);

        res.status(200).json({
            success: true,
            analytics: {
                totalStudents,
                totalCollected,
                totalPaid: paidPayments.length,
                totalPending: pendingCount,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createOrder, verifyPayment, getMyPayments, getAllPayments, getAnalytics };
