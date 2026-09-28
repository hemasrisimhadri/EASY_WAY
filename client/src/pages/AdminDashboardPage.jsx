import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import DashboardCard from '../components/DashboardCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { adminService } from '../services/api';
import {
  Building2,
  Stethoscope,
  Network,
  Users,
  CalendarCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getMetrics()
      .then((res) => {
        if (res.data?.data) {
          setMetrics(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching admin metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 76px)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
                System Administration
              </span>
              <h1 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 800 }}>
                Platform Overview
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                Real-time operational metrics for EASYWAY Healthcare in Vijayawada.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/admin/hospitals" className="btn btn-secondary btn-sm">
                <Building2 size={15} />
                <span>Manage Hospitals</span>
              </Link>
              <Link to="/admin/appointments" className="btn btn-primary btn-sm">
                <CalendarCheck size={15} />
                <span>View Appointments</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem'
              }}
            >
              <DashboardCard
                title="Total Hospitals"
                value={metrics?.totalHospitals || 0}
                subtitle="Verified Vijayawada clinics"
                icon={<Building2 size={20} />}
                color="cyan"
              />
              <DashboardCard
                title="Total Doctors"
                value={metrics?.totalDoctors || 0}
                subtitle="Active verified specialists"
                icon={<Stethoscope size={20} />}
                color="teal"
              />
              <DashboardCard
                title="Total Departments"
                value={metrics?.totalDepartments || 0}
                subtitle="Medical disciplines"
                icon={<Network size={20} />}
                color="blue"
              />
              <DashboardCard
                title="Total Patients"
                value={metrics?.totalPatients || 0}
                subtitle="Registered accounts"
                icon={<Users size={20} />}
                color="purple"
              />
              <DashboardCard
                title="Total Appointments"
                value={metrics?.totalAppointments || 0}
                subtitle="All-time bookings"
                icon={<CalendarCheck size={20} />}
                color="orange"
              />
              <DashboardCard
                title="Today's Appointments"
                value={metrics?.todayAppointments || 0}
                subtitle="Booked for today"
                icon={<Clock size={20} />}
                color="red"
              />
            </div>
          )}

          {/* Appointment Status Breakdown */}
          {metrics && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem' }}>
                Appointment Status Distribution
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                <div style={{ padding: '1.25rem', background: 'rgba(6, 214, 160, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 214, 160, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', textTransform: 'uppercase' }}>Confirmed</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                    {metrics.statusStats?.confirmed || 0}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-warning)', textTransform: 'uppercase' }}>Pending</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                    {metrics.statusStats?.pending || 0}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(0, 180, 216, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 180, 216, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Completed</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                    {metrics.statusStats?.completed || 0}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-emergency)', textTransform: 'uppercase' }}>Cancelled</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                    {metrics.statusStats?.cancelled || 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Appointments Table */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Recent Bookings
              </h2>
              <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
                <span>View All Appointments</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading recent bookings...
              </div>
            ) : !metrics?.recentAppointments || metrics.recentAppointments.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No appointments have been booked yet.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>ID</th>
                      <th style={{ padding: '0.75rem' }}>Patient</th>
                      <th style={{ padding: '0.75rem' }}>Hospital</th>
                      <th style={{ padding: '0.75rem' }}>Doctor</th>
                      <th style={{ padding: '0.75rem' }}>Slot</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentAppointments.map((app) => (
                      <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {app.appointmentId}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#ffffff' }}>
                          {app.patientName}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                          {app.hospital?.name}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--accent-teal)' }}>
                          {app.doctor?.name}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                          {app.date} {app.time}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span
                            className={`badge ${
                              app.status === 'Confirmed'
                                ? 'badge-emerald'
                                : app.status === 'Cancelled'
                                ? 'badge-danger'
                                : 'badge-warning'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
