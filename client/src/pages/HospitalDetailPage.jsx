import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hospitalService } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  MapPin,
  Phone,
  AlertCircle,
  Calendar,
  Compass,
  Globe,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Stethoscope,
  ExternalLink
} from 'lucide-react';

const HospitalDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    hospitalService
      .getHospitalById(id)
      .then((res) => {
        if (res.data?.data) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load hospital details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <EmptyState
          title="Hospital Not Found"
          description={error || 'The requested hospital facility could not be located.'}
          actionText="Back to Hospitals"
          actionLink="/hospitals"
        />
      </div>
    );
  }

  const { hospital, doctors = [] } = data;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Back button */}
      <div>
        <Link
          to="/hospitals"
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
          <span>Back to Hospitals</span>
        </Link>
      </div>

      {/* Main Hospital Header Card */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.03) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.25)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              {hospital.emergencyAvailable ? (
                <span className="badge badge-danger">24/7 Emergency Verified</span>
              ) : (
                <span className="badge badge-cyan">Speciality Hospital</span>
              )}
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} />
                Verified Record
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>
              {hospital.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <MapPin size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                {hospital.address}, {hospital.city || 'Vijayawada'}, {hospital.state || 'Andhra Pradesh'}
                {hospital.pincode ? ` - ${hospital.pincode}` : ''}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to={`/book?hospitalId=${hospital._id}`} className="btn btn-primary btn-lg">
              <Calendar size={18} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* Contact & Map Directions Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {/* Main phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 245, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
              <Phone size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reception Phone</div>
              <a href={`tel:${hospital.phone}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {hospital.phone}
              </a>
            </div>
          </div>

          {/* Emergency Phone */}
          {hospital.emergencyPhone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <AlertCircle size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#f87171', textTransform: 'uppercase' }}>Emergency Hotline</div>
                <a href={`tel:${hospital.emergencyPhone}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>
                  {hospital.emergencyPhone}
                </a>
              </div>
            </div>
          )}

          {/* Directions link */}
          {hospital.directionsUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                <Compass size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Navigation</div>
                <a
                  href={hospital.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.92rem', color: 'var(--accent-cyan)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                >
                  <span>Get Directions</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ) : null}

          {/* Website if available */}
          {hospital.website ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <Globe size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Official Website</div>
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.92rem', color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                >
                  <span>Visit Website</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ) : null}
        </div>

        {/* Verification Source footer note */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          <span>Information Source: <strong>{hospital.source || 'Official hospital website'}</strong></span>
          <span>Last Verified: <strong>{hospital.lastVerified || '2026-09-28'}</strong></span>
        </div>
      </div>

      {/* Departments Available at this Hospital */}
      <section>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} color="var(--accent-cyan)" />
          <span>Departments at {hospital.name}</span>
        </h2>
        {hospital.departments && hospital.departments.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {hospital.departments.map((dept) => (
              <Link
                key={dept._id || dept}
                to={`/departments/${dept._id || dept}`}
                className="glass-card"
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <span>{typeof dept === 'object' ? dept.name : dept}</span>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>&rarr;</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
            Department listings are currently being updated for this hospital.
          </div>
        )}
      </section>

      {/* Doctors at this Hospital */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={20} color="var(--accent-teal)" />
            <span>Doctors at {hospital.name}</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {doctors.length} Publicly Listed
          </span>
        </div>

        {doctors.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <AlertCircle size={32} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              Doctor information is currently unavailable. Please contact the hospital.
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '540px', margin: 0 }}>
              In accordance with strict healthcare data verification standards, unverified practitioner rosters are not displayed. Please call the hospital reception at {hospital.phone} for doctor schedules.
            </p>
            <a href={`tel:${hospital.phone}`} className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
              <Phone size={14} />
              <span>Call Reception ({hospital.phone})</span>
            </a>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={{ ...doctor, hospital }} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HospitalDetailPage;
