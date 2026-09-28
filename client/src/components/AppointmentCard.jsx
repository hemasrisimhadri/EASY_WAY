import React from 'react';
import { Calendar, Clock, Building2, User, Stethoscope, AlertCircle, XCircle, RotateCcw, Eye } from 'lucide-react';

const statusBadgeMap = {
  Confirmed: { text: 'Confirmed', class: 'badge-emerald' },
  Pending: { text: 'Pending', class: 'badge-warning' },
  Completed: { text: 'Completed', class: 'badge-blue' },
  Cancelled: { text: 'Cancelled', class: 'badge-danger' }
};

const AppointmentCard = ({ appointment, onView, onCancel, onReschedule }) => {
  const statusInfo = statusBadgeMap[appointment.status] || {
    text: appointment.status,
    class: 'badge-cyan'
  };

  const isCancellable = appointment.status === 'Confirmed' || appointment.status === 'Pending';
  const isReschedulable = appointment.status === 'Confirmed' || appointment.status === 'Pending';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem'
      }}
    >
      <div>
        {/* Top Header: ID & Status */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Appointment ID
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
              {appointment.appointmentId}
            </div>
          </div>
          <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
        </div>

        {/* Doctor & Department */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={18} color="var(--accent-teal)" />
            <span>{appointment.doctor?.name || 'Assigned Doctor'}</span>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <Stethoscope size={14} />
            <span>
              {appointment.department?.name || appointment.doctor?.specialty || 'Medical Specialty'}
            </span>
          </div>
        </div>

        {/* Hospital */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          <Building2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{appointment.hospital?.name || 'Healthcare Facility'}</span>
        </div>

        {/* Date and Time Badge Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: '#ffffff' }}>
            <Calendar size={15} color="var(--accent-cyan)" />
            <span>{appointment.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
            <Clock size={15} color="var(--accent-teal)" />
            <span>{appointment.time}</span>
          </div>
        </div>

        {/* Reason for Visit */}
        {appointment.reason && (
          <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong>Reason:</strong> {appointment.reason}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.6rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <button
          type="button"
          onClick={() => onView && onView(appointment)}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, minWidth: '100px' }}
        >
          <Eye size={14} />
          <span>Details</span>
        </button>

        {isReschedulable && onReschedule && (
          <button
            type="button"
            onClick={() => onReschedule(appointment)}
            className="btn btn-outline-cyan btn-sm"
            style={{ flex: 1, minWidth: '110px' }}
          >
            <RotateCcw size={14} />
            <span>Reschedule</span>
          </button>
        )}

        {isCancellable && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(appointment)}
            className="btn btn-danger btn-sm"
            style={{ flex: 1, minWidth: '90px' }}
          >
            <XCircle size={14} />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
