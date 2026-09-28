import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { departmentService } from '../../services/api';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import { FolderHeart, PlusCircle, Edit2, Trash2 } from 'lucide-react';

const AdminDepartmentsPage = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Heart',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetDept, setTargetDept] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAll();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Heart',
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description,
      icon: dept.icon || 'Heart',
      status: dept.status || 'active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      showToast('Name and description are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingDept) {
        await departmentService.update(editingDept._id, formData);
        showToast('Department updated successfully!', 'success');
      } else {
        await departmentService.create(formData);
        showToast('Department created successfully!', 'success');
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.message || 'Error saving department.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (dept) => {
    setTargetDept(dept);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetDept) return;
    setDeleting(true);
    try {
      await departmentService.delete(targetDept._id);
      showToast('Department deleted successfully.', 'info');
      setDeleteModalOpen(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.message || 'Cannot delete department with active doctors.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Manage Clinical Departments</h1>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Configure medical specialties and clinical descriptions.</p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Department</span>
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Icon</th>
                  <th>Affiliated Hospitals</th>
                  <th>Doctors</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{dept.name}</td>
                    <td style={{ maxWidth: '300px', fontSize: '0.85rem' }}>{dept.description}</td>
                    <td><code>{dept.icon}</code></td>
                    <td>{dept.hospitalCount || 0}</td>
                    <td>{dept.doctorCount || 0}</td>
                    <td>
                      <span className={`status-badge ${dept.status}`}>
                        {dept.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(dept)}
                          className="btn btn-outline btn-sm"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(dept)}
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
          title={editingDept ? 'Edit Department' : 'Create Department'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-dept-name">Department Name *</label>
              <input
                id="admin-dept-name"
                type="text"
                required
                className="form-control"
                placeholder="e.g. Cardiology"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-dept-desc">Description *</label>
              <textarea
                id="admin-dept-desc"
                rows="3"
                required
                className="form-control"
                placeholder="Specialty overview..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-dept-icon">Icon Keyword</label>
                <select
                  id="admin-dept-icon"
                  className="form-control"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  <option value="Heart">Heart (Cardiology)</option>
                  <option value="Activity">Activity (Neurology)</option>
                  <option value="Shield">Shield (Orthopaedics)</option>
                  <option value="Smile">Smile (Pediatrics)</option>
                  <option value="Eye">Eye (Ophthalmology)</option>
                  <option value="Feather">Feather (Gynaecology)</option>
                  <option value="Wind">Wind (Pulmonology)</option>
                  <option value="Stethoscope">Stethoscope (Medicine)</option>
                  <option value="Layers">Layers (Gastroenterology)</option>
                  <option value="Zap">Zap (Nephrology)</option>
                  <option value="Award">Award (Oncology)</option>
                  <option value="Headphones">Headphones (ENT)</option>
                  <option value="AlertCircle">AlertCircle (Emergency)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-dept-status">Status</label>
                <select
                  id="admin-dept-status"
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Department Deletion"
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Are you sure you want to delete <strong style={{ color: '#fff' }}>{targetDept?.name}</strong>?
            This will only proceed if no doctors are currently assigned to it.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} disabled={deleting} className="btn btn-danger">
              {deleting ? 'Deleting...' : 'Delete Department'}
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default AdminDepartmentsPage;
