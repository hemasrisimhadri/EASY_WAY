import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon, trend, color = 'cyan' }) => {
  const colorMap = {
    cyan: { bg: 'rgba(0, 245, 212, 0.1)', border: 'rgba(0, 245, 212, 0.25)', text: '#00f5d4' },
    teal: { bg: 'rgba(6, 214, 160, 0.1)', border: 'rgba(6, 214, 160, 0.25)', text: '#06d6a0' },
    blue: { bg: 'rgba(0, 180, 216, 0.1)', border: 'rgba(0, 180, 216, 0.25)', text: '#00b4d8' },
    purple: { bg: 'rgba(121, 40, 202, 0.12)', border: 'rgba(121, 40, 202, 0.3)', text: '#c084fc' },
    orange: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: '#f59e0b' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', text: '#ef4444' }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: scheme.bg,
            border: `1px solid ${scheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: scheme.text
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.1
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
