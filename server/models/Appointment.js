const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    patientAge: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: 0,
      max: 130
    },
    patientGender: {
      type: String,
      required: [true, 'Patient gender is required'],
      enum: ['Male', 'Female', 'Other']
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone is required'],
      trim: true
    },
    patientEmail: {
      type: String,
      required: [true, 'Patient email is required'],
      trim: true,
      lowercase: true
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: [true, 'Hospital is required']
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required']
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required']
    },
    date: {
      type: String,
      required: [true, 'Appointment date is required']
    },
    time: {
      type: String,
      required: [true, 'Appointment time slot is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason for visit is required'],
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed'
    }
  },
  {
    timestamps: true
  }
);

// Compound index to help query doctor bookings quickly
appointmentSchema.index({ doctor: 1, date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
