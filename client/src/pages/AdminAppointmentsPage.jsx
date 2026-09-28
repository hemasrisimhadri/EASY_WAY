import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../components/Modal';
import {
  appointmentService,
  hospitalService,
  departmentService,
  doctorService
} from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  CalendarCheck,
  Filter,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  Stethoscope,
  RotateCcw
} from 'lucide-react';

const AdminAppointmentsPage = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterHospital, setFilterHospital] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // View Details Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingApp, setViewingApp] = useState(null);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDropdowns = async () => {
    try {
      const [hospRes, deptRes, docRes] = await Promise.all([
        hospitalService.getHospitals({ status: 'active' }),
        departmentService.getDepartments({ status: 'active' }),
        doctorService.getDoctors({ status: 'active' })
      ]);
      if (hospRes.data?.data) setHospitals(hospRes.data.data);
      if (deptRes.data?.data) setDepartments(deptRes.data.data);
      if (docRes.data?.data) setDoctors(docRes.data.data);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterHospital) params.hospital = filterHospital;
      if (filterDepartment) params.department = filterDepartment;
      if (filterDoctor) params.doctor = filterDoctor;
      if (filterStatus) params.status = filterStatus;

      const res = await appointmentService.getAllAppointments(params);
      if (res.data?.data) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filterDate, filterHospital, filterDepartment, filterDoctor, filterStatus]);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusNotes(app.notes || '');
    setStatusModalOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;
    try {
      setUpdating(true);
      await appointmentService.updateStatus(selectedApp._id, newStatus, statusNotes);
      showToast(`Appointment ${selectedApp.appointmentId} status changed to ${newStatus}.`, 'success');
      setStatusModalOpen(false);
      fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to update appointment status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenDelete = (app) => {
    setAppToDelete(app);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!appToDelete) return;
    try {
      setDeleting(true);
      await appointmentService.deleteAppointment(appToDelete._id);
      showToast(`Appointment ${appToDelete.appointmentId} removed.`, 'info');
      setDeleteModalOpen(false);
      fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to delete appointment.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setFilterDate('');
    setFilterHospital('');
    setFilterDepartment('');
    setFilterDoctor('');
    setFilterStatus('');
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 76px)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
                Operations
              </span>
              <h1 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>
                Appointment Management ({appointments.length})
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Filter by date, hospital, doctor, department, or status, and update reservation status.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              background: 'rgba(13, 19, 31, 0.9)'
            }}
          >
            {/* Filter Date */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }} htmlFor="admin-filter-date">Date</label>
              <input
                id="admin-filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="form-input"
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
              />
            </div>

            {/* Filter Hospital */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }} htmlFor="admin-filter-hosp">Hospital</label>
              <select
                id="admin-filter-hosp"
                value={filterHospital}
                onChange={(e) => setFilterHospital(e.target.value)}
                className="form-select"
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="">All Hospitals</option>
                {hospitals.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Department */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }} htmlFor="admin-filter-dept">Department</label>
              <select
                id="admin-filter-dept"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="form-select"
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Doctor */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }} htmlFor="admin-filter-doc">Doctor</label>
              <select
                id="admin-filter-doc"
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="form-select"
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }} htmlFor="admin-filter-status">Status</label>
              <select
                id="admin-filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {(filterDate || filterHospital || filterDepartment || filterDoctor || filterStatus) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Table */}
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No appointments found matching your filter criteria.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Patient Info</th>
                    <th style={{ padding: '0.75rem' }}>Hospital &amp; Dept</th>
                    <th style={{ padding: '0.75rem' }}>Doctor</th>
                    <th style={{ padding: '0.75rem' }}>Date &amp; Slot</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {app.appointmentId}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{app.patientName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {app.patientPhone} &bull; {app.patientAge}y {app.patientGender}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ color: 'var(--text-primary)' }}>{app.hospital?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)' }}>
                          {app.department?.name}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                        {app.doctor?.name}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ color: '#ffffff' }}>{app.date}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{app.time}</div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          className={`badge ${
                            app.status === 'Confirmed'
                              ? 'badge-emerald'
                              : app.status === 'Cancelled'
                              ? 'badge-danger'
                              : app.status === 'Completed'
                              ? 'badge-blue'
                              : 'badge-warning'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => { setViewingApp(app); setDetailModalOpen(true); }}
                            className="btn btn-secondary btn-sm"
                            title="View full appointment details"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(app)}
                            className="btn btn-outline-cyan btn-sm"
                            title="Change status"
                          >
                            <RotateCcw size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(app)}
                            className="btn btn-danger btn-sm"
                            title="Delete appointment"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Change Status Modal */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title="Update Appointment Status"
        >
          {selectedApp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Appointment ID</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {selectedApp.appointmentId} ({selectedApp.patientName})
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="status-select">Select New Status</label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="status-notes-input">Admin / Clinic Notes</label>
                <textarea
                  id="status-notes-input"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Notes regarding status change..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmStatusUpdate}
                  disabled={updating}
                  className="btn btn-primary btn-sm"
                >
                  <CheckCircle2 size={15} />
                  <span>{updating ? 'Updating...' : 'Save Status'}</span>
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* View Details Modal */}
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title="Appointment Record"
        >
          {viewingApp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>ID:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{viewingApp.appointmentId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Patient:</span>
                <strong style={{ color: '#ffffff' }}>{viewingApp.patientName} ({viewingApp.patientAge}y, {viewingApp.patientGender})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                <strong style={{ color: '#ffffff' }}>{viewingApp.patientPhone} | {viewingApp.patientEmail}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hospital:</span>
                <strong style={{ color: '#ffffff' }}>{viewingApp.hospital?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Doctor:</span>
                <strong style={{ color: 'var(--accent-teal)' }}>{viewingApp.doctor?.name} ({viewingApp.department?.name})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date &amp; Time:</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{viewingApp.date} at {viewingApp.time}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span className="badge badge-emerald">{viewingApp.status}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Reason:</span>
                <p style={{ color: '#ffffff', margin: '0.25rem 0' }}>{viewingApp.reason}</p>
              </div>
              {viewingApp.notes && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Notes:</span>
                  <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>{viewingApp.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Appointment Record"
        >
          {appToDelete && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem' }}>
                Permanently delete appointment <strong>{appToDelete.appointmentId}</strong> for patient {appToDelete.patientName}?
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 size={15} />
                  <span>{deleting ? 'Deleting...' : 'Confirm Deletion'}</span>
                </button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default AdminAppointmentsPage;
