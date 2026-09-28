import React from 'react';

export const CardSkeleton = () => (
  <div
    className="glass-card"
    style={{
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: '260px'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton" style={{ width: '45px', height: '45px', borderRadius: '12px' }} />
      <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '999px' }} />
    </div>
    <div className="skeleton" style={{ width: '70%', height: '26px' }} />
    <div className="skeleton" style={{ width: '90%', height: '16px' }} />
    <div className="skeleton" style={{ width: '60%', height: '16px' }} />
    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
      <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '10px' }} />
      <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '10px' }} />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="skeleton"
        style={{
          width: '100%',
          height: '52px',
          borderRadius: 'var(--radius-sm)'
        }}
      />
    ))}
  </div>
);

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
