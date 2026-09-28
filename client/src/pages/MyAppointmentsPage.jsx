import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentService, doctorService } from '../services/api';
import { useToast } from '../context/ToastContext';
import AppointmentCard from '../components/AppointmentCard';
import Modal from '../components/Modal';
import TimeSlotPicker from '../components/TimeSlotPicker';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Calendar,
  Clock,
  Building2,
  User,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  XCircle,
  FileText
} from 'lucide-react';

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Reschedule Modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getMyAppointments();
      if (res.data?.data) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter list by tab
  const filteredAppointments = appointments.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  // Handle Cancel Trigger
  const handleOpenCancel = (app) => {
    setCancellingAppointment(app);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingAppointment) return;
    try {
      setCancelling(true);
      const res = await appointmentService.cancelAppointment(
        cancellingAppointment._id,
        cancelReason || 'Patient requested cancellation'
      );
      if (res.data?.success) {
        showToast('Appointment cancelled successfully.', 'info');
        setCancelModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel appointment.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Handle Reschedule Trigger
  const handleOpenReschedule = (app) => {
    setReschedulingAppointment(app);
    // Tomorrow default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const dateStr = d.toISOString().split('T')[0];
    setNewDate(dateStr);
    setNewTime('');
    setRescheduleModalOpen(true);

    // Fetch doctor slots for this date
    if (app.doctor?._id) {
      setSlotsLoading(true);
      doctorService
        .getDoctorById(app.doctor._id, dateStr)
        .then((res) => {
          if (res.data?.data) {
            setRescheduleSlots(res.data.data.slotsStatus || []);
          }
        })
        .finally(() => setSlotsLoading(false));
    }
  };

  const handleRescheduleDateChange = (date) => {
    setNewDate(date);
    setNewTime('');
    if (reschedulingAppointment?.doctor?._id) {
      setSlotsLoading(true);
      doctorService
        .getDoctorById(reschedulingAppointment.doctor._id, date)
        .then((res) => {
          if (res.data?.data) {
            setRescheduleSlots(res.data.data.slotsStatus || []);
          }
        })
        .finally(() => setSlotsLoading(false));
    }
  };

  const handleConfirmReschedule = async () => {
    if (!reschedulingAppointment || !newDate || !newTime) return;
    try {
      setRescheduling(true);
      const res = await appointmentService.rescheduleAppointment(
        reschedulingAppointment._id,
        { newDate, newTime }
      );
      if (res.data?.success) {
        showToast('Appointment rescheduled successfully!', 'success');
        setRescheduleModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      showToast(err.message || 'Failed to reschedule appointment.', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
            Patient Portal
          </span>
          <h1 style={{ fontSize: '2.25rem', color: '#ffffff', fontWeight: 800 }}>
            My Appointments
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Track and manage your scheduled hospital consultations.
          </p>
        </div>

        <Link to="/book" className="btn btn-primary">
          <Calendar size={16} />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        {[
          { label: 'All', value: 'ALL' },
          { label: 'Confirmed', value: 'Confirmed' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Cancelled', value: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilterStatus(tab.value)}
            className={`btn btn-sm ${filterStatus === tab.value ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description={
            filterStatus === 'ALL'
              ? "You haven't scheduled any consultations yet. Find a doctor and book your first visit."
              : `No appointments with status '${filterStatus}'.`
          }
          actionText="Book an Appointment"
          actionLink="/book"
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {filteredAppointments.map((app) => (
            <AppointmentCard
              key={app._id}
              appointment={app}
              onView={(item) => navigate(`/patient/appointments/${item._id}`)}
              onCancel={handleOpenCancel}
              onReschedule={handleOpenReschedule}
            />
          ))}
        </div>
      )}

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment Confirmation"
      >
        {cancellingAppointment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem' }}>
              Are you sure you want to cancel appointment <strong>{cancellingAppointment.appointmentId}</strong> with Dr. {cancellingAppointment.doctor?.name} on {cancellingAppointment.date} at {cancellingAppointment.time}?
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="cancel-reason-input">Reason for Cancellation (Optional)</label>
              <textarea
                id="cancel-reason-input"
                className="form-textarea"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please let the clinic know why you are cancelling..."
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="btn btn-danger btn-sm"
              >
                <XCircle size={15} />
                <span>{cancelling ? 'Cancelling...' : 'Confirm Cancellation'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reschedule Appointment Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Appointment"
        maxWidth="640px"
      >
        {reschedulingAppointment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Select a new date and an available slot for Dr. <strong>{reschedulingAppointment.doctor?.name}</strong> at <strong>{reschedulingAppointment.hospital?.name}</strong>.
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="reschedule-date">New Consultation Date</label>
              <input
                id="reschedule-date"
                type="date"
                min={todayStr}
                value={newDate}
                onChange={(e) => handleRescheduleDateChange(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Select New Time Slot
              </div>
              {slotsLoading ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  Loading available slots for {newDate}...
                </div>
              ) : (
                <TimeSlotPicker
                  slots={rescheduleSlots}
                  selectedTime={newTime}
                  onSelectSlot={(slot) => setNewTime(slot)}
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={rescheduling || !newTime}
                className="btn btn-primary btn-sm"
              >
                <RotateCcw size={15} />
                <span>{rescheduling ? 'Rescheduling...' : `Confirm New Time (${newTime || 'None'})`}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyAppointmentsPage;
