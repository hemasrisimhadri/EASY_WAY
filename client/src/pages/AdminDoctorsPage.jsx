import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../components/Modal';
import { doctorService, hospitalService, departmentService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Award,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

const defaultSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminDoctorsPage = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [qualification, setQualification] = useState('');
  const [hospital, setHospital] = useState('');
  const [department, setDepartment] = useState('');
  const [experience, setExperience] = useState('10+ Years');
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [selectedSlots, setSelectedSlots] = useState(defaultSlots);
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [docRes, hospRes, deptRes] = await Promise.all([
        doctorService.getDoctors({ status: '' }),
        hospitalService.getHospitals({ status: 'active' }),
        departmentService.getDepartments({ status: 'active' })
      ]);
      if (docRes.data?.data) setDoctors(docRes.data.data);
      if (hospRes.data?.data) setHospitals(hospRes.data.data);
      if (deptRes.data?.data) setDepartments(deptRes.data.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch doctor data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => {
    setName('');
    setSpecialty('');
    setQualification('');
    setHospital(hospitals[0]?._id || '');
    setDepartment(departments[0]?._id || '');
    setExperience('10+ Years');
    setSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    setSelectedSlots(defaultSlots);
    setStatus('active');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    resetForm();
    setIsEditing(true);
    setEditingId(doc._id);
    setName(doc.name);
    setSpecialty(doc.specialty);
    setQualification(doc.qualification || '');
    setHospital(doc.hospital?._id || doc.hospital || '');
    setDepartment(doc.department?._id || doc.department || '');
    setExperience(doc.experience || '');
    setSelectedDays(doc.availableDays || []);
    setSelectedSlots(doc.availableSlots || defaultSlots);
    setStatus(doc.status || 'active');
    setFormModalOpen(true);
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim() || !hospital || !department) {
      showToast('Please provide doctor name, specialty, hospital, and department.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        specialty: specialty.trim(),
        qualification: qualification.trim(),
        hospital,
        department,
        experience: experience.trim(),
        availableDays: selectedDays,
        availableSlots: selectedSlots,
        status
      };

      if (isEditing) {
        await doctorService.updateDoctor(editingId, payload);
        showToast('Doctor details updated successfully.', 'success');
      } else {
        await doctorService.createDoctor(payload);
        showToast('New doctor successfully added to roster.', 'success');
      }

      setFormModalOpen(false);
      fetchAll();
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (doc) => {
    setDoctorToDelete(doc);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      setDeleting(true);
      await doctorService.deleteDoctor(doctorToDelete._id);
      showToast(`Doctor '${doctorToDelete.name}' deleted.`, 'info');
      setDeleteModalOpen(false);
      fetchAll();
    } catch (err) {
      showToast(err.message || 'Failed to delete doctor.', 'error');
    } finally {
      setDeleting(false);
    }
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
                Practitioner Roster
              </span>
              <h1 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>
                Manage Doctors ({doctors.length})
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Maintain verified publicly listed physicians, specialty affiliations, and available slots.
              </p>
            </div>

            <button type="button" onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Doctor</span>
            </button>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading doctor rosters...
              </div>
            ) : doctors.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No doctors currently listed.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Doctor Name</th>
                    <th style={{ padding: '0.75rem' }}>Specialty</th>
                    <th style={{ padding: '0.75rem' }}>Hospital</th>
                    <th style={{ padding: '0.75rem' }}>Department</th>
                    <th style={{ padding: '0.75rem' }}>Slots</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                        {doc.name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-teal)' }}>
                        {doc.specialty}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                        {doc.hospital?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-blue)' }}>
                        {doc.department?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                        {doc.availableSlots?.length || 0} Slots
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${doc.status === 'active' ? 'badge-emerald' : 'badge-warning'}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(doc)}
                            className="btn btn-secondary btn-sm"
                            title="Edit doctor"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(doc)}
                            className="btn btn-danger btn-sm"
                            title="Delete doctor"
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

        {/* Add/Edit Modal */}
        <Modal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title={isEditing ? 'Edit Doctor Profile' : 'Add New Doctor to Roster'}
          maxWidth="640px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="doc-form-name">Doctor Name *</label>
                <input
                  id="doc-form-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. P. Ramesh Babu"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="doc-form-spec">Specialty *</label>
                <input
                  id="doc-form-spec"
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Cardiology"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="doc-form-qual">Qualification</label>
                <input
                  id="doc-form-qual"
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. MBBS, MD, DM"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="doc-form-exp">Experience</label>
                <input
                  id="doc-form-exp"
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 15+ Years"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="doc-form-hosp">Hospital *</label>
                <select
                  id="doc-form-hosp"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Hospital --</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="doc-form-dept">Department *</label>
                <select
                  id="doc-form-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available Days Checkboxes */}
            <div>
              <label className="form-label">Consultation Days</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-main)',
                      cursor: 'pointer',
                      border: '1px solid',
                      background: selectedDays.includes(day)
                        ? 'rgba(0, 245, 212, 0.15)'
                        : 'rgba(255, 255, 255, 0.04)',
                      borderColor: selectedDays.includes(day)
                        ? 'var(--accent-cyan)'
                        : 'var(--border-subtle)',
                      color: selectedDays.includes(day) ? 'var(--accent-cyan)' : 'var(--text-muted)'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="doc-form-status">Status</label>
              <select
                id="doc-form-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-sm"
              >
                <CheckCircle2 size={16} />
                <span>{saving ? 'Saving...' : isEditing ? 'Update Doctor' : 'Create Doctor'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Doctor Confirmation"
        >
          {doctorToDelete && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem' }}>
                Are you sure you want to permanently remove <strong>{doctorToDelete.name}</strong> from the roster?
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

export default AdminDoctorsPage;
