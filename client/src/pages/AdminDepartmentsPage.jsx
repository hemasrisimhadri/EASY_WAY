import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../components/Modal';
import { departmentService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Network,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';

const AdminDepartmentsPage = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Activity');
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentService.getDepartments({ status: '' });
      if (res.data?.data) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load departments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('Activity');
    setStatus('active');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    resetForm();
    setIsEditing(true);
    setEditingId(dept._id);
    setName(dept.name);
    setDescription(dept.description);
    setIcon(dept.icon || 'Activity');
    setStatus(dept.status || 'active');
    setFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      showToast('Please provide department name and description.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        icon,
        status
      };

      if (isEditing) {
        await departmentService.updateDepartment(editingId, payload);
        showToast('Department updated successfully.', 'success');
      } else {
        await departmentService.createDepartment(payload);
        showToast('New department added successfully.', 'success');
      }

      setFormModalOpen(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.message || 'Department operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (dept) => {
    setDeptToDelete(dept);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deptToDelete) return;
    try {
      setDeleting(true);
      await departmentService.deleteDepartment(deptToDelete._id);
      showToast(`Department '${deptToDelete.name}' has been deleted.`, 'info');
      setDeleteModalOpen(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.message || 'Failed to delete department.', 'error');
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
                Department Management
              </span>
              <h1 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>
                Medical Departments ({departments.length})
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Configure medical specialties, descriptions, and active status.
              </p>
            </div>

            <button type="button" onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Department</span>
            </button>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading departments...
              </div>
            ) : departments.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No departments currently registered.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem' }}>Hospitals</th>
                    <th style={{ padding: '0.75rem' }}>Doctors</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                        {dept.name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                        {dept.description}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-teal)' }}>
                        {dept.hospitalCount || 0}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-blue)' }}>
                        {dept.doctorCount || 0}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${dept.status === 'active' ? 'badge-emerald' : 'badge-warning'}`}>
                          {dept.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(dept)}
                            className="btn btn-secondary btn-sm"
                            title="Edit department"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(dept)}
                            className="btn btn-danger btn-sm"
                            title="Delete department"
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
          title={isEditing ? 'Edit Department' : 'Add New Department'}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="dept-name">Department Name *</label>
              <input
                id="dept-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cardiology"
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="dept-desc">Description *</label>
              <textarea
                id="dept-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of clinical scope..."
                className="form-textarea"
                rows={3}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="dept-icon">Icon Key</label>
                <select
                  id="dept-icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="form-select"
                >
                  <option value="Activity">Activity / Medical</option>
                  <option value="Heart">Heart</option>
                  <option value="Brain">Brain</option>
                  <option value="Bone">Bone / Ortho</option>
                  <option value="Eye">Eye</option>
                  <option value="Wind">Wind / Lungs</option>
                  <option value="Stethoscope">Stethoscope</option>
                  <option value="ShieldAlert">Shield Alert</option>
                  <option value="Flame">Flame / Emergency</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="dept-status">Status</label>
                <select
                  id="dept-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
                <span>{saving ? 'Saving...' : isEditing ? 'Update Department' : 'Create Department'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Department Confirmation"
        >
          {deptToDelete && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem' }}>
                Are you sure you want to delete <strong>{deptToDelete.name}</strong>?
                This will remove the department reference from hospitals and doctors.
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

export default AdminDepartmentsPage;
