import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Network,
  CalendarCheck,
  Users,
  ExternalLink
} from 'lucide-react';

const AdminSidebar = () => {
  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1.15rem',
    borderRadius: 'var(--radius-md)',
    color: isActive ? '#05070a' : 'var(--text-secondary)',
    background: isActive ? 'var(--accent-gradient)' : 'transparent',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.92rem',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    boxShadow: isActive ? 'var(--accent-glow)' : 'none'
  });

  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        backgroundColor: '#0a0e17',
        borderRight: '1px solid var(--border-subtle)',
        minHeight: 'calc(100vh - 76px)',
        padding: '1.75rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '2rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ padding: '0 0.75rem 1rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            Admin Console
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
            EASYWAY Ops
          </div>
        </div>

        <NavLink to="/admin/dashboard" style={linkStyle}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/hospitals" style={linkStyle}>
          <Building2 size={18} />
          <span>Manage Hospitals</span>
        </NavLink>

        <NavLink to="/admin/departments" style={linkStyle}>
          <Network size={18} />
          <span>Manage Departments</span>
        </NavLink>

        <NavLink to="/admin/doctors" style={linkStyle}>
          <Stethoscope size={18} />
          <span>Manage Doctors</span>
        </NavLink>

        <NavLink to="/admin/appointments" style={linkStyle}>
          <CalendarCheck size={18} />
          <span>All Appointments</span>
        </NavLink>

        <NavLink to="/admin/patients" style={linkStyle}>
          <Users size={18} />
          <span>Manage Patients</span>
        </NavLink>
      </div>

      <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
          Quick Action
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: 'var(--accent-cyan)',
            textDecoration: 'none'
          }}
        >
          <span>View Public Site</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
