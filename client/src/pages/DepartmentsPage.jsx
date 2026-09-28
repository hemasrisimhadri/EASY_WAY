import React, { useEffect, useState } from 'react';
import { departmentService } from '../services/api';
import DepartmentCard from '../components/DepartmentCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Layers } from 'lucide-react';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentService
      .getDepartments({ status: 'active' })
      .then((res) => {
        if (res.data?.data) {
          setDepartments(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching departments:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem' }}>
      <div className="section-header">
        <span className="section-tag">
          <Layers size={16} />
          Specialized Disciplines
        </span>
        <h1 className="section-title">Healthcare Departments</h1>
        <p className="section-desc">
          Browse specialized medical departments in Vijayawada. Select any department to explore affiliated hospitals and consult verified doctors.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={8} />
      ) : departments.length === 0 ? (
        <EmptyState
          title="No Departments Available"
          description="Medical departments are currently being updated."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {departments.map((dept) => (
            <DepartmentCard key={dept._id} department={dept} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
