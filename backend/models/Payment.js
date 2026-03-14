const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        feeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fee',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        razorpayOrderId: {
            type: String,
            default: null,
        },
        transactionId: {
            type: String,
            default: null,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        receiptUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Prevent duplicate payment records per student per fee
paymentSchema.index({ studentId: 1, feeId: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema);
