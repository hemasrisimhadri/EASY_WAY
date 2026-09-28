import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import AppointmentCard from '../components/AppointmentCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

const PatientDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService
      .getMyAppointments()
      .then((res) => {
        if (res.data?.data) {
          setAppointments(res.data.data);
        }
      })
      .catch((err) => console.error('Error fetching patient dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const upcomingAppointments = appointments.filter(
    (app) => app.status === 'Confirmed' || app.status === 'Pending'
  );
  const completedAppointments = appointments.filter((app) => app.status === 'Completed');
  const cancelledAppointments = appointments.filter((app) => app.status === 'Cancelled');

  const nextUpcoming = upcomingAppointments[0];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.05) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.6rem' }}>
            Patient Health Portal
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#ffffff', fontWeight: 800 }}>
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, marginTop: '0.25rem' }}>
            Manage your hospital appointments, schedule new specialist visits, and review clinical consultation records.
          </p>
        </div>

        {/* Quick Actions buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/book" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Book Appointment</span>
          </Link>
          <Link to="/patient/profile" className="btn btn-secondary">
            <User size={16} />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}
      >
        <DashboardCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          subtitle="Scheduled & active visits"
          icon={<Clock size={20} />}
          color="cyan"
        />
        <DashboardCard
          title="Completed Appointments"
          value={completedAppointments.length}
          subtitle="Completed consultations"
          icon={<CheckCircle2 size={20} />}
          color="teal"
        />
        <DashboardCard
          title="Cancelled Appointments"
          value={cancelledAppointments.length}
          subtitle="Cancelled records"
          icon={<XCircle size={20} />}
          color="red"
        />
      </div>

      {/* Next Upcoming Appointment Highlight */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--accent-cyan)" />
            <span>Next Upcoming Appointment</span>
          </h2>
          {nextUpcoming && (
            <Link to="/patient/appointments" style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
              View All ({upcomingAppointments.length}) &rarr;
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingSkeleton count={1} />
        ) : nextUpcoming ? (
          <div style={{ maxWidth: '640px' }}>
            <AppointmentCard
              appointment={nextUpcoming}
              onView={(item) => navigate(`/patient/appointments/${item._id}`)}
              onReschedule={() => navigate('/patient/appointments')}
              onCancel={() => navigate('/patient/appointments')}
            />
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <Calendar size={36} color="var(--text-muted)" />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
              No upcoming appointments scheduled
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: 0 }}>
              Need to see a cardiologist, neurologist, or other medical specialist? Reserve your slot in Vijayawada today.
            </p>
            <Link to="/book" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
              Book an Appointment
            </Link>
          </div>
        )}
      </section>

      {/* Appointment History Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--accent-teal)" />
            <span>Recent Appointment History</span>
          </h2>
          <Link to="/patient/appointments" style={{ fontSize: '0.88rem', color: 'var(--accent-teal)', textDecoration: 'none' }}>
            Full History &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No Appointment History"
            description="Your past consultation history will be safely preserved here."
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {appointments.slice(0, 3).map((app) => (
              <AppointmentCard
                key={app._id}
                appointment={app}
                onView={(item) => navigate(`/patient/appointments/${item._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PatientDashboardPage;
