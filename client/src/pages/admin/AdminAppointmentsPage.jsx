import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  appointmentService,
  hospitalService,
  departmentService,
  doctorService
} from '../../services/api';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Calendar,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  Trash2,
  Building2,
  Stethoscope
} from 'lucide-react';

const AdminAppointmentsPage = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterHospital, setFilterHospital] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');

  // Status Edit Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('Confirmed');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterHospital) params.hospital = filterHospital;
      if (filterDepartment) params.department = filterDepartment;
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.date = filterDate;
      if (search) params.search = search;

      const res = await appointmentService.getAllAdmin(params);
      if (res.success) setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      hospitalService.getAll(),
      departmentService.getAll()
    ]).then(([hospRes, deptRes]) => {
      if (hospRes.success) setHospitals(hospRes.data);
      if (deptRes.success) setDepartments(deptRes.data);
    });
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filterHospital, filterDepartment, filterStatus, filterDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleOpenStatusModal = (app) => {
    setSelectedAppointment(app);
    setNewStatus(app.status);
    setStatusNotes(app.notes || '');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    setUpdating(true);
    try {
      await appointmentService.updateStatus(selectedAppointment._id, {
        status: newStatus,
        notes: statusNotes
      });
      showToast(`Appointment status updated to ${newStatus}.`, 'success');
      setStatusModalOpen(false);
      fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Manage Appointments</h1>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Comprehensive patient consultation registry & scheduling.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Total Recorded: <strong style={{ color: 'var(--primary-cyan)' }}>{appointments.length}</strong>
          </div>
        </div>

        {/* Filter Controls (Requirement 23) */}
        <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Hospital:</span>
            <select
              className="filter-select"
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
            >
              <option value="">All Hospitals</option>
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Department:</span>
            <select
              className="filter-select"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Date:</span>
            <input
              type="date"
              className="filter-select"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Search ID, name, phone..."
              className="filter-select"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '180px' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Appointments Table */}
        {loading ? (
          <TableSkeleton rows={8} />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Patient</th>
                  <th>Hospital</th>
                  <th>Doctor & Specialty</th>
                  <th>Date & Slot</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    <tr key={app._id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary-cyan)' }}>
                        {app.appointmentId}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{app.patientName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {app.patientPhone} • {app.patientAge}y {app.patientGender}
                        </div>
                      </td>
                      <td>{app.hospital?.name}</td>
                      <td>
                        <div>{app.doctor?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)' }}>
                          {app.doctor?.specialty}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{app.date}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{app.time}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenStatusModal(app)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem' }}>
                      No appointments matching the chosen criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Status Modal (Requirement 23) */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Appointment: ${selectedAppointment?.appointmentId}`}
        >
          <form onSubmit={handleUpdateStatus}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div><strong>Patient:</strong> {selectedAppointment?.patientName} ({selectedAppointment?.patientPhone})</div>
              <div><strong>Doctor:</strong> {selectedAppointment?.doctor?.name}</div>
              <div><strong>Hospital:</strong> {selectedAppointment?.hospital?.name}</div>
              <div><strong>Scheduled:</strong> {selectedAppointment?.date} at {selectedAppointment?.time}</div>
              <div><strong>Reason:</strong> {selectedAppointment?.reason}</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-appointment-status-select">Appointment Status</label>
              <select
                id="admin-appointment-status-select"
                className="form-control"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-appointment-notes">Administrative Notes</label>
              <textarea
                id="admin-appointment-notes"
                rows="3"
                className="form-control"
                placeholder="Doctor consultation remarks or status update note..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setStatusModalOpen(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? 'Saving Status...' : 'Save Status Update'}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default AdminAppointmentsPage;
