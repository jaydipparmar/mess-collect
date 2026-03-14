const express = require('express');
const router = express.Router();
const {
    getAllStudents, addStudent, updateStudent, removeStudent,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('contractor'), getAllStudents);
router.post('/add', protect, authorize('contractor'), addStudent);
router.put('/:id', protect, authorize('contractor'), updateStudent);
router.delete('/:id', protect, authorize('contractor'), removeStudent);

module.exports = router;
