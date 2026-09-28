import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Wind,
  Stethoscope,
  Activity,
  ShieldAlert,
  Flame,
  ArrowRight,
  Building2,
  Users
} from 'lucide-react';

const iconMap = {
  Cardiology: <Heart size={28} color="#00f5d4" />,
  Neurology: <Brain size={28} color="#00b4d8" />,
  Orthopaedics: <Bone size={28} color="#06d6a0" />,
  Pediatrics: <Users size={28} color="#f59e0b" />,
  Ophthalmology: <Eye size={28} color="#00f5d4" />,
  'Obstetrics & Gynaecology': <Heart size={28} color="#ec4899" />,
  Pulmonology: <Wind size={28} color="#38bdf8" />,
  'General Medicine': <Stethoscope size={28} color="#06d6a0" />,
  Gastroenterology: <Activity size={28} color="#a855f7" />,
  Nephrology: <Activity size={28} color="#00b4d8" />,
  Oncology: <ShieldAlert size={28} color="#fb7185" />,
  ENT: <Activity size={28} color="#eab308" />,
  Emergency: <Flame size={28} color="#ef4444" />
};

const DepartmentCard = ({ department }) => {
  const icon = iconMap[department.name] || <Activity size={28} color="#00f5d4" />;

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
        {/* Top Icon and Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 245, 212, 0.08)',
              border: '1px solid rgba(0, 245, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 245, 212, 0.15)'
            }}
          >
            {icon}
          </div>
          {department.name === 'Emergency' && (
            <span className="badge badge-danger">24/7 Available</span>
          )}
        </div>

        {/* Department Name */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
          {department.name}
        </h3>

        {/* Department Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {department.description}
        </p>
      </div>

      <div>
        {/* Hospital & Doctor Count Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 0',
            borderTop: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building2 size={15} color="var(--accent-teal)" />
            <span>{department.hospitalCount || 0} Hospitals</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={15} color="var(--accent-blue)" />
            <span>{department.doctorCount || 0} Doctors</span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          to={`/departments/${department._id}`}
          className="btn btn-outline-cyan btn-sm"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span>Explore Department</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default DepartmentCard;
