import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon,
  title = 'No records found',
  description = 'There is currently no data matching your criteria.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        maxWidth: '540px',
        margin: '2rem auto'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(0, 245, 212, 0.08)',
          border: '1px solid rgba(0, 245, 212, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}
      >
        {icon || <AlertCircle size={32} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>

      {actionText && (
        <div style={{ marginTop: '0.5rem' }}>
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary btn-sm">
              <span>{actionText}</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
