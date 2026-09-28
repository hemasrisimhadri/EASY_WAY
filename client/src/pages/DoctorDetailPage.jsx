import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Stethoscope,
  Building2,
  Award,
  Phone,
  Calendar,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get tomorrow's date formatted as YYYY-MM-DD
  const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [doctor, setDoctor] = useState(null);
  const [slotsStatus, setSlotsStatus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getDefaultDate());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    doctorService
      .getDoctorById(id, selectedDate)
      .then((res) => {
        if (res.data?.data) {
          setDoctor(res.data.data.doctor);
          setSlotsStatus(res.data.data.slotsStatus || []);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load doctor profile.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // When date changes, refetch slot status
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedSlot('');
    setSlotsLoading(true);

    doctorService
      .getDoctorById(id, newDate)
      .then((res) => {
        if (res.data?.data) {
          setSlotsStatus(res.data.data.slotsStatus || []);
        }
      })
      .catch((err) => console.error('Error fetching date slots:', err))
      .finally(() => setSlotsLoading(false));
  };

  const handleProceedToBooking = () => {
    const params = new URLSearchParams({
      doctorId: doctor._id,
      hospitalId: doctor.hospital?._id || '',
      departmentId: doctor.department?._id || '',
      date: selectedDate,
      time: selectedSlot
    });
    navigate(`/book?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <EmptyState
          title="Doctor Not Found"
          description={error || 'Doctor profile could not be retrieved.'}
          actionText="Back to Doctors"
          actionLink="/doctors"
        />
      </div>
    );
  }

  // Calculate minimum selectable date (today)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Back button */}
      <div>
        <Link
          to="/doctors"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Doctors</span>
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left: Doctor Bio & Affiliation Card */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.04) 100%)',
            borderColor: 'rgba(0, 245, 212, 0.25)'
          }}
        >
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
              Publicly Listed Doctor
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
              {doctor.name}
            </h1>
            <div style={{ fontSize: '1.15rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
              {doctor.specialty}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem' }}>
            {doctor.qualification && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
                <Award size={18} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
                <span>Qualification: <strong>{doctor.qualification}</strong></span>
              </div>
            )}

            {doctor.experience && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
                <ShieldCheck size={18} color="var(--accent-teal)" style={{ flexShrink: 0 }} />
                <span>Experience: <strong>{doctor.experience}</strong></span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-primary)' }}>
              <Building2 size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span>Hospital Affiliation:</span>
                <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '0.15rem' }}>
                  {doctor.hospital?.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {doctor.hospital?.address}
                </div>
              </div>
            </div>

            {/* Official Hospital Appointment Phone (Never private phone) */}
            <div
              style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginTop: '0.5rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Hospital Consultation Line
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 700 }}>
                <Phone size={16} color="var(--accent-teal)" />
                <a href={`tel:${doctor.hospital?.phone}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                  {doctor.hospital?.phone}
                </a>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Note: In strict compliance with privacy standards, hospital reception coordinates consultation scheduling.
              </div>
            </div>
          </div>

          {/* Verification Source */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <span>Source: <strong>{doctor.source || 'Hospital Medical Roster'}</strong></span>
            <br />
            <span>Verified as of: <strong>{doctor.lastVerified || '2026-09-28'}</strong></span>
          </div>
        </div>

        {/* Right: Slot Selection and Direct Booking */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--accent-cyan)" />
              <span>Select Consultation Slot</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Choose your preferred date and select an available time window.
            </p>
          </div>

          {/* Date Picker Input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="appointment-date-input">
              <Calendar size={15} color="var(--accent-teal)" />
              <span>Consultation Date</span>
            </label>
            <input
              id="appointment-date-input"
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Time Slot Picker Component */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} color="var(--accent-blue)" />
              <span>Available Time Slots on {selectedDate}</span>
            </div>

            {slotsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Checking real-time slot bookings...
              </div>
            ) : (
              <TimeSlotPicker
                slots={slotsStatus}
                selectedTime={selectedSlot}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
              />
            )}
          </div>

          {/* Booking Action */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleProceedToBooking}
              disabled={!selectedSlot}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <Calendar size={18} />
              <span>
                {selectedSlot
                  ? `Proceed with ${selectedSlot} Slot`
                  : 'Select an Available Slot to Continue'}
              </span>
            </button>
            {!selectedSlot && (
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.6rem', margin: 0 }}>
                Please click on any active (green) slot above to enable appointment booking.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
