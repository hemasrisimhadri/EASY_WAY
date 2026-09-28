import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  departmentService,
  hospitalService,
  doctorService,
  appointmentService
} from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';
import {
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  Layers,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Tomorrow as default date string
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Step selection state
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('departmentId') || '');
  const [selectedHospital, setSelectedHospital] = useState(searchParams.get('hospitalId') || '');
  const [selectedDoctor, setSelectedDoctor] = useState(searchParams.get('doctorId') || '');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || getDefaultDate());
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');

  // Slots status for chosen doctor and date
  const [slotsStatus, setSlotsStatus] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Patient Info Form
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Submission & Success state
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [formError, setFormError] = useState('');

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      if (!patientName) setPatientName(user.name || '');
      if (!patientPhone) setPatientPhone(user.phone || '');
      if (!patientEmail) setPatientEmail(user.email || '');
    }
  }, [user]);

  // Load active departments
  useEffect(() => {
    departmentService
      .getDepartments({ status: 'active' })
      .then((res) => {
        if (res.data?.data) setDepartments(res.data.data);
      })
      .catch((err) => console.error('Error fetching departments:', err));
  }, []);

  // When department changes, load hospitals offering this department
  useEffect(() => {
    const params = { status: 'active' };
    if (selectedDepartment) params.department = selectedDepartment;

    hospitalService
      .getHospitals(params)
      .then((res) => {
        if (res.data?.data) {
          setHospitals(res.data.data);
          // If current hospital is not in list, clear it
          if (selectedHospital && !res.data.data.find((h) => h._id === selectedHospital)) {
            setSelectedHospital('');
          }
        }
      })
      .catch((err) => console.error('Error loading hospitals:', err));
  }, [selectedDepartment]);

  // When hospital or department changes, load matching doctors
  useEffect(() => {
    const params = { status: 'active' };
    if (selectedHospital) params.hospital = selectedHospital;
    if (selectedDepartment) params.department = selectedDepartment;

    doctorService
      .getDoctors(params)
      .then((res) => {
        if (res.data?.data) {
          setDoctors(res.data.data);
          // If current doctor is not in list, clear it
          if (selectedDoctor && !res.data.data.find((d) => d._id === selectedDoctor)) {
            setSelectedDoctor('');
          }
        }
      })
      .catch((err) => console.error('Error loading doctors:', err));
  }, [selectedHospital, selectedDepartment]);

  // When doctor or date changes, load slots status
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setSlotsStatus([]);
      return;
    }

    setSlotsLoading(true);
    doctorService
      .getDoctorById(selectedDoctor, selectedDate)
      .then((res) => {
        if (res.data?.data) {
          setSlotsStatus(res.data.data.slotsStatus || []);
          // Auto select doctor's department and hospital if not already selected
          if (!selectedDepartment && res.data.data.doctor?.department?._id) {
            setSelectedDepartment(res.data.data.doctor.department._id);
          }
          if (!selectedHospital && res.data.data.doctor?.hospital?._id) {
            setSelectedHospital(res.data.data.doctor.hospital._id);
          }
        }
      })
      .catch((err) => console.error('Error loading slot availability:', err))
      .finally(() => setSlotsLoading(false));
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isAuthenticated) {
      showToast('Please log in or create an account to book your appointment.', 'info');
      navigate('/login', { state: { from: '/book' } });
      return;
    }

    // Validation
    if (!selectedDepartment) {
      setFormError('Please select a healthcare department.');
      return;
    }
    if (!selectedHospital) {
      setFormError('Please select a hospital facility.');
      return;
    }
    if (!selectedDoctor) {
      setFormError('Please select a doctor for your appointment.');
      return;
    }
    if (!selectedDate) {
      setFormError('Please select a valid consultation date.');
      return;
    }
    if (!selectedTime) {
      setFormError('Please select an available consultation time slot.');
      return;
    }
    if (!patientName.trim()) {
      setFormError('Please provide the patient full name.');
      return;
    }
    if (!patientAge || isNaN(patientAge) || Number(patientAge) <= 0) {
      setFormError('Please enter a valid patient age.');
      return;
    }
    if (!patientPhone.trim()) {
      setFormError('Please provide a valid contact telephone number.');
      return;
    }
    if (!patientEmail.trim()) {
      setFormError('Please provide a valid patient email address.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please describe the primary reason for your visit.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        patientName: patientName.trim(),
        patientAge: Number(patientAge),
        patientGender,
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim().toLowerCase(),
        department: selectedDepartment,
        hospital: selectedHospital,
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
        notes: notes.trim()
      };

      const response = await appointmentService.bookAppointment(payload);
      if (response.data?.success) {
        setConfirmedBooking(response.data.data);
        showToast('Appointment booked successfully! Your Appointment ID has been generated.', 'success');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to book appointment. The time slot may already be reserved.');
      showToast(err.message || 'Booking failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If appointment just confirmed, render celebration confirmation screen
  if (confirmedBooking) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem 6rem 1.5rem' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            borderColor: 'rgba(0, 245, 212, 0.4)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.08) 100%)',
            boxShadow: 'var(--accent-glow)'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(6, 214, 160, 0.15)',
              border: '2px solid var(--accent-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--accent-teal)',
              boxShadow: '0 0 25px rgba(6, 214, 160, 0.3)'
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <span className="badge badge-emerald" style={{ marginBottom: '1rem' }}>
            Confirmed in MongoDB Database
          </span>

          <h1 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>
            Appointment Confirmed!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            Your consultation has been booked successfully at the medical facility.
          </p>

          {/* Generated Appointment ID Box */}
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(0, 245, 212, 0.08)',
              border: '1px dashed var(--accent-cyan)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Official Appointment ID
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-display)',
                marginTop: '0.3rem',
                letterSpacing: '0.05em'
              }}
            >
              {confirmedBooking.appointmentId}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Please quote this ID upon arrival at the hospital reception.
            </div>
          </div>

          {/* Booking Summary Card */}
          <div
            style={{
              textAlign: 'left',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              fontSize: '0.92rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
              <strong style={{ color: '#ffffff' }}>{confirmedBooking.patientName} ({confirmedBooking.patientAge}y, {confirmedBooking.patientGender})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Doctor:</span>
              <strong style={{ color: 'var(--accent-teal)' }}>{confirmedBooking.doctor?.name || 'Medical Specialist'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Department:</span>
              <strong style={{ color: '#ffffff' }}>{confirmedBooking.department?.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hospital:</span>
              <strong style={{ color: '#ffffff' }}>{confirmedBooking.hospital?.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Consultation Slot:</span>
              <strong style={{ color: 'var(--accent-cyan)' }}>{confirmedBooking.date} at {confirmedBooking.time}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hospital Contact:</span>
              <strong style={{ color: '#ffffff' }}>{confirmedBooking.hospital?.phone}</strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/patient/appointments" className="btn btn-primary">
              <Calendar size={16} />
              <span>Go to My Appointments</span>
            </Link>
            <Link to="/patient/dashboard" className="btn btn-secondary">
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem' }}>
      <div className="section-header" style={{ marginBottom: '2.5rem' }}>
        <span className="section-tag">
          <Calendar size={16} />
          Direct In-Clinic Booking
        </span>
        <h1 className="section-title">Schedule Healthcare Appointment</h1>
        <p className="section-desc">
          Complete the guided steps below to secure your consultation time slot in Vijayawada.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Error alert banner */}
        {formError && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
              fontSize: '0.92rem'
            }}
          >
            <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Department & Facility Selection */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            <span>Step 1: Department &amp; Hospital</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {/* Department select */}
            <div className="form-group">
              <label className="form-label" htmlFor="dept-select">
                <span>Medical Department *</span>
              </label>
              <select
                id="dept-select"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setSelectedDoctor('');
                  setSelectedTime('');
                }}
                className="form-select"
                required
              >
                <option value="">-- Choose Department --</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital select */}
            <div className="form-group">
              <label className="form-label" htmlFor="hosp-select">
                <span>Hospital Facility in Vijayawada *</span>
              </label>
              <select
                id="hosp-select"
                value={selectedHospital}
                onChange={(e) => {
                  setSelectedHospital(e.target.value);
                  setSelectedDoctor('');
                  setSelectedTime('');
                }}
                className="form-select"
                required
              >
                <option value="">-- Choose Hospital --</option>
                {hospitals.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name} {h.emergencyAvailable ? '🚨 (24/7 Emergency)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Doctor & Time Slot Selection */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={18} color="var(--accent-teal)" />
            <span>Step 2: Doctor &amp; Available Slot</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Doctor select */}
            <div className="form-group">
              <label className="form-label" htmlFor="doc-select">
                <span>Publicly Listed Doctor *</span>
              </label>
              <select
                id="doc-select"
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setSelectedTime('');
                }}
                className="form-select"
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (selectedHospital || selectedDepartment) && (
                <span style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.3rem' }}>
                  Doctor roster not verified for this specific combination. Please choose another hospital/department or contact the hospital.
                </span>
              )}
            </div>

            {/* Date Picker */}
            <div className="form-group">
              <label className="form-label" htmlFor="date-picker">
                <span>Consultation Date *</span>
              </label>
              <input
                id="date-picker"
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>
              <Clock size={15} color="var(--accent-blue)" />
              <span>Select Available Time Slot *</span>
            </label>

            {slotsLoading ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                Checking real-time slot availability...
              </div>
            ) : !selectedDoctor ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Please select a doctor to view available time slots.
              </div>
            ) : (
              <TimeSlotPicker
                slots={slotsStatus}
                selectedTime={selectedTime}
                onSelectSlot={(slot) => setSelectedTime(slot)}
              />
            )}
          </div>
        </div>

        {/* Section 3: Patient Information */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent-blue)" />
            <span>Step 3: Patient Information</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="patient-name">Patient Full Name *</label>
              <input
                id="patient-name"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patient-age">Age *</label>
              <input
                id="patient-age"
                type="number"
                min="1"
                max="125"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 35"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patient-gender">Gender *</label>
              <select
                id="patient-gender"
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
                className="form-select"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="patient-phone">Contact Phone *</label>
              <input
                id="patient-phone"
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patient-email">Email Address *</label>
              <input
                id="patient-email"
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="e.g. patient@example.com"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="patient-reason">Reason for Visit / Symptoms *</label>
            <input
              id="patient-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Routine cardiovascular checkup, joint pain consultation"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="patient-notes">Additional Clinical Notes (Optional)</label>
            <textarea
              id="patient-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any past history, medications or specific requests for the clinic..."
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>

        {/* Confirmation & Submit Button */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center'
          }}
        >
          <button
            type="submit"
            disabled={submitting || !selectedTime}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', maxWidth: '420px' }}
          >
            <CheckCircle2 size={20} />
            <span>{submitting ? 'Confirming with Hospital...' : 'Confirm & Book Appointment'}</span>
          </button>

          {!selectedTime && (
            <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>
              Please pick an available green time slot above to proceed.
            </span>
          )}

          {!isAuthenticated && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Note: You will be asked to sign in or create an account to record your booking.
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
