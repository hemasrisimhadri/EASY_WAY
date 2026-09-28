const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors (filters: department, hospital, status)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const { department, hospital, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'active';
    }

    if (department) {
      filter.department = department;
    }

    if (hospital) {
      filter.hospital = hospital;
    }

    const doctors = await Doctor.find(filter)
      .populate('hospital', 'name address phone emergencyPhone emergencyAvailable')
      .populate('department', 'name icon')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: 'Doctors fetched successfully.',
      count: doctors.length,
      data: doctors
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors.',
      error: err.message
    });
  }
};

// @desc    Get single doctor details and slot availability for a selected date
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('hospital', 'name address phone emergencyPhone emergencyAvailable website directionsUrl')
      .populate('department', 'name description icon');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
        error: 'NotFound'
      });
    }

    const date = req.query.date; // YYYY-MM-DD
    let slotsStatus = [];

    if (date) {
      // Find booked appointments for this doctor on that date (excluding cancelled)
      const bookedAppointments = await Appointment.find({
        doctor: doctor._id,
        date: date,
        status: { $in: ['Pending', 'Confirmed'] }
      }).select('time');

      const bookedTimes = bookedAppointments.map((app) => app.time);

      slotsStatus = (doctor.availableSlots || []).map((slot) => ({
        time: slot,
        isBooked: bookedTimes.includes(slot),
        status: bookedTimes.includes(slot) ? 'BOOKED' : 'AVAILABLE'
      }));
    } else {
      slotsStatus = (doctor.availableSlots || []).map((slot) => ({
        time: slot,
        isBooked: false,
        status: 'AVAILABLE'
      }));
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor details fetched successfully.',
      data: {
        doctor,
        dateSelected: date || null,
        slots: slotsStatus,
        slotsStatus: slotsStatus
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor details.',
      error: err.message
    });
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private (Admin)
exports.createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualification,
      hospital,
      department,
      experience,
      availableDays,
      availableSlots,
      status,
      source
    } = req.body;

    if (!name || !specialty || !hospital || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields (name, specialty, hospital, department).',
        error: 'MissingFields'
      });
    }

    // Verify hospital and department exist
    const hospitalExists = await Hospital.findById(hospital);
    if (!hospitalExists) {
      return res.status(404).json({
        success: false,
        message: 'Specified hospital does not exist.',
        error: 'HospitalNotFound'
      });
    }

    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: 'Specified department does not exist.',
        error: 'DepartmentNotFound'
      });
    }

    const doctor = await Doctor.create({
      name,
      specialty,
      qualification: qualification || 'MBBS, MD',
      hospital,
      department,
      experience: experience || 'Experienced Specialist',
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      availableSlots: availableSlots || ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'],
      status: status || 'active',
      source: source || 'Official hospital website',
      lastVerified: '2026-09-28'
    });

    return res.status(201).json({
      success: true,
      message: 'Doctor added successfully.',
      data: doctor
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create doctor.',
      error: err.message
    });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin)
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('hospital', 'name').populate('department', 'name');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
        error: 'NotFound'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully.',
      data: doctor
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update doctor.',
      error: err.message
    });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.',
        error: 'NotFound'
      });
    }

    // Check if active appointments exist for this doctor
    const activeAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ['Pending', 'Confirmed'] }
    });

    if (activeAppointments > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete doctor. There are ${activeAppointments} active upcoming appointment(s) scheduled. Please cancel or reassign them first.`,
        error: 'HasActiveAppointments'
      });
    }

    await doctor.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully.',
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete doctor.',
      error: err.message
    });
  }
};
