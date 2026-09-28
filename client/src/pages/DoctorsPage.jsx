import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorService, departmentService, hospitalService } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Stethoscope, Filter, Building2, Layers } from 'lucide-react';

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDepartment = searchParams.get('department') || '';
  const selectedHospital = searchParams.get('hospital') || '';

  useEffect(() => {
    Promise.all([
      departmentService.getDepartments({ status: 'active' }),
      hospitalService.getHospitals({ status: 'active' })
    ])
      .then(([deptRes, hospRes]) => {
        if (deptRes.data?.data) setDepartments(deptRes.data.data);
        if (hospRes.data?.data) setHospitals(hospRes.data.data);
      })
      .catch((err) => console.error('Error loading filter options:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { status: 'active' };
    if (selectedDepartment) params.department = selectedDepartment;
    if (selectedHospital) params.hospital = selectedHospital;

    doctorService
      .getDoctors(params)
      .then((res) => {
        if (res.data?.data) {
          setDoctors(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching doctors:', err))
      .finally(() => setLoading(false));
  }, [selectedDepartment, selectedHospital]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <span className="section-tag">
          <Stethoscope size={16} />
          Publicly Listed Practitioners
        </span>
        <h1 className="section-title">Doctors in Vijayawada</h1>
        <p className="section-desc">
          Browse verified doctors and medical specialists across top Vijayawada hospitals. Select by department or hospital affiliation.
        </p>
      </div>

      {/* Filter Bar (NO SEARCH BAR) */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem 1.75rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          background: 'rgba(13, 19, 31, 0.85)'
        }}
      >
        {/* Department Filter Dropdown */}
        <div>
          <label className="form-label">
            <Layers size={15} color="var(--accent-cyan)" />
            <span>Filter by Department</span>
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="form-select"
          >
            <option value="">All Medical Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hospital Filter Dropdown */}
        <div>
          <label className="form-label">
            <Building2 size={15} color="var(--accent-teal)" />
            <span>Filter by Hospital</span>
          </label>
          <select
            value={selectedHospital}
            onChange={(e) => handleFilterChange('hospital', e.target.value)}
            className="form-select"
          >
            <option value="">All Affiliated Hospitals</option>
            {hospitals.map((hosp) => (
              <option key={hosp._id} value={hosp._id}>
                {hosp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        <span>
          Showing <strong>{doctors.length}</strong> publicly listed doctors
        </span>
        {(selectedDepartment || selectedHospital) && (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              textDecoration: 'underline'
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No Doctors Found for Selected Filters"
          description="In compliance with healthcare accuracy standards, unverified doctor profiles are omitted. Try selecting a different department or hospital."
          actionText="Clear Filters"
          onAction={() => setSearchParams({})}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
