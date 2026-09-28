import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { hospitalService, departmentService } from '../../services/api';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import {
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  ShieldAlert,
  MapPin,
  Phone,
  Eye,
  CheckCircle2
} from 'lucide-react';

const AdminHospitalsPage = () => {
  const { showToast } = useToast();
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    pincode: '520002',
    phone: '',
    emergencyPhone: '',
    departments: [],
    website: '',
    directionsUrl: '',
    information: '',
    source: 'Official hospital listing',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetHospital, setTargetHospital] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHospitals = async () => {
    try {
      const res = await hospitalService.getAll();
      if (res.success) setHospitals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
    departmentService.getAll().then((res) => {
      if (res.success) setDepartments(res.data);
    });
  }, []);

  const handleOpenAdd = () => {
    setEditingHospital(null);
    setFormData({
      name: '',
      address: '',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520002',
      phone: '',
      emergencyPhone: '',
      departments: [],
      website: '',
      directionsUrl: '',
      information: '',
      source: 'Official hospital website',
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (hosp) => {
    setEditingHospital(hosp);
    setFormData({
      name: hosp.name,
      address: hosp.address,
      city: hosp.city,
      state: hosp.state,
      pincode: hosp.pincode,
      phone: hosp.phone,
      emergencyPhone: hosp.emergencyPhone || '',
      departments: hosp.departments?.map(d => d._id || d) || [],
      website: hosp.website || '',
      directionsUrl: hosp.directionsUrl || '',
      information: hosp.information || '',
      source: hosp.source || 'Official hospital listing',
      status: hosp.status || 'active'
    });
    setModalOpen(true);
  };

  const handleDeptToggle = (deptId) => {
    setFormData((prev) => {
      const exists = prev.departments.includes(deptId);
      if (exists) {
        return { ...prev, departments: prev.departments.filter(id => id !== deptId) };
      } else {
        return { ...prev, departments: [...prev.departments, deptId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      showToast('Name, address, and phone are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingHospital) {
        await hospitalService.update(editingHospital._id, formData);
        showToast('Hospital updated successfully!', 'success');
      } else {
        await hospitalService.create(formData);
        showToast('Hospital added to directory successfully!', 'success');
      }
      setModalOpen(false);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Error saving hospital record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (hosp) => {
    setTargetHospital(hosp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetHospital) return;
    setDeleting(true);
    try {
      await hospitalService.delete(targetHospital._id);
      showToast('Hospital deleted successfully.', 'info');
      setDeleteModalOpen(false);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Cannot delete hospital with associated doctors.', 'error');
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
            <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Manage Hospitals</h1>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Add, update, or manage Vijayawada healthcare centers.</p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add New Hospital</span>
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Emergency</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hosp) => (
                  <tr key={hosp._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{hosp.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {hosp.departments?.length || 0} Specialties • {hosp.doctorCount || 0} Doctors
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{hosp.address}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {hosp.city}, {hosp.pincode}
                      </div>
                    </td>
                    <td>{hosp.phone}</td>
                    <td>
                      {hosp.emergencyAvailable ? (
                        <span className="emergency-tag" style={{ fontSize: '0.75rem' }}>
                          <ShieldAlert size={12} /> {hosp.emergencyPhone || 'Available'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${hosp.status}`}>
                        {hosp.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(hosp)}
                          className="btn btn-outline btn-sm"
                          title="Edit Hospital"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(hosp)}
                          className="btn btn-danger btn-sm"
                          title="Delete Hospital"
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
          title={editingHospital ? 'Edit Hospital Record' : 'Add New Hospital'}
          maxWidth="680px"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-hospital-name">Hospital Name *</label>
              <input
                id="admin-hospital-name"
                type="text"
                required
                className="form-control"
                placeholder="e.g. Aster Ramesh Hospital"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-hospital-address">Street Address *</label>
              <input
                id="admin-hospital-address"
                type="text"
                required
                className="form-control"
                placeholder="e.g. MG Road, Collector Office Road"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-hospital-city">City</label>
                <input
                  id="admin-hospital-city"
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-hospital-pincode">Pincode *</label>
                <input
                  id="admin-hospital-pincode"
                  type="text"
                  required
                  className="form-control"
                  placeholder="520002"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-hospital-phone">Contact Phone *</label>
                <input
                  id="admin-hospital-phone"
                  type="text"
                  required
                  className="form-control"
                  placeholder="0866-2490000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-hospital-emergency-phone">Emergency Phone</label>
                <input
                  id="admin-hospital-emergency-phone"
                  type="text"
                  className="form-control"
                  placeholder="0866-2463333"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Specialty Departments</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto', background: '#090e18', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                {departments.map((dept) => (
                  <label key={dept._id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#fff', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.departments.includes(dept._id)}
                      onChange={() => handleDeptToggle(dept._id)}
                    />
                    <span>{dept.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-hospital-website">Official Website URL</label>
                <input
                  id="admin-hospital-website"
                  type="url"
                  className="form-control"
                  placeholder="https://hospital.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-hospital-status">Status</label>
                <select
                  id="admin-hospital-status"
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
              <label className="form-label" htmlFor="admin-hospital-info">Hospital Information</label>
              <textarea
                id="admin-hospital-info"
                rows="2"
                className="form-control"
                placeholder="Overview of specialties and medical facilities..."
                value={formData.information}
                onChange={(e) => setFormData({ ...formData, information: e.target.value })}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : editingHospital ? 'Update Hospital' : 'Create Hospital'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal (Requirement 20: Do not allow accidental deletion without confirmation) */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Deletion"
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Are you sure you want to permanently delete <strong style={{ color: '#fff' }}>{targetHospital?.name}</strong>?
            This will only succeed if no doctors or appointments are active under this hospital.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} disabled={deleting} className="btn btn-danger">
              {deleting ? 'Deleting...' : 'Yes, Delete Hospital'}
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default AdminHospitalsPage;
