const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
    {
        collegeName: {
            type: String,
            required: [true, 'College name is required'],
            trim: true,
        },
        month: {
            type: String,
            required: [true, 'Month is required'],
            enum: [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December',
            ],
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
            min: 2000,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [1, 'Amount must be positive'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

// Unique fee per college per month/year
feeSchema.index({ collegeName: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Fee', feeSchema);
