const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Please provide department description'],
      trim: true
    },
    icon: {
      type: String,
      default: 'Activity'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Department', departmentSchema);
