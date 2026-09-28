import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { configService } from '../services/api';
import { MapPin, Mail, Phone, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const [config, setConfig] = useState({
    location: 'Vijayawada, Andhra Pradesh, India',
    email: 'simhadrirajagmail.com',
    customerCarePhone: 'Coming Soon'
  });

  useEffect(() => {
    configService
      .getConfig()
      .then((res) => {
        if (res.data?.data) {
          setConfig(res.data.data);
        }
      })
      .catch(() => {
        // Fallback to defaults
      });
  }, []);

  return (
    <footer
      style={{
        backgroundColor: '#040609',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Top Footer Banner */}
      <div
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '2.5rem 0',
          background: 'linear-gradient(180deg, rgba(0, 245, 212, 0.02) 0%, transparent 100%)'
        }}
      >
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Healthcare Made Easy in Vijayawada
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
              Connecting patients with top medical specialists and verified hospitals across Andhra Pradesh.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <Link to="/book" className="btn btn-primary btn-sm">
              Book Appointment Now
            </Link>
            <Link to="/emergency" className="btn btn-emergency btn-sm">
              Emergency Numbers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem'
          }}
        >
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Logo size="md" showTagline={true} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A modern, patient-first healthcare appointment platform engineered for speed, transparency, and verified medical care.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>Verified Hospital Records</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
              <li>
                <Link to="/departments" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Departments
                </Link>
              </li>
              <li>
                <Link to="/hospitals" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Hospitals Directory
                </Link>
              </li>
              <li>
                <Link to="/doctors" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Doctors Roster
                </Link>
              </li>
              <li>
                <Link to="/emergency" style={{ color: '#ef4444', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  🚨 Emergency Services
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s' }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Support */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform Location
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <MapPin size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{config.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Mail size={18} color="var(--accent-teal)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${config.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'underline' }}>
                  {config.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <Phone size={18} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
                <span>
                  Customer Care:{' '}
                  <strong style={{ color: '#ffffff' }}>
                    {config.customerCarePhone === 'Coming Soon' ? 'Coming Soon' : config.customerCarePhone}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Administration
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Authorized healthcare administration and hospital coordination access portal.
            </p>
            <Link to="/admin/login" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <span>Admin Portal Login</span>
              <ArrowUpRight size={14} style={{ marginLeft: 'auto' }} />
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '3rem',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            &copy; 2026 EASYWAY. All rights reserved. &bull; Healthcare Made Easy
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Serving Vijayawada &amp; Andhra Pradesh with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
