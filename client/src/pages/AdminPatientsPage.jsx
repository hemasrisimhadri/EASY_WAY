import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { adminService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Users, Mail, Phone, CalendarCheck } from 'lucide-react';

const AdminPatientsPage = () => {
  const { showToast } = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getPatients()
      .then((res) => {
        if (res.data?.data) {
          setPatients(res.data.data);
        }
      })
      .catch((err) => {
        showToast(err.message || 'Failed to load patients list.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 76px)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
              Patient Directory
            </span>
            <h1 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>
              Registered Patients ({patients.length})
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Accounts registered for EasyWay Healthcare appointment scheduling.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading patients...
              </div>
            ) : patients.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No patients registered yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Patient Name</th>
                    <th style={{ padding: '0.75rem' }}>Email Address</th>
                    <th style={{ padding: '0.75rem' }}>Contact Phone</th>
                    <th style={{ padding: '0.75rem' }}>Total Bookings</th>
                    <th style={{ padding: '0.75rem' }}>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-cyan)' }}>
                        {p.email}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                        {p.phone}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-emerald">
                          {p.appointmentCount || 0} Bookings
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPatientsPage;
