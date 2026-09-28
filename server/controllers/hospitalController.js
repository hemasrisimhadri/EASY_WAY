const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all hospitals (filter by department, emergency availability)
// @route   GET /api/hospitals
// @access  Public
exports.getHospitals = async (req, res) => {
  try {
    const { department, emergencyOnly, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'active';
    }

    if (department) {
      filter.departments = department;
    }

    if (emergencyOnly === 'true') {
      filter.emergencyAvailable = true;
    }

    const hospitals = await Hospital.find(filter)
      .populate('departments', 'name icon')
      .sort({ name: 1 });

    // Include doctor counts for each hospital
    const hospitalsWithCount = await Promise.all(
      hospitals.map(async (hosp) => {
        const doctorCount = await Doctor.countDocuments({
          hospital: hosp._id,
          status: 'active'
        });
        return {
          ...hosp.toObject(),
          doctorCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Hospitals fetched successfully.',
      count: hospitalsWithCount.length,
      data: hospitalsWithCount
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hospitals.',
      error: err.message
    });
  }
};

// @desc    Get single hospital details with doctors
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('departments', 'name description icon');
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found.',
        error: 'NotFound'
      });
    }

    // Get doctors belonging to this hospital
    const doctors = await Doctor.find({
      hospital: hospital._id,
      status: 'active'
    }).populate('department', 'name icon');

    return res.status(200).json({
      success: true,
      message: 'Hospital details fetched successfully.',
      data: {
        hospital,
        doctors
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital details.',
      error: err.message
    });
  }
};

// @desc    Create new hospital
// @route   POST /api/hospitals
// @access  Private (Admin)
exports.createHospital = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      phone,
      emergencyPhone,
      departments,
      website,
      directionsUrl,
      information,
      emergencyAvailable,
      source,
      status
    } = req.body;

    if (!name || !address || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required hospital details (name, address, pincode, phone).',
        error: 'MissingFields'
      });
    }

    const hospital = await Hospital.create({
      name,
      address,
      city: city || 'Vijayawada',
      state: state || 'Andhra Pradesh',
      pincode,
      phone,
      emergencyPhone: emergencyPhone || '',
      emergencyAvailable: Boolean(emergencyAvailable || emergencyPhone),
      departments: departments || [],
      website: website || '',
      directionsUrl: directionsUrl || '',
      information: information || 'Leading healthcare hospital located in Vijayawada, Andhra Pradesh.',
      source: source || 'Official hospital listing',
      lastVerified: '2026-09-28',
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Hospital created successfully.',
      data: hospital
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create hospital.',
      error: err.message
    });
  }
};

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Private (Admin)
exports.updateHospital = async (req, res) => {
  try {
    if (req.body.emergencyPhone) {
      req.body.emergencyAvailable = true;
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found.',
        error: 'NotFound'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Hospital updated successfully.',
      data: hospital
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update hospital.',
      error: err.message
    });
  }
};

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Private (Admin)
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found.',
        error: 'NotFound'
      });
    }

    // Check if doctors exist under this hospital
    const doctorCount = await Doctor.countDocuments({ hospital: hospital._id });
    if (doctorCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete hospital. There are ${doctorCount} doctor(s) associated with it. Please reassign or delete them first.`,
        error: 'HasAssociatedDoctors'
      });
    }

    await hospital.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Hospital deleted successfully.',
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete hospital.',
      error: err.message
    });
  }
};
