import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hospitalService, departmentService } from '../services/api';
import HospitalCard from '../components/HospitalCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Building2, Filter, AlertTriangle, MapPin, Check } from 'lucide-react';

const HospitalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active filters (NO SEARCH BAR!)
  const selectedDepartment = searchParams.get('department') || '';
  const emergencyOnly = searchParams.get('emergencyOnly') === 'true';

  useEffect(() => {
    departmentService
      .getDepartments({ status: 'active' })
      .then((res) => {
        if (res.data?.data) {
          setDepartments(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching departments:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { status: 'active' };
    if (selectedDepartment) params.department = selectedDepartment;
    if (emergencyOnly) params.emergencyOnly = 'true';

    hospitalService
      .getHospitals(params)
      .then((res) => {
        if (res.data?.data) {
          setHospitals(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching hospitals:', err))
      .finally(() => setLoading(false));
  }, [selectedDepartment, emergencyOnly]);

  const handleDepartmentFilter = (deptId) => {
    const newParams = new URLSearchParams(searchParams);
    if (deptId === selectedDepartment) {
      newParams.delete('department');
    } else if (deptId) {
      newParams.set('department', deptId);
    } else {
      newParams.delete('department');
    }
    setSearchParams(newParams);
  };

  const handleEmergencyToggle = () => {
    const newParams = new URLSearchParams(searchParams);
    if (emergencyOnly) {
      newParams.delete('emergencyOnly');
    } else {
      newParams.set('emergencyOnly', 'true');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-tag">
          <Building2 size={16} />
          Directory &amp; Facilities
        </span>
        <h1 className="section-title">Hospitals in Vijayawada</h1>
        <p className="section-desc">
          Browse verified hospitals and healthcare centers across Vijayawada, Andhra Pradesh. Filter by specialized medical department or emergency capabilities.
        </p>
      </div>

      {/* Filter Controls (STRICTLY NO SEARCH BAR) */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'rgba(13, 19, 31, 0.85)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
            <Filter size={18} color="var(--accent-cyan)" />
            <span>Category &amp; Department Filters</span>
          </div>

          {/* Emergency Quick Filter Button */}
          <button
            type="button"
            onClick={handleEmergencyToggle}
            className={`btn btn-sm ${emergencyOnly ? 'btn-danger' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <AlertTriangle size={15} />
            <span>{emergencyOnly ? 'Showing 24/7 Emergency Only' : 'Filter 24/7 Emergency Only'}</span>
            {emergencyOnly && <Check size={14} />}
          </button>
        </div>

        {/* Department Pills Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleDepartmentFilter('')}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-main)',
              cursor: 'pointer',
              border: '1px solid',
              transition: 'all 0.2s ease',
              background: !selectedDepartment ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: !selectedDepartment ? 'transparent' : 'var(--border-subtle)',
              color: !selectedDepartment ? '#03080e' : 'var(--text-secondary)'
            }}
          >
            All Departments ({departments.length})
          </button>

          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept._id;
            return (
              <button
                key={dept._id}
                type="button"
                onClick={() => handleDepartmentFilter(dept._id)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-main)',
                  cursor: 'pointer',
                  border: '1px solid',
                  transition: 'all 0.2s ease',
                  background: isSelected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: isSelected ? 'transparent' : 'var(--border-subtle)',
                  color: isSelected ? '#03080e' : 'var(--text-secondary)'
                }}
              >
                {dept.name}
              </button>
            );
          })}
        </div>

        {/* Location & Count indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} color="var(--accent-teal)" />
            <span>Region: <strong>Vijayawada, Andhra Pradesh, India</strong></span>
          </div>
          <div>
            Showing <strong>{hospitals.length}</strong> verified hospitals
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : hospitals.length === 0 ? (
        <EmptyState
          title="No Hospitals Found for Selected Filters"
          description="Try adjusting your department or emergency filter to see available healthcare facilities."
          actionText="Clear Filters"
          onAction={() => setSearchParams({})}
        />
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
    </div>
  );
};

export default HospitalsPage;
