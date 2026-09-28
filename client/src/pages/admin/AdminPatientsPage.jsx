import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminService } from '../../services/api';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import { Users, Calendar, Mail, Phone } from 'lucide-react';

const AdminPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getPatients()
      .then((res) => {
        if (res.success) setPatients(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Registered Patients</h1>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Patient directory and consultation booking volume.</p>
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Appointments Count</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient._id}>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        {patient.name}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Mail size={13} color="var(--primary-cyan)" />
                          {patient.email}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={13} color="var(--accent-teal)" />
                          {patient.phone}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--accent-green)' }}>
                          <Calendar size={14} />
                          {patient.appointmentCount || 0} Bookings
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      No registered patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPatientsPage;
