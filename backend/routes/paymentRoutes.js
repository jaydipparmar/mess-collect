const express = require('express');
const router = express.Router();
const {
    createOrder, verifyPayment, getMyPayments, getAllPayments, getAnalytics,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Student routes
router.post('/create-order', protect, authorize('student'), createOrder);
router.post('/verify', protect, authorize('student'), verifyPayment);
router.get('/my-payments', protect, authorize('student'), getMyPayments);

// Contractor routes
router.get('/all', protect, authorize('contractor'), getAllPayments);
router.get('/analytics', protect, authorize('contractor'), getAnalytics);

module.exports = router;
