const express = require('express');
const router = express.Router();
const { getAdminMetrics, getPatients } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/metrics', protect, authorize('admin'), getAdminMetrics);
router.get('/patients', protect, authorize('admin'), getPatients);

module.exports = router;
