const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');

// @desc    Get Admin Dashboard Metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin)
exports.getAdminMetrics = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalHospitals,
      totalDoctors,
      totalDepartments,
      totalPatients,
      totalAppointments,
      todayAppointments,
      confirmedCount,
      pendingCount,
      completedCount,
      cancelledCount,
      recentAppointments
    ] = await Promise.all([
      Hospital.countDocuments(),
      Doctor.countDocuments(),
      Department.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: todayStr }),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
      Appointment.find()
        .populate('patient', 'name email phone')
        .populate('hospital', 'name')
        .populate('doctor', 'name specialty')
        .populate('department', 'name')
        .sort({ createdAt: -1 })
        .limit(6)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully.',
      data: {
        totalHospitals,
        totalDoctors,
        totalDepartments,
        totalPatients,
        totalAppointments,
        todayAppointments,
        statusStats: {
          confirmed: confirmedCount,
          pending: pendingCount,
          completed: completedCount,
          cancelled: cancelledCount
        },
        recentAppointments
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin dashboard metrics.',
      error: err.message
    });
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin)
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });

    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ patient: patient._id });
        return {
          ...patient.toObject(),
          appointmentCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Patients list retrieved.',
      count: patientsWithStats.length,
      data: patientsWithStats
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch patients list.',
      error: err.message
    });
  }
};
