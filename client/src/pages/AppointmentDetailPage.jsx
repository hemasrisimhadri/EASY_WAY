import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appointmentService } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Clock,
  Building2,
  User,
  Stethoscope,
  Phone,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Compass,
  FileText
} from 'lucide-react';

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    appointmentService
      .getAppointmentById(id)
      .then((res) => {
        if (res.data?.data) {
          setAppointment(res.data.data);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load appointment details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSkeleton count={2} />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <EmptyState
          title="Appointment Record Not Found"
          description={error || 'The requested appointment details could not be retrieved.'}
          actionText="Back to My Appointments"
          actionLink="/patient/appointments"
        />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top back button and print action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to="/patient/appointments"
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
          <span>Back to My Appointments</span>
        </Link>

        <button type="button" onClick={handlePrint} className="btn btn-secondary btn-sm">
          <Printer size={15} />
          <span>Print Appointment Slip</span>
        </button>
      </div>

      {/* Main Printable Ticket Card */}
      <div
        className="glass-card"
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          width: '100%',
          padding: '2.75rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.04) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.25)'
        }}
      >
        {/* Header Branding & Status */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-teal)', fontWeight: 700 }}>
              EASYWAY Official Consultation Pass
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }}>
              {appointment.appointmentId}
            </div>
          </div>
          <span className={`badge ${appointment.status === 'Confirmed' ? 'badge-emerald' : appointment.status === 'Cancelled' ? 'badge-danger' : 'badge-cyan'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {appointment.status}
          </span>
        </div>

        {/* Schedule Highlight Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem',
            margin: '2rem 0',
            background: 'rgba(0, 245, 212, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0, 245, 212, 0.2)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Appointment Date</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
              <Calendar size={18} color="var(--accent-cyan)" />
              <span>{appointment.date}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Slot</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
              <Clock size={18} color="var(--accent-teal)" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>

        {/* Doctor and Hospital Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Stethoscope size={16} color="var(--accent-teal)" />
              <span>Consulting Specialist</span>
            </h3>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              {appointment.doctor?.name || 'Dr. Assigned'}
            </div>
            <div style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {appointment.department?.name || appointment.doctor?.specialty}
            </div>
            {appointment.doctor?.qualification && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                {appointment.doctor?.qualification}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} color="var(--accent-cyan)" />
              <span>Hospital Facility</span>
            </h3>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              {appointment.hospital?.name}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {appointment.hospital?.address}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              <Phone size={14} color="var(--accent-teal)" />
              <span>{appointment.hospital?.phone}</span>
            </div>
          </div>
        </div>

        {/* Patient Details Section */}
        <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={15} color="var(--accent-blue)" />
            <span>Patient Records</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Patient Name: </span>
              <strong style={{ color: '#ffffff' }}>{appointment.patientName}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Demographics: </span>
              <strong style={{ color: '#ffffff' }}>{appointment.patientAge} Years &bull; {appointment.patientGender}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
              <strong style={{ color: '#ffffff' }}>{appointment.patientPhone}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Email: </span>
              <strong style={{ color: '#ffffff' }}>{appointment.patientEmail}</strong>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Reason for Visit: </span>
            <span style={{ color: '#ffffff' }}>{appointment.reason}</span>
          </div>

          {appointment.notes && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Clinical Notes:</strong> {appointment.notes}
            </div>
          )}
        </div>

        {/* Hospital directions if present */}
        {appointment.hospital?.directionsUrl && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a
              href={appointment.hospital.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-cyan btn-sm"
            >
              <Compass size={15} />
              <span>Get Directions to {appointment.hospital.name}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailPage;
