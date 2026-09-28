import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { departmentService } from '../services/api';
import HospitalCard from '../components/HospitalCard';
import DoctorCard from '../components/DoctorCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Building2, Stethoscope, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'hospitals'

  useEffect(() => {
    departmentService.getById(id)
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '40px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '2rem' }} />
        <div className="doctors-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.department) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <EmptyState
          title="Department Not Found"
          description="The requested medical department does not exist in our system."
          actionLabel="Back to Departments"
          actionLink="/departments"
        />
      </div>
    );
  }

  const { department, hospitals, doctors } = data;

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <Link to="/departments" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <ArrowLeft size={14} />
        <span>All Departments</span>
      </Link>

      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          marginBottom: '2.5rem',
          borderLeft: '4px solid var(--primary-cyan)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '750px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Specialty Department
            </span>
            <h1 style={{ fontSize: '2.6rem', margin: '0.3rem 0 0.8rem' }}>{department.name}</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {department.description}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                <Building2 size={18} color="var(--primary-cyan)" />
                <strong>{hospitals.length}</strong> Affiliated Hospitals in Vijayawada
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                <Stethoscope size={18} color="var(--accent-teal)" />
                <strong>{doctors.length}</strong> Verified Specialists
              </div>
            </div>
          </div>

          <Link
            to={`/book-appointment?departmentId=${department._id}`}
            className="btn btn-primary btn-lg"
          >
            <Calendar size={18} />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('doctors')}
          style={{
            padding: '0.85rem 1.4rem',
            fontWeight: 600,
            fontSize: '1rem',
            color: activeTab === 'doctors' ? 'var(--primary-cyan)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'doctors' ? '2px solid var(--primary-cyan)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Stethoscope size={18} />
          <span>Doctors ({doctors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hospitals')}
          style={{
            padding: '0.85rem 1.4rem',
            fontWeight: 600,
            fontSize: '1rem',
            color: activeTab === 'hospitals' ? 'var(--primary-cyan)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'hospitals' ? '2px solid var(--primary-cyan)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Building2 size={18} />
          <span>Hospitals ({hospitals.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'doctors' ? (
        doctors.length === 0 ? (
          <EmptyState
            title="Doctor Information Unavailable"
            description="Doctor information is currently unavailable. Please contact the hospital."
          />
        ) : (
          <div className="doctors-grid">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )
      ) : (
        hospitals.length === 0 ? (
          <EmptyState
            title="No Hospitals Listed"
            description="No hospitals currently listed for this specific department in Vijayawada."
          />
        ) : (
          <div className="hospitals-grid">
            {hospitals.map((hosp) => (
              <HospitalCard key={hosp._id} hospital={hosp} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default DepartmentDetailsPage;
