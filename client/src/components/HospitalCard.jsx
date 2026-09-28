import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, AlertCircle, Calendar, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';

const HospitalCard = ({ hospital }) => {
  const hasDoctors = (hospital.doctorCount || 0) > 0;

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
        {/* Top Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1rem' }}>
          {hospital.emergencyAvailable ? (
            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
              24/7 Emergency
            </span>
          ) : (
            <span className="badge badge-cyan">Speciality Care</span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-teal)', fontSize: '0.78rem' }}>
            <ShieldCheck size={14} />
            <span>Verified Source</span>
          </div>
        </div>

        {/* Hospital Name */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
          {hospital.name}
        </h3>

        {/* Address */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
          <MapPin size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            {hospital.address}, {hospital.city || 'Vijayawada'}
            {hospital.pincode ? ` - ${hospital.pincode}` : ''}
          </span>
        </div>

        {/* Phone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          <Phone size={15} color="var(--accent-teal)" style={{ flexShrink: 0 }} />
          <span>Reception: <strong style={{ color: '#ffffff' }}>{hospital.phone}</strong></span>
        </div>

        {/* Emergency phone if verified */}
        {hospital.emergencyPhone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.84rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>Emergency Hotline: <strong>{hospital.emergencyPhone}</strong></span>
          </div>
        )}

        {/* Departments Tags */}
        {hospital.departments && hospital.departments.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Departments
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {hospital.departments.slice(0, 4).map((dept) => (
                <span
                  key={dept._id || dept}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {typeof dept === 'object' ? dept.name : dept}
                </span>
              ))}
              {hospital.departments.length > 4 && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    padding: '0.2rem 0.4rem'
                  }}
                >
                  +{hospital.departments.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Doctor Count Status */}
        <div
          style={{
            padding: '0.75rem 0',
            borderTop: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
            fontSize: '0.82rem'
          }}
        >
          {hasDoctors ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)' }}>
              <Stethoscope size={15} />
              <span><strong>{hospital.doctorCount}</strong> publicly listed doctors</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              <AlertCircle size={14} color="#f59e0b" />
              <span>Doctor information is currently unavailable. Please contact the hospital.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Link to={`/hospitals/${hospital._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to={`/book?hospitalId=${hospital._id}`}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <Calendar size={14} />
            <span>Book Visit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
