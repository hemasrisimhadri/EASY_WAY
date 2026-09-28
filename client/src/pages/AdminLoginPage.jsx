import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide admin credentials.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(email.trim().toLowerCase(), password);

      if (loggedUser.role !== 'admin') {
        setError('Access denied: This account does not possess administrator privileges.');
        showToast('Unauthorized: Administrator role required.', 'error');
        return;
      }

      showToast('Admin authentication successful.', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
      showToast(err.message || 'Admin login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem 6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(121, 40, 202, 0.08) 100%)',
          borderColor: 'rgba(121, 40, 202, 0.35)',
          boxShadow: '0 0 35px rgba(121, 40, 202, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(121, 40, 202, 0.2)',
              border: '1px solid rgba(121, 40, 202, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: '#c084fc'
            }}
          >
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            Admin Portal Access
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Authorized EASYWAY platform coordinators &amp; administrators only.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="admin-email">
              <Mail size={15} color="#c084fc" />
              <span>Admin Email</span>
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@easyway.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="admin-password">
              <Lock size={15} color="#c084fc" />
              <span>Admin Password</span>
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure admin password"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, #7928ca 0%, #00b4d8 100%)', color: '#ffffff' }}
          >
            <Shield size={16} />
            <span>{loading ? 'Authenticating Admin...' : 'Enter Admin Console'}</span>
          </button>
        </form>

        {/* Documented Seed Admin Credentials Box */}
        <div
          style={{
            marginTop: '1.75rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.35rem' }}>
            Seeded Administrator Credentials:
          </div>
          <div>Email: <code style={{ color: 'var(--accent-cyan)' }}>admin@easyway.com</code></div>
          <div>Password: <code style={{ color: 'var(--accent-teal)' }}>Admin@12345EasyWay</code></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
