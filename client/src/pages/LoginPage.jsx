import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/patient/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedUser = await login(email.trim().toLowerCase(), password);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');

      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email address or password.');
      showToast(err.message || 'Login failed.', 'error');
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
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.04) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.25)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="md" showTagline={false} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '1.25rem' }}>
            Patient Sign In
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Access your appointments, profile, and medical consultation records.
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
            <label className="form-label" htmlFor="login-email">
              <Mail size={15} color="var(--accent-cyan)" />
              <span>Email Address</span>
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patient@easyway.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="login-password">
              <Lock size={15} color="var(--accent-teal)" />
              <span>Password</span>
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <LogIn size={16} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo credentials tip for instant tester testing */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div><strong>Demo Patient Account:</strong></div>
          <div>Email: <code style={{ color: 'var(--accent-cyan)' }}>patient@easyway.com</code></div>
          <div>Password: <code style={{ color: 'var(--accent-teal)' }}>Patient@12345</code></div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an EasyWay account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
