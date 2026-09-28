import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/api';
import { User, Phone, Mail, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Name and phone number cannot be blank.', 'error');
      return;
    }

    try {
      setSaving(true);
      const res = await authService.updateProfile({ name: name.trim(), phone: phone.trim() });
      if (res.data?.success) {
        updateUser(res.data.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', maxWidth: '640px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/patient/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.04) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(0, 245, 212, 0.12)',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}
          >
            <User size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
              Patient Profile
            </h1>
            <span className="badge badge-emerald" style={{ marginTop: '0.35rem' }}>
              Active Verified Patient
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">
              <User size={15} color="var(--accent-cyan)" />
              <span>Full Name</span>
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-phone">
              <Phone size={15} color="var(--accent-teal)" />
              <span>Contact Telephone</span>
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">
              <Mail size={15} color="var(--accent-blue)" />
              <span>Email Address (Primary Identity)</span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="form-input"
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Email address is linked to your appointment records and cannot be changed directly.
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <CheckCircle2 size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientProfilePage;
