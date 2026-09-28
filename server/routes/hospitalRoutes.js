const express = require('express');
const router = express.Router();
const {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
} = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getHospitals)
  .post(protect, authorize('admin'), createHospital);

router.route('/:id')
  .get(getHospitalById)
  .put(protect, authorize('admin'), updateHospital)
  .delete(protect, authorize('admin'), deleteHospital);

module.exports = router;
