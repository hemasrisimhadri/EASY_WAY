const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hospital name'],
      trim: true,
      unique: true
    },
    address: {
      type: String,
      required: [true, 'Please provide hospital address'],
      trim: true
    },
    city: {
      type: String,
      default: 'Vijayawada',
      trim: true
    },
    state: {
      type: String,
      default: 'Andhra Pradesh',
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide hospital phone number'],
      trim: true
    },
    emergencyPhone: {
      type: String,
      trim: true
    },
    emergencyAvailable: {
      type: Boolean,
      default: false
    },
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      }
    ],
    website: {
      type: String,
      trim: true
    },
    directionsUrl: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      default: 'Official hospital website'
    },
    lastVerified: {
      type: String,
      default: '2026-09-28'
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

module.exports = mongoose.model('Hospital', hospitalSchema);
