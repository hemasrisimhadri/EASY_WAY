import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import DashboardCard from '../../components/DashboardCard';
import { adminService } from '../../services/api';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Building2,
  Stethoscope,
  FolderHeart,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  Eye
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getMetrics()
      .then((res) => {
        if (res.success) setMetrics(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
              System Overview
            </span>
            <h1 style={{ fontSize: '2.2rem', margin: '0.2rem 0' }}>Dashboard Overview</h1>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Live healthcare operations for Vijayawada, Andhra Pradesh.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/hospitals" className="btn btn-secondary btn-sm">
              <Building2 size={16} /> Add Hospital
            </Link>
            <Link to="/admin/doctors" className="btn btn-primary btn-sm">
              <Stethoscope size={16} /> Add Doctor
            </Link>
          </div>
        </div>

        {/* 6 Key Stats Grid (Requirement 19) */}
        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <>
            <div className="admin-stats-grid">
              <DashboardCard
                icon={Building2}
                title="Total Hospitals"
                value={metrics?.totalHospitals || 0}
                color="var(--primary-cyan)"
              />
              <DashboardCard
                icon={Stethoscope}
                title="Total Doctors"
                value={metrics?.totalDoctors || 0}
                color="var(--accent-teal)"
              />
              <DashboardCard
                icon={FolderHeart}
                title="Total Departments"
                value={metrics?.totalDepartments || 0}
                color="var(--accent-purple)"
              />
              <DashboardCard
                icon={Users}
                title="Registered Patients"
                value={metrics?.totalPatients || 0}
                color="var(--accent-green)"
              />
              <DashboardCard
                icon={Calendar}
                title="Total Appointments"
                value={metrics?.totalAppointments || 0}
                color="#38bdf8"
              />
              <DashboardCard
                icon={Clock}
                title="Today's Appointments"
                value={metrics?.todayAppointments || 0}
                color="var(--accent-amber)"
              />
            </div>

            {/* Appointment Status Breakdown */}
            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff' }}>
                Consultation Status Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    {metrics?.statusStats?.confirmed || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>Confirmed</div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {metrics?.statusStats?.pending || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>Pending</div>
                </div>

                <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
                    {metrics?.statusStats?.completed || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>Completed</div>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171' }}>
                    {metrics?.statusStats?.cancelled || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 600 }}>Cancelled</div>
                </div>
              </div>
            </div>

            {/* Recent Appointments Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>Recent Appointments</h3>
                <Link to="/admin/appointments" className="btn btn-outline btn-sm">
                  <span>Manage All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Hospital</th>
                      <th>Date & Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.recentAppointments && metrics.recentAppointments.length > 0 ? (
                      metrics.recentAppointments.map((app) => (
                        <tr key={app._id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>
                            {app.appointmentId}
                          </td>
                          <td style={{ color: '#fff' }}>
                            {app.patientName}
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{app.patientPhone}</div>
                          </td>
                          <td>{app.doctor?.name}</td>
                          <td>{app.hospital?.name}</td>
                          <td>{app.date} • {app.time}</td>
                          <td>
                            <span className={`status-badge ${app.status.toLowerCase()}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                          No recent appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
