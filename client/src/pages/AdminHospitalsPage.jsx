import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../components/Modal';
import { hospitalService, departmentService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Phone,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const AdminHospitalsPage = () => {
  const { showToast } = useToast();
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Vijayawada');
  const [state, setState] = useState('Andhra Pradesh');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyAvailable, setEmergencyAvailable] = useState(false);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [website, setWebsite] = useState('');
  const [directionsUrl, setDirectionsUrl] = useState('');
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);

  // Delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const [hospRes, deptRes] = await Promise.all([
        hospitalService.getHospitals({ status: '' }), // all statuses
        departmentService.getDepartments({ status: 'active' })
      ]);
      if (hospRes.data?.data) setHospitals(hospRes.data.data);
      if (deptRes.data?.data) setDepartments(deptRes.data.data);
    } catch (err) {
      showToast(err.message || 'Failed to load hospitals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const resetForm = () => {
    setName('');
    setAddress('');
    setCity('Vijayawada');
    setState('Andhra Pradesh');
    setPincode('');
    setPhone('');
    setEmergencyPhone('');
    setEmergencyAvailable(false);
    setSelectedDepts([]);
    setWebsite('');
    setDirectionsUrl('');
    setStatus('active');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormModalOpen(true);
  };

  const handleOpenEdit = (hosp) => {
    resetForm();
    setIsEditing(true);
    setEditingId(hosp._id);
    setName(hosp.name);
    setAddress(hosp.address);
    setCity(hosp.city || 'Vijayawada');
    setState(hosp.state || 'Andhra Pradesh');
    setPincode(hosp.pincode || '');
    setPhone(hosp.phone);
    setEmergencyPhone(hosp.emergencyPhone || '');
    setEmergencyAvailable(hosp.emergencyAvailable || false);
    setSelectedDepts((hosp.departments || []).map((d) => (typeof d === 'object' ? d._id : d)));
    setWebsite(hosp.website || '');
    setDirectionsUrl(hosp.directionsUrl || '');
    setStatus(hosp.status || 'active');
    setFormModalOpen(true);
  };

  const handleDepartmentToggle = (deptId) => {
    setSelectedDepts((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim()) {
      showToast('Please provide hospital name, address, and contact phone.', 'error');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),
        emergencyPhone: emergencyPhone.trim(),
        emergencyAvailable,
        departments: selectedDepts,
        website: website.trim(),
        directionsUrl: directionsUrl.trim(),
        status
      };

      if (isEditing) {
        await hospitalService.updateHospital(editingId, payload);
        showToast('Hospital details updated successfully.', 'success');
      } else {
        await hospitalService.createHospital(payload);
        showToast('New hospital added successfully.', 'success');
      }

      setFormModalOpen(false);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (hosp) => {
    setHospitalToDelete(hosp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!hospitalToDelete) return;
    try {
      setDeleting(true);
      await hospitalService.deleteHospital(hospitalToDelete._id);
      showToast(`Hospital '${hospitalToDelete.name}' has been deleted.`, 'info');
      setDeleteModalOpen(false);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Failed to delete hospital.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 76px)' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header & Add Button */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
                Hospital Management
              </span>
              <h1 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>
                Hospitals Directory ({hospitals.length})
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Create, update, and manage verified healthcare facilities in Vijayawada.
              </p>
            </div>

            <button type="button" onClick={handleOpenAdd} className="btn btn-primary">
              <Plus size={16} />
              <span>Add Hospital</span>
            </button>
          </div>

          {/* Hospitals Table */}
          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading hospital records...
              </div>
            ) : hospitals.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hospitals currently registered in database.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Hospital Name</th>
                    <th style={{ padding: '0.75rem' }}>Address</th>
                    <th style={{ padding: '0.75rem' }}>Phone</th>
                    <th style={{ padding: '0.75rem' }}>Emergency</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hosp) => (
                    <tr key={hosp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                        {hosp.name}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                        {hosp.address}, {hosp.city}
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--accent-teal)' }}>
                        {hosp.phone}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {hosp.emergencyAvailable ? (
                          <span className="badge badge-danger">24/7 Verified</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${hosp.status === 'active' ? 'badge-emerald' : 'badge-warning'}`}>
                          {hosp.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(hosp)}
                            className="btn btn-secondary btn-sm"
                            title="Edit hospital details"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(hosp)}
                            className="btn btn-danger btn-sm"
                            title="Delete hospital"
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

        {/* Add/Edit Hospital Modal */}
        <Modal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title={isEditing ? 'Edit Hospital Details' : 'Add New Hospital Facility'}
          maxWidth="680px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="hosp-name">Hospital Name *</label>
              <input
                id="hosp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Manipal Hospital Vijayawada"
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="hosp-address">Address *</label>
              <input
                id="hosp-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, landmark, area"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-city">City</label>
                <input
                  id="hosp-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-state">State</label>
                <input
                  id="hosp-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-pincode">Pincode</label>
                <input
                  id="hosp-pincode"
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="520008"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-phone">Reception Phone *</label>
                <input
                  id="hosp-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0866-2488888"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-emergency-phone">Emergency Phone (Verified)</label>
                <input
                  id="hosp-emergency-phone"
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="0866-2488889"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <input
                id="emergencyAvailableCheck"
                type="checkbox"
                checked={emergencyAvailable}
                onChange={(e) => setEmergencyAvailable(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="emergencyAvailableCheck" style={{ fontSize: '0.88rem', color: '#ffffff', cursor: 'pointer' }}>
                24/7 Verified Emergency Facility Available
              </label>
            </div>

            {/* Department checkboxes */}
            <div>
              <label className="form-label">Offered Departments</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                {departments.map((dept) => (
                  <label key={dept._id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedDepts.includes(dept._id)}
                      onChange={() => handleDepartmentToggle(dept._id)}
                    />
                    <span>{dept.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-website">Website URL</label>
                <input
                  id="hosp-website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://hospital.com"
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="hosp-status">Status</label>
                <select
                  id="hosp-status"
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
                <span>{saving ? 'Saving...' : isEditing ? 'Update Hospital' : 'Create Hospital'}</span>
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Hospital Confirmation"
        >
          {hospitalToDelete && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.9rem' }}>
                Are you sure you want to permanently remove <strong>{hospitalToDelete.name}</strong>?
                This action cannot be undone and will affect associated doctor and appointment queries.
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

export default AdminHospitalsPage;
