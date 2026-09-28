import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid rgba(0, 245, 212, 0.2)',
              borderTopColor: 'var(--accent-cyan)',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Verifying authentication...
          </span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = roleRequired === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={redirectUrl} state={{ from: location }} replace />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    // If patient tries to access admin, or non-admin tries to access admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
