import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  Menu,
  X,
  Calendar,
  User,
  Shield,
  LogOut,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.92rem',
    fontWeight: 600,
    color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
    padding: '0.4rem 0.6rem',
    borderRadius: 'var(--radius-sm)'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Logo */}
        <Logo size="md" showTagline={true} />

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.25rem'
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/departments" style={navLinkStyle}>Departments</NavLink>
          <NavLink to="/hospitals" style={navLinkStyle}>Hospitals</NavLink>
          <NavLink to="/doctors" style={navLinkStyle}>Doctors</NavLink>
          <NavLink
            to="/emergency"
            style={({ isActive }) => ({
              ...navLinkStyle({ isActive }),
              color: isActive ? '#f87171' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 700
            })}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 8px #ef4444'
              }}
            />
            Emergency
          </NavLink>
          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.9rem' }} className="desktop-nav">
          <Link to="/book" className="btn btn-primary btn-sm">
            <Calendar size={16} />
            <span>Book Appointment</span>
          </Link>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.5rem' }}
                aria-expanded={userDropdownOpen}
              >
                {isAdmin ? <Shield size={16} color="var(--accent-cyan)" /> : <User size={16} color="var(--accent-teal)" />}
                <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    minWidth: '210px',
                    background: '#0d131f',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
                    padding: '0.5rem',
                    zIndex: 200,
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-emerald'}`} style={{ marginTop: '0.4rem' }}>
                      {isAdmin ? 'Admin' : 'Patient'}
                    </span>
                  </div>

                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Shield size={16} color="var(--accent-cyan)" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/patient/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={16} />
                        Patient Dashboard
                      </Link>
                      <Link
                        to="/patient/appointments"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Calendar size={16} />
                        My Appointments
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.8rem',
                      fontSize: '0.88rem',
                      color: 'var(--color-emergency)',
                      background: 'none',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '0.3rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-cyan btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#f8fafc',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#070a12',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Home</NavLink>
          <NavLink to="/departments" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Departments</NavLink>
          <NavLink to="/hospitals" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Hospitals</NavLink>
          <NavLink to="/doctors" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Doctors</NavLink>
          <NavLink to="/emergency" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>🚨 Emergency Services</NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>About EasyWay</NavLink>
          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>Contact</NavLink>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

          <Link to="/book" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
            <Calendar size={18} />
            <span>Book Appointment</span>
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Signed in as: {user?.name}</div>
              {isAdmin ? (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/patient/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                    Patient Dashboard
                  </Link>
                  <Link to="/patient/appointments" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                    My Appointments
                  </Link>
                </>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger btn-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline-cyan">
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive media styling for desktop vs mobile toggle */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
