import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import {
  ShieldCheck,
  Building2,
  Calendar,
  Users,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero */}
      <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
        <Logo size="lg" showTagline={true} />
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#ffffff', fontWeight: 800, marginTop: '1.5rem', marginBottom: '1rem' }}>
          Healthcare Made Easy
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          EASYWAY was founded in Vijayawada, Andhra Pradesh, with a singular mission: to make finding verified doctors and scheduling hospital consultations transparent, effortless, and instantaneous.
        </p>
      </div>

      {/* Core Principles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}
      >
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 245, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '1.25rem' }}>
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.6rem' }}>
            Data Trust &amp; Integrity
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            We only display publicly verified doctors and official hospital information. No artificial doctor rankings, no fabricated claims, and strictly no sponsored bias.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(6, 214, 160, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', marginBottom: '1.25rem' }}>
            <Calendar size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.6rem' }}>
            Real-Time Slot System
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Every doctor consultation window is managed with automated concurrency controls. Once a time slot is booked, it is immediately reserved to prevent overlaps.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '1.25rem' }}>
            <Building2 size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.6rem' }}>
            Deep Regional Coverage
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Covering 19+ top hospitals across Vijayawada, including Aster Ramesh, Manipal, Srikara, Sentini, Aayush, and Andhra Hospitals.
          </p>
        </div>
      </div>

      {/* Leadership & Location */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(0, 245, 212, 0.04) 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}
      >
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>Headquarters &amp; Contact</span>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>
            Vijayawada, Andhra Pradesh, India
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Platform contact: <strong>simhadrirajagmail.com</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/departments" className="btn btn-primary">
            <span>Explore Departments</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            <span>Contact Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
