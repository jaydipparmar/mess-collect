const express = require('express');
const router = express.Router();
const {
    createFee, getFees, updateFee, deleteFee, getStudentFees,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');
const { validate, feeSchema } = require('../middleware/validate');

// Student route
router.get('/student-fees', protect, authorize('student'), getStudentFees);

// Contractor routes
router.get('/', protect, authorize('contractor'), getFees);
router.post('/', protect, authorize('contractor'), validate(feeSchema), createFee);
router.put('/:id', protect, authorize('contractor'), updateFee);
router.delete('/:id', protect, authorize('contractor'), deleteFee);

module.exports = router;
