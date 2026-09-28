import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Logo from '../../components/Logo';
import { ShieldCheck, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role !== 'admin') {
        showToast('Unauthorized: This account does not possess administrative privileges.', 'error');
        navigate('/patient/dashboard');
        return;
      }
      showToast('Welcome to EasyWay Administrator Control Center.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      showToast(err.message || 'Invalid administrator credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', border: '1px solid var(--border-glow)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-cyan)' }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Administrator Portal</h1>
          <p style={{ fontSize: '0.88rem' }}>EasyWay Healthcare Platform Management • Vijayawada</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                name="email"
                required
                className="form-control"
                placeholder="admin@easyway.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                name="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
          >
            {loading ? <span>Verifying...</span> : (
              <>
                <LogIn size={18} />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <Link to="/" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
