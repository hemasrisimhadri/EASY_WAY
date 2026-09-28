import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { departmentService, hospitalService } from '../services/api';
import DepartmentCard from '../components/DepartmentCard';
import HospitalCard from '../components/HospitalCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  Calendar,
  Grid,
  ShieldCheck,
  Clock,
  HeartHandshake,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, hospRes] = await Promise.all([
          departmentService.getDepartments({ status: 'active' }),
          hospitalService.getHospitals({ status: 'active' })
        ]);

        if (deptRes.data?.data) {
          setDepartments(deptRes.data.data);
        }
        if (hospRes.data?.data) {
          setHospitals(hospRes.data.data.slice(0, 6)); // Top featured hospitals
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 4rem 0',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Luminous Tag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '999px',
                background: 'rgba(0, 245, 212, 0.08)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                boxShadow: '0 0 20px rgba(0, 245, 212, 0.2)',
                marginBottom: '1.75rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)'
              }}
            >
              <Sparkles size={16} />
              <span>Vijayawada's Premier Healthcare Platform</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                color: '#ffffff'
              }}
            >
              EASYWAY
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #00F5D4 0%, #00B4D8 50%, #06D6A0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                Healthcare Made Easy
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem auto'
              }}
            >
              Find the right healthcare service and book appointments with ease.
              Connecting patients with verified hospitals and doctors across Vijayawada, Andhra Pradesh.
            </p>

            {/* Primary Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <Link to="/departments" className="btn btn-primary btn-lg">
                <Grid size={18} />
                <span>Explore Departments</span>
              </Link>
              <Link to="/book" className="btn btn-secondary btn-lg">
                <Calendar size={18} />
                <span>Book Appointment</span>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '3.5rem',
                fontSize: '0.88rem',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-teal)" />
                <span>Verified Public Doctors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" />
                <span>19+ Vijayawada Hospitals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-blue)" />
                <span>Real-Time Slot Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Fast Banner */}
      <section className="container">
        <div
          className="glass-card"
          style={{
            padding: '1.75rem 2.25rem',
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderColor: 'rgba(239, 68, 68, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: 'var(--color-emergency-glow)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                🚨 Immediate Medical Emergency?
              </h3>
              <p style={{ color: '#fca5a5', fontSize: '0.9rem', margin: 0 }}>
                Instant access to 24/7 verified emergency room hotlines across Vijayawada hospitals.
              </p>
            </div>
          </div>
          <Link to="/emergency" className="btn btn-emergency">
            <span>View Emergency Numbers</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Healthcare Services / Departments Section */}
      <section className="container">
        <div className="section-header">
          <span className="section-tag">
            <HeartHandshake size={16} />
            Healthcare Services
          </span>
          <h2 className="section-title">Explore Medical Departments</h2>
          <p className="section-desc">
            Discover specialized medical care through verified departments. Choose your category to find affiliated hospitals and consult specialized doctors.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {departments.slice(0, 8).map((dept) => (
              <DepartmentCard key={dept._id} department={dept} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/departments" className="btn btn-outline-cyan">
            <span>View All {departments.length} Departments</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Featured Hospitals Section (NO SEARCH BAR - department & filter discovery) */}
      <section className="container">
        <div className="section-header">
          <span className="section-tag">
            <MapPin size={16} />
            Hospital Directory
          </span>
          <h2 className="section-title">Leading Hospitals in Vijayawada</h2>
          <p className="section-desc">
            Explore verified multi-speciality and super-speciality healthcare facilities. Direct appointment booking with no intermediary delays.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital._id} hospital={hospital} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/hospitals" className="btn btn-secondary">
            <span>Explore All Hospitals &amp; Facilities</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* How Appointment Booking Works */}
      <section
        style={{
          background: 'rgba(10, 15, 26, 0.6)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '5rem 0'
        }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Clock size={16} />
              Simple 4-Step Process
            </span>
            <h2 className="section-title">How EasyWay Works</h2>
            <p className="section-desc">
              From choosing your specialty to confirmed slot allocation in less than two minutes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem'
            }}
          >
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-display)'
                }}
              >
                01
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Select Department</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Browse medical departments such as Cardiology, Orthopaedics, Neurology, or Pediatrics.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--accent-blue)',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-display)'
                }}
              >
                02
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Pick Hospital &amp; Doctor</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Review verified hospitals and select from publicly listed medical specialists.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--accent-teal)',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-display)'
                }}
              >
                03
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Choose Date &amp; Slot</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                View real-time slot availability. Select an open consultation window without overlapping.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#c084fc',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-display)'
                }}
              >
                04
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>Instant Confirmation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Receive your unique Appointment ID (e.g. EASY-2026-XXXXX) stored securely in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
