const Department = require('../models/Department');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getDepartments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const departments = await Department.find(filter).sort({ name: 1 });

    // Optional: get doctor and hospital count per department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const hospitalCount = await Hospital.countDocuments({
          departments: dept._id,
          status: 'active'
        });
        const doctorCount = await Doctor.countDocuments({
          department: dept._id,
          status: 'active'
        });
        return {
          ...dept.toObject(),
          hospitalCount,
          doctorCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Departments fetched successfully.',
      count: departmentsWithCounts.length,
      data: departmentsWithCounts
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch departments.',
      error: err.message
    });
  }
};

// @desc    Get single department with related hospitals and doctors
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
        error: 'NotFound'
      });
    }

    // Find hospitals offering this department
    const hospitals = await Hospital.find({
      departments: department._id,
      status: 'active'
    }).populate('departments', 'name');

    // Find doctors in this department
    const doctors = await Doctor.find({
      department: department._id,
      status: 'active'
    }).populate('hospital', 'name address phone emergencyPhone emergencyAvailable');

    return res.status(200).json({
      success: true,
      message: 'Department details fetched successfully.',
      data: {
        department,
        hospitals,
        doctors
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch department details.',
      error: err.message
    });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, icon, status } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required.',
        error: 'MissingFields'
      });
    }

    const existing = await Department.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A department with this name already exists.',
        error: 'DuplicateName'
      });
    }

    const department = await Department.create({
      name,
      description,
      icon: icon || 'Heart',
      status: status || 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: department
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create department.',
      error: err.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
        error: 'NotFound'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      data: department
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update department.',
      error: err.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
        error: 'NotFound'
      });
    }

    // Check if doctors are assigned to this department
    const doctorCount = await Doctor.countDocuments({ department: department._id });
    if (doctorCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department. There are ${doctorCount} doctor(s) assigned to it. Remove or reassign them first.`,
        error: 'HasAssociatedDoctors'
      });
    }

    await department.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully.',
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete department.',
      error: err.message
    });
  }
};
