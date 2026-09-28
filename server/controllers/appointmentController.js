const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');

// Helper to generate a unique readable Appointment ID
const generateAppointmentId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `EASY-2026-${randomNum}`;
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient or Admin)
exports.bookAppointment = async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      hospital,
      doctor,
      department,
      date,
      time,
      reason,
      notes
    } = req.body;

    // Validate required fields
    if (!patientName || !patientAge || !patientGender || !patientPhone || !patientEmail || !hospital || !doctor || !department || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All required appointment fields must be provided.',
        error: 'MissingRequiredFields'
      });
    }

    // Validate date is not in the past
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule an appointment for a past date.',
        error: 'PastDateError'
      });
    }

    // Validate Doctor exists and is active
    const doctorObj = await Doctor.findById(doctor);
    if (!doctorObj || doctorObj.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor is not available for appointments.',
        error: 'DoctorUnavailable'
      });
    }

    // Check if slot is already booked for this doctor on this date
    const existingBooking = await Appointment.findOne({
      doctor,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The time slot ${time} on ${date} is already booked for Dr. ${doctorObj.name}. Please select another time slot.`,
        error: 'SlotAlreadyBooked'
      });
    }

    // Generate unique Appointment ID
    let appointmentId = generateAppointmentId();
    let collision = await Appointment.findOne({ appointmentId });
    while (collision) {
      appointmentId = generateAppointmentId();
      collision = await Appointment.findOne({ appointmentId });
    }

    const appointment = await Appointment.create({
      appointmentId,
      patient: req.user._id,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientEmail,
      hospital,
      doctor,
      department,
      date,
      time,
      reason,
      notes: notes || '',
      status: 'Confirmed'
    });

    // Populate references for client response
    const populated = await Appointment.findById(appointment._id)
      .populate('hospital', 'name address phone emergencyPhone')
      .populate('doctor', 'name specialty qualification hospital')
      .populate('department', 'name icon');

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: populated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to book appointment.',
      error: err.message
    });
  }
};

// @desc    Get logged in patient's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('hospital', 'name address phone emergencyPhone directionsUrl')
      .populate('doctor', 'name specialty qualification')
      .populate('department', 'name icon')
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      message: 'My appointments retrieved successfully.',
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments.',
      error: err.message
    });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private (Patient or Admin)
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('hospital', 'name address phone emergencyPhone directionsUrl website')
      .populate('doctor', 'name specialty qualification')
      .populate('department', 'name icon');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
        error: 'NotFound'
      });
    }

    // Ensure patient can only see their own appointments, unless admin
    if (req.user.role !== 'admin' && appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own appointments.',
        error: 'Forbidden'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment details fetched successfully.',
      data: appointment
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment.',
      error: err.message
    });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient or Admin)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
        error: 'NotFound'
      });
    }

    // Role check
    if (req.user.role !== 'admin' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own appointments.',
        error: 'Forbidden'
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been cancelled.',
        error: 'AlreadyCancelled'
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed appointments cannot be cancelled.',
        error: 'CannotCancelCompleted'
      });
    }

    appointment.status = 'Cancelled';
    appointment.cancellationReason = req.body.cancellationReason || 'Cancelled by patient';
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment has been cancelled successfully.',
      data: appointment
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment.',
      error: err.message
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Patient or Admin)
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new date and time.',
        error: 'MissingFields'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
        error: 'NotFound'
      });
    }

    // Check slot availability
    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      date,
      time,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'The requested new slot is already booked. Please pick another time.',
        error: 'SlotAlreadyBooked'
      });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'Confirmed';
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully.',
      data: appointment
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment.',
      error: err.message
    });
  }
};

// @desc    Admin: Get all appointments with flexible filtering
// @route   GET /api/appointments
// @access  Private (Admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const { date, hospital, doctor, department, status, search } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (hospital) filter.hospital = hospital;
    if (doctor) filter.doctor = doctor;
    if (department) filter.department = department;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { appointmentId: { $regex: search, $options: 'i' } },
        { patientName: { $regex: search, $options: 'i' } },
        { patientPhone: { $regex: search, $options: 'i' } }
      ];
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('hospital', 'name address phone')
      .populate('doctor', 'name specialty')
      .populate('department', 'name')
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      message: 'All appointments retrieved.',
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get appointments.',
      error: err.message
    });
  }
};

// @desc    Admin: Update appointment status (Pending, Confirmed, Completed, Cancelled)
// @route   PUT /api/appointments/:id/status
// @access  Private (Admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be Pending, Confirmed, Completed, or Cancelled.',
        error: 'InvalidStatus'
      });
    }

    const updateData = { status };
    if (notes) updateData.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('hospital', 'name').populate('doctor', 'name').populate('department', 'name');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
        error: 'NotFound'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: appointment
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update appointment status.',
      error: err.message
    });
  }
};

// @desc    Admin: Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
        error: 'NotFound'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully.',
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete appointment.',
      error: err.message
    });
  }
};
