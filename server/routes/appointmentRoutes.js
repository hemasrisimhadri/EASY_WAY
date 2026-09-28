const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

// Patient routes
router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);

// Admin route to list all appointments
router.get('/', protect, authorize('admin'), getAllAppointments);

// Single appointment routes
router.get('/:id', protect, getAppointmentById);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/reschedule', protect, rescheduleAppointment);
router.put('/:id/status', protect, authorize('admin'), updateAppointmentStatus);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;
