const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true
    },
    specialty: {
      type: String,
      required: [true, 'Please provide specialty'],
      trim: true
    },
    qualification: {
      type: String,
      default: 'MBBS, MD',
      trim: true
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Doctor must be associated with a hospital']
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Doctor must be associated with a department']
    },
    experience: {
      type: String,
      default: 'Experienced'
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    availableSlots: {
      type: [String],
      default: [
        '09:00 AM',
        '09:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
        '02:00 PM',
        '02:30 PM',
        '03:00 PM',
        '03:30 PM',
        '04:00 PM',
        '04:30 PM'
      ]
    },
    source: {
      type: String,
      default: 'Publicly Listed Doctor - Official hospital roster'
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

module.exports = mongoose.model('Doctor', doctorSchema);
