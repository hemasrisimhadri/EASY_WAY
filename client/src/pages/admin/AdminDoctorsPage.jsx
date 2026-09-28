import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { doctorService, hospitalService, departmentService } from '../../services/api';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import { Stethoscope, PlusCircle, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

const AdminDoctorsPage = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    qualification: '',
    hospital: '',
    department: '',
    experience: '',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: '09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM, 11:00 AM, 04:00 PM, 04:30 PM, 05:00 PM',
    status: 'active',
    source: 'Official hospital website'
  });
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDoctor, setTargetDoctor] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [docRes, hospRes, deptRes] = await Promise.all([
        doctorService.getAll(),
        hospitalService.getAll(),
        departmentService.getAll()
      ]);
      if (docRes.success) setDoctors(docRes.data);
      if (hospRes.success) setHospitals(hospRes.data);
      if (deptRes.success) setDepartments(deptRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialty: '',
      qualification: 'MBBS, MD',
      hospital: hospitals[0]?._id || '',
      department: departments[0]?._id || '',
      experience: '10+ Years Experience',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: '09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM, 11:00 AM, 04:00 PM, 04:30 PM, 05:00 PM',
      status: 'active',
      source: 'Official hospital website'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialty: doc.specialty,
      qualification: doc.qualification || '',
      hospital: doc.hospital?._id || doc.hospital,
      department: doc.department?._id || doc.department,
      experience: doc.experience || '',
      availableDays: doc.availableDays || [],
      availableSlots: (doc.availableSlots || []).join(', '),
      status: doc.status || 'active',
      source: doc.source || 'Official hospital website'
    });
    setModalOpen(true);
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      if (exists) {
        return { ...prev, availableDays: prev.availableDays.filter(d => d !== day) };
      } else {
        return { ...prev, availableDays: [...prev.availableDays, day] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.specialty || !formData.hospital || !formData.department) {
      showToast('Name, specialty, hospital, and department are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        availableSlots: formData.availableSlots.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingDoctor) {
        await doctorService.update(editingDoctor._id, payload);
        showToast('Doctor profile updated successfully!', 'success');
      } else {
        await doctorService.create(payload);
        showToast('Doctor added to registry successfully!', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Error saving doctor record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (doc) => {
    setTargetDoctor(doc);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetDoctor) return;
    setDeleting(true);
    try {
      await doctorService.delete(targetDoctor._id);
      showToast('Doctor removed successfully.', 'info');
      setDeleteModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Cannot delete doctor with active appointments.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Manage Doctors</h1>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Specialist doctors, affiliations, and consultation slots.</p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Doctor</span>
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialty</th>
                  <th>Hospital</th>
                  <th>Department</th>
                  <th>Available Days</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {doc.qualification} • {doc.experience}
                      </div>
                    </td>
                    <td style={{ color: 'var(--primary-cyan)' }}>{doc.specialty}</td>
                    <td>{doc.hospital?.name}</td>
                    <td>{doc.department?.name}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {doc.availableDays?.slice(0, 3).join(', ')}
                      {doc.availableDays?.length > 3 ? '...' : ''}
                    </td>
                    <td>
                      <span className={`status-badge ${doc.status}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="btn btn-outline btn-sm"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(doc)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
          maxWidth="680px"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-doc-name">Doctor Full Name *</label>
              <input
                id="admin-doc-name"
                type="text"
                required
                className="form-control"
                placeholder="Dr. Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-doc-specialty">Specialty *</label>
                <input
                  id="admin-doc-specialty"
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Chief Interventional Cardiologist"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-doc-qualification">Qualification</label>
                <input
                  id="admin-doc-qualification"
                  type="text"
                  className="form-control"
                  placeholder="e.g. MBBS, MD, DM"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-doc-hospital-select">Hospital Affiliation *</label>
                <select
                  id="admin-doc-hospital-select"
                  required
                  className="form-control"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                >
                  <option value="">-- Select Hospital --</option>
                  {hospitals.map((hosp) => (
                    <option key={hosp._id} value={hosp._id}>
                      {hosp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-doc-dept-select">Department *</label>
                <select
                  id="admin-doc-dept-select"
                  required
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-doc-experience">Experience</label>
                <input
                  id="admin-doc-experience"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 15+ Years Clinical Practice"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-doc-status">Status</label>
                <select
                  id="admin-doc-status"
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Days</label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {allWeekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`btn btn-sm ${formData.availableDays.includes(day) ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-doc-slots">Available Slots (Comma-separated)</label>
              <input
                id="admin-doc-slots"
                type="text"
                className="form-control"
                placeholder="09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM"
                value={formData.availableSlots}
                onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Save Doctor'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Doctor Deletion"
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Are you sure you want to remove <strong style={{ color: '#fff' }}>{targetDoctor?.name}</strong>?
            This will only be permitted if there are no upcoming active bookings.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} disabled={deleting} className="btn btn-danger">
              {deleting ? 'Deleting...' : 'Delete Doctor'}
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default AdminDoctorsPage;
