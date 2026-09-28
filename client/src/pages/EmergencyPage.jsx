import React, { useEffect, useState } from 'react';
import { hospitalService } from '../services/api';
import {
  AlertTriangle,
  Phone,
  MapPin,
  ShieldAlert,
  Ambulance,
  Building2,
  ExternalLink,
  Info
} from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

const EmergencyPage = () => {
  const [emergencyHospitals, setEmergencyHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService
      .getHospitals({ status: 'active', emergencyOnly: 'true' })
      .then((res) => {
        if (res.data?.data) {
          setEmergencyHospitals(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching emergency hospitals:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Emergency Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '3rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderColor: 'rgba(239, 68, 68, 0.45)',
          boxShadow: 'var(--color-emergency-glow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.8)'
            }}
          >
            <AlertTriangle size={32} />
          </div>
          <div>
            <span className="badge badge-danger" style={{ marginBottom: '0.25rem' }}>
              Immediate Emergency Services
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#ffffff', fontWeight: 800 }}>
              🚨 EMERGENCY DEPARTMENTS
            </h1>
          </div>
        </div>

        {/* Required Emergency Notice from Section 31 */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #ef4444',
            marginBottom: '1.5rem',
            fontSize: '1.05rem',
            color: '#f8fafc',
            fontWeight: 600,
            lineHeight: 1.6
          }}
        >
          For medical emergencies, contact the nearest emergency department or local emergency services immediately.
        </div>

        {/* Disclaimer per Section 31 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#fca5a5', fontSize: '0.88rem', lineHeight: 1.5 }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Disclaimer:</strong> EASYWAY is an appointment scheduling gateway and does NOT provide medical diagnosis, clinical triage, or treatment advice. In critical or life-threatening situations, dial 108 or your nearest hospital casualty hotline directly.
          </span>
        </div>
      </div>

      {/* Verified Hospital Emergency Hotlines Grid */}
      <section>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ambulance size={22} color="#ef4444" />
            <span>Verified Hospital Emergency Numbers in Vijayawada</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
            Official round-the-clock emergency desk contacts verified by hospital administrative listings.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {emergencyHospitals.map((hosp) => (
              <div
                key={hosp._id}
                className="glass-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge badge-danger">24/7 Casualty</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vijayawada, AP</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {hosp.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    <MapPin size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{hosp.address}</span>
                  </div>

                  {/* Highlighted Emergency Call Box */}
                  <div
                    style={{
                      padding: '1rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Emergency Room Hotline
                    </div>
                    <a
                      href={`tel:${hosp.emergencyPhone || hosp.phone}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginTop: '0.35rem',
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={20} color="#ef4444" />
                      <span>{hosp.emergencyPhone || hosp.phone}</span>
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a
                    href={`tel:${hosp.emergencyPhone || hosp.phone}`}
                    className="btn btn-emergency btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Phone size={14} />
                    <span>Call Emergency</span>
                  </a>
                  {hosp.directionsUrl && (
                    <a
                      href={hosp.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <ExternalLink size={14} />
                      <span>Map</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* National Emergency Helplines Box */}
      <section
        className="glass-card"
        style={{
          padding: '2rem',
          background: 'rgba(10, 15, 26, 0.7)'
        }}
      >
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '1rem' }}>
          Government &amp; National Emergency Helplines (India)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>National Emergency Number</div>
            <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>112</strong>
          </div>
          <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Medical Ambulance (Andhra Pradesh)</div>
            <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>108</strong>
          </div>
          <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Health Advice / Teleconsult</div>
            <strong style={{ fontSize: '1.2rem', color: 'var(--accent-teal)' }}>104</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyPage;
