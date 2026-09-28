import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/api';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Stethoscope,
  Building2,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Award,
  ArrowRight
} from 'lucide-react';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Today as default date (formatted YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Fetch doctor details and slot availability for selectedDate
  useEffect(() => {
    setLoading(true);
    doctorService.getById(id, { date: selectedDate })
      .then((res) => {
        if (res.success) {
          setData(res.data);
          // Reset selected slot if not available
          setSelectedSlot('');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, selectedDate]);

  const handleProceedToBooking = () => {
    if (!selectedSlot) return;
    const { doctor } = data;
    navigate(`/book-appointment?doctorId=${doctor._id}&hospitalId=${doctor.hospital._id}&departmentId=${doctor.department._id}&date=${selectedDate}&time=${encodeURIComponent(selectedSlot)}`);
  };

  if (loading && !data) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '40px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '80%', height: '140px', marginBottom: '2rem' }} />
      </div>
    );
  }

  if (!data || !data.doctor) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <EmptyState
          title="Doctor Not Found"
          description="The requested doctor profile could not be retrieved from the directory."
          actionLabel="Back to Doctors"
          actionLink="/doctors"
        />
      </div>
    );
  }

  const { doctor, slots } = data;

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <Link to="/doctors" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <ArrowLeft size={14} />
        <span>All Doctors</span>
      </Link>

      {/* Main Doctor Profile Card */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span className="doctor-badge">
                <CheckCircle2 size={13} /> {doctor.listingType || 'Publicly Listed Doctor'}
              </span>
              <span className="dept-pill">{doctor.department?.name || 'Medical Department'}</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', margin: '0.3rem 0' }}>{doctor.name}</h1>
            <div style={{ fontSize: '1.25rem', color: 'var(--primary-cyan)', fontWeight: 600, marginBottom: '0.4rem' }}>
              {doctor.specialty}
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {doctor.qualification}
            </div>

            {/* Hospital Affiliation & Verified Hospital Contact */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>
                <Building2 size={18} color="var(--primary-cyan)" />
                <Link to={`/hospitals/${doctor.hospital?._id}`} style={{ color: '#fff', textDecoration: 'underline' }}>
                  {doctor.hospital?.name}
                </Link>
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginLeft: '1.75rem', marginBottom: '0.5rem' }}>
                {doctor.hospital?.address}, {doctor.hospital?.city}
              </div>

              {/* Verified hospital contact phone (Requirement 13: Never display private phone numbers) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1.75rem', color: 'var(--accent-teal)', fontSize: '0.88rem' }}>
                <Phone size={15} />
                <span>Hospital Appointment Desk: {doctor.hospital?.phone}</span>
              </div>
            </div>
          </div>

          <div style={{ minWidth: '220px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.4rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Clinical Experience
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              {doctor.experience || 'Experienced Specialist'}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Consultation Days
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {doctor.availableDays?.join(', ') || 'Monday - Saturday'}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Source: {doctor.source || 'Official hospital roster'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Slot Booking Section (Requirement 14 & 15) */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={22} color="var(--primary-cyan)" />
          <span>Select Date & Real-time Available Slot</span>
        </h2>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.92rem' }}>
          Select an appointment date to view real-time booked vs available slots for Dr. {doctor.name}.
        </p>

        {/* Date Selector */}
        <div style={{ maxWidth: '320px', marginBottom: '1.75rem' }}>
          <label className="form-label" htmlFor="appointment-date-input">Appointment Date:</label>
          <input
            id="appointment-date-input"
            type="date"
            className="form-control"
            value={selectedDate}
            min={todayStr}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Slot Legend */}
        <div className="slot-badge-legend">
          <span><span className="legend-dot available"></span> Available</span>
          <span><span className="legend-dot booked"></span> Booked (Unavailable)</span>
          <span><span className="legend-dot selected"></span> Selected</span>
        </div>

        {/* Slots Grid */}
        <div className="slots-grid">
          {slots && slots.length > 0 ? (
            slots.map((slotObj, idx) => (
              <button
                key={idx}
                type="button"
                disabled={slotObj.isBooked}
                onClick={() => setSelectedSlot(slotObj.time)}
                className={`slot-btn ${slotObj.isBooked ? 'booked' : 'available'} ${selectedSlot === slotObj.time ? 'selected' : ''}`}
                title={slotObj.isBooked ? 'Slot already booked by another patient' : 'Available for booking'}
              >
                <div>{slotObj.time}</div>
                <div style={{ fontSize: '0.68rem', marginTop: '0.2rem', opacity: 0.8 }}>
                  {slotObj.isBooked ? 'BOOKED' : 'AVAILABLE'}
                </div>
              </button>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No slots listed for this specialist.</p>
          )}
        </div>

        {/* Action Button */}
        <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
          <div>
            {selectedSlot ? (
              <span style={{ fontSize: '0.95rem', color: '#fff' }}>
                Selected: <strong style={{ color: 'var(--primary-cyan)' }}>{selectedDate}</strong> at <strong style={{ color: 'var(--primary-cyan)' }}>{selectedSlot}</strong>
              </span>
            ) : (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Please click on an AVAILABLE time slot above to proceed.
              </span>
            )}
          </div>

          <button
            onClick={handleProceedToBooking}
            disabled={!selectedSlot}
            className="btn btn-primary btn-lg"
            style={{ opacity: selectedSlot ? 1 : 0.5, cursor: selectedSlot ? 'pointer' : 'not-allowed' }}
          >
            <span>Proceed to Patient Details</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
