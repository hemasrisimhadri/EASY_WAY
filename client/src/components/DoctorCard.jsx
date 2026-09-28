import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Award, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        {/* Top Designation Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <UserCheck size={13} />
            Publicly Listed Doctor
          </span>
          {doctor.experience && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {doctor.experience} Exp.
            </span>
          )}
        </div>

        {/* Doctor Name */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
          {doctor.name}
        </h3>

        {/* Specialty */}
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-teal)', marginBottom: '0.6rem' }}>
          {doctor.specialty}
        </div>

        {/* Qualification */}
        {doctor.qualification && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <Award size={15} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
            <span>{doctor.qualification}</span>
          </div>
        )}

        {/* Hospital Affiliation */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          <Building2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{doctor.hospital?.name || 'Affiliated Hospital'}</span>
        </div>

        {/* Available Schedule Days */}
        {doctor.availableDays && doctor.availableDays.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} />
              <span>Available Consultation Days</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {doctor.availableDays.map((day) => (
                <span
                  key={day}
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(0, 180, 216, 0.1)',
                    border: '1px solid rgba(0, 180, 216, 0.25)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--accent-blue)'
                  }}
                >
                  {day.substring(0, 3)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Available Slots Indicator */}
        <div
          style={{
            padding: '0.75rem 0',
            borderTop: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>Available Daily Slots:</span>
          <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>
            {doctor.availableSlots?.length || 0} Slots
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Link to={`/doctors/${doctor._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            <span>Profile</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to={`/book?doctorId=${doctor._id}&hospitalId=${doctor.hospital?._id || ''}&departmentId=${doctor.department?._id || ''}`}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <Calendar size={14} />
            <span>Book Slot</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
