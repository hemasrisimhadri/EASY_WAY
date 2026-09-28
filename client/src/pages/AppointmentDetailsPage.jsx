import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { appointmentService } from '../services/api';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  MapPin,
  Phone,
  Printer,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  FileText
} from 'lucide-react';

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService.getById(id)
      .then((res) => {
        if (res.success) setAppointment(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <CardSkeleton />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <EmptyState
          title="Appointment Not Found"
          description="The requested appointment details could not be found or you do not have permission to view them."
          actionLabel="Back to My Appointments"
          actionLink="/patient/appointments"
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '820px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/patient/appointments" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} />
          <span>Back to Appointments</span>
        </Link>

        <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
          <Printer size={15} />
          <span>Print Slip</span>
        </button>
      </div>

      {/* Printable Appointment Pass */}
      <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid var(--border-glow)' }}>
        {/* Pass Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Official Consultation Slip
            </span>
            <h1 style={{ fontSize: '2rem', margin: '0.2rem 0', color: 'var(--primary-cyan)', fontFamily: 'var(--font-heading)' }}>
              {appointment.appointmentId}
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Booked via EASYWAY Platform • Vijayawada
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`status-badge ${appointment.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
              {appointment.status}
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Date Booked: {new Date(appointment.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Patient and Schedule Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Patient Information
            </h4>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {appointment.patientName}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Age: {appointment.patientAge} | Gender: {appointment.patientGender}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Ph: {appointment.patientPhone}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {appointment.patientEmail}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Specialist Doctor
            </h4>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {appointment.doctor?.name}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary-cyan)' }}>
              {appointment.doctor?.specialty}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {appointment.doctor?.qualification}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', marginTop: '0.25rem' }}>
              Dept: {appointment.department?.name}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Appointment Time
            </h4>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              {appointment.date}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)' }}>
              {appointment.time}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Please report 15 mins prior
            </div>
          </div>
        </div>

        {/* Hospital Address and Directions */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Hospital Venue
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0.2rem 0' }}>
                {appointment.hospital?.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={15} color="var(--primary-cyan)" />
                <span>{appointment.hospital?.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
                <Phone size={14} />
                <span>Hospital Contact: {appointment.hospital?.phone}</span>
              </div>
            </div>

            {appointment.hospital?.directionsUrl && (
              <a
                href={appointment.hospital.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <Navigation size={14} />
                <span>Open in Maps</span>
              </a>
            )}
          </div>
        </div>

        {/* Reason and Notes */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', fontSize: '0.92rem' }}>
          <div style={{ marginBottom: '0.6rem' }}>
            <strong style={{ color: '#fff' }}>Consultation Reason: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>{appointment.reason}</span>
          </div>

          {appointment.notes && (
            <div style={{ marginBottom: '0.6rem' }}>
              <strong style={{ color: '#fff' }}>Doctor Notes / Symptoms: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{appointment.notes}</span>
            </div>
          )}

          {appointment.cancellationReason && appointment.status === 'Cancelled' && (
            <div style={{ color: '#f87171' }}>
              <strong>Cancellation Notice: </strong>
              <span>{appointment.cancellationReason}</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ marginTop: '1.75rem', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', marginBottom: '0.25rem' }}>
            Patient Checklist for Hospital Visit:
          </div>
          • Present this digital Appointment ID or print slip at the hospital consultation reception.<br />
          • Carry any previous medical investigation reports, prescriptions, or insurance cards.<br />
          • In case of emergency changes, contact the hospital directly at {appointment.hospital?.phone}.
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
