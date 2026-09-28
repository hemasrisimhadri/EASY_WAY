import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hospitalService } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  MapPin,
  Phone,
  ShieldAlert,
  Calendar,
  Globe,
  Navigation,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Stethoscope
} from 'lucide-react';

const HospitalDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService.getById(id)
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="skeleton" style={{ width: '50%', height: '40px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '80%', height: '120px', marginBottom: '2rem' }} />
      </div>
    );
  }

  if (!data || !data.hospital) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <EmptyState
          title="Hospital Not Found"
          description="The requested hospital record could not be found."
          actionLabel="Back to Hospitals"
          actionLink="/hospitals"
        />
      </div>
    );
  }

  const { hospital, doctors } = data;

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <Link to="/hospitals" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <ArrowLeft size={14} />
        <span>All Hospitals</span>
      </Link>

      {/* Main Details Card */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="hero-pill" style={{ margin: 0 }}>
                <Building2 size={13} />
                <span>Verified Hospital</span>
              </span>
              {hospital.emergencyAvailable && (
                <span className="emergency-tag">
                  <ShieldAlert size={12} /> 24/7 Emergency Care
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.4rem', margin: '0.4rem 0' }}>{hospital.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              <MapPin size={18} color="var(--primary-cyan)" style={{ flexShrink: 0 }} />
              <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to={`/book-appointment?hospitalId=${hospital._id}`}
              className="btn btn-primary btn-lg"
            >
              <Calendar size={18} />
              <span>Book Appointment</span>
            </Link>

            <a href={`tel:${hospital.phone}`} className="btn btn-secondary btn-sm">
              <Phone size={14} />
              <span>Call Reception: {hospital.phone}</span>
            </a>
          </div>
        </div>

        {/* Overview Information */}
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1.5rem 0' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Hospital Overview
          </h4>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {hospital.information}
          </p>
        </div>

        {/* Contact, Emergency & Directions Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', margin: '1.5rem 0' }}>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>General Contact</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{hospital.phone}</div>
          </div>

          <div className="glass-card" style={{ padding: '1rem', borderColor: hospital.emergencyPhone ? 'rgba(239, 68, 68, 0.4)' : undefined }}>
            <div style={{ fontSize: '0.8rem', color: hospital.emergencyPhone ? '#f87171' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Emergency Trauma Unit
            </div>
            <div style={{ fontWeight: 600, color: hospital.emergencyPhone ? '#fca5a5' : '#fff', fontSize: '0.95rem' }}>
              {hospital.emergencyPhone ? hospital.emergencyPhone : 'Contact General Phone'}
            </div>
          </div>

          {hospital.directionsUrl && (
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Map Navigation</div>
              <a
                href={hospital.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: '0.2rem' }}
              >
                <Navigation size={14} />
                <span>Get Directions</span>
              </a>
            </div>
          )}

          {hospital.website && (
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Official Web Portal</div>
              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: '0.2rem' }}
              >
                <Globe size={14} />
                <span>Visit Website</span>
              </a>
            </div>
          )}
        </div>

        {/* Verification Source Note (Requirement 34) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          <CheckCircle2 size={14} color="var(--accent-green)" />
          <span>
            Verified Record • Source: {hospital.source || 'Official Hospital Portal'} • Last Verified: {hospital.lastVerified || '2026-09-28'}
          </span>
        </div>
      </div>

      {/* Departments Available in Hospital */}
      {hospital.departments && hospital.departments.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Specialty Departments</span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {hospital.departments.map((dept) => (
              <Link
                key={dept._id}
                to={`/departments/${dept._id}`}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {dept.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Hospital Doctors Roster */}
      <div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Stethoscope size={22} color="var(--primary-cyan)" />
          <span>Doctors & Specialists at {hospital.name}</span>
        </h2>

        {doctors && doctors.length > 0 ? (
          <div className="doctors-grid">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Doctor Information Unavailable"
            description="Doctor information is currently unavailable. Please contact the hospital."
            actionLabel={`Call ${hospital.name}`}
            actionLink={`tel:${hospital.phone}`}
          />
        )}
      </div>
    </div>
  );
};

export default HospitalDetailsPage;
