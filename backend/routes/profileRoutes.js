const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { validate, profileUpdateSchema } = require('../middleware/validate');

router.get('/', protect, getProfile);
router.put('/', protect, validate(profileUpdateSchema), updateProfile);

module.exports = router;
