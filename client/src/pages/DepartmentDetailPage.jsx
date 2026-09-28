import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { departmentService } from '../services/api';
import HospitalCard from '../components/HospitalCard';
import DoctorCard from '../components/DoctorCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Calendar, Building2, Stethoscope, ArrowLeft, ShieldCheck } from 'lucide-react';

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'hospitals', 'doctors'

  useEffect(() => {
    departmentService
      .getDepartmentById(id)
      .then((res) => {
        if (res.data?.data) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load department details.');
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
          title="Department Not Found"
          description={error || 'The requested department could not be located.'}
          actionText="Back to Departments"
          actionLink="/departments"
        />
      </div>
    );
  }

  const { department, hospitals = [], doctors = [] } = data;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Back button */}
      <div>
        <Link
          to="/departments"
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
          <span>Back to Departments</span>
        </Link>
      </div>

      {/* Hero Header for Department */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(0, 245, 212, 0.04) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>Medical Department</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#ffffff', fontWeight: 800 }}>
              {department.name}
            </h1>
          </div>
          <Link
            to={`/book?departmentId=${department._id}`}
            className="btn btn-primary btn-lg"
          >
            <Calendar size={18} />
            <span>Book Appointment in {department.name}</span>
          </Link>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
          {department.description}
        </p>

        {/* Quick Stats Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} color="var(--accent-teal)" />
            <span><strong style={{ color: '#ffffff' }}>{hospitals.length}</strong> Partner Hospitals</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={18} color="var(--accent-blue)" />
            <span><strong style={{ color: '#ffffff' }}>{doctors.length}</strong> Publicly Listed Doctors</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--accent-cyan)" />
            <span>Direct In-Clinic Consultation</span>
          </div>
        </div>
      </div>

      {/* Tabs / Filter Filter Toggle */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Overview ({hospitals.length} Hospitals, {doctors.length} Doctors)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hospitals')}
          className={`btn btn-sm ${activeTab === 'hospitals' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Hospitals Providing {department.name} ({hospitals.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`btn btn-sm ${activeTab === 'doctors' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Specialist Doctors ({doctors.length})
        </button>
      </div>

      {/* Hospitals providing this department */}
      {(activeTab === 'all' || activeTab === 'hospitals') && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--accent-teal)" />
              <span>Hospitals Providing {department.name} in Vijayawada</span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {hospitals.length} Hospitals
            </span>
          </div>

          {hospitals.length === 0 ? (
            <div
              className="glass-card"
              style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              No hospitals currently listed for this department.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {hospitals.map((hosp) => (
                <HospitalCard key={hosp._id} hospital={hosp} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Doctors roster for this department */}
      {(activeTab === 'all' || activeTab === 'doctors') && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={20} color="var(--accent-blue)" />
              <span>Specialist Doctors in {department.name}</span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {doctors.length} Doctors
            </span>
          </div>

          {doctors.length === 0 ? (
            <div
              className="glass-card"
              style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              <p style={{ margin: 0 }}>
                Doctor information is currently unavailable for this specific department. Please contact the affiliated hospitals directly for consultation schedules.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DepartmentDetailPage;
