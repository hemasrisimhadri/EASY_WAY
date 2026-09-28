import React from 'react';
import { Clock, Check, XCircle, MinusCircle } from 'lucide-react';

const TimeSlotPicker = ({ slots = [], selectedTime, onSelectSlot }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Visual Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-teal)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-teal)' }} />
          <span>AVAILABLE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <span>BOOKED</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#475569' }} />
          <span>UNAVAILABLE</span>
        </div>
      </div>

      {/* Grid of Slots */}
      {slots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Please select a consultation date to view doctor slot availability.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {slots.map((slot) => {
            const timeStr = typeof slot === 'string' ? slot : slot.time;
            const isBooked = typeof slot === 'object' && slot.isBooked;
            const isUnavailable = typeof slot === 'object' && slot.isUnavailable;
            const isSelected = selectedTime === timeStr;

            let buttonStyle = {
              padding: '0.75rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: 600,
              fontFamily: 'var(--font-main)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all var(--transition-fast)',
              border: '1px solid var(--border-subtle)',
              outline: 'none'
            };

            if (isBooked) {
              return (
                <button
                  key={timeStr}
                  type="button"
                  disabled
                  style={{
                    ...buttonStyle,
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    cursor: 'not-allowed',
                    opacity: 0.7
                  }}
                  title="This time slot is already booked."
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <XCircle size={14} color="#ef4444" />
                    <span>{timeStr}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ef4444' }}>
                    BOOKED
                  </span>
                </button>
              );
            }

            if (isUnavailable) {
              return (
                <button
                  key={timeStr}
                  type="button"
                  disabled
                  style={{
                    ...buttonStyle,
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#64748b',
                    cursor: 'not-allowed',
                    opacity: 0.5
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MinusCircle size={14} color="#64748b" />
                    <span>{timeStr}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    UNAVAILABLE
                  </span>
                </button>
              );
            }

            if (isSelected) {
              return (
                <button
                  key={timeStr}
                  type="button"
                  onClick={() => onSelectSlot(timeStr)}
                  style={{
                    ...buttonStyle,
                    background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.2) 0%, rgba(0, 180, 216, 0.25) 100%)',
                    borderColor: 'var(--accent-cyan)',
                    color: '#ffffff',
                    boxShadow: '0 0 15px rgba(0, 245, 212, 0.4)',
                    transform: 'scale(1.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={14} color="var(--accent-cyan)" />
                    <strong style={{ color: '#00f5d4' }}>{timeStr}</strong>
                  </div>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                    SELECTED
                  </span>
                </button>
              );
            }

            // Default Available
            return (
              <button
                key={timeStr}
                type="button"
                onClick={() => onSelectSlot(timeStr)}
                style={{
                  ...buttonStyle,
                  background: 'rgba(6, 214, 160, 0.05)',
                  borderColor: 'rgba(6, 214, 160, 0.25)',
                  color: '#f8fafc'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-teal)';
                  e.currentTarget.style.background = 'rgba(6, 214, 160, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6, 214, 160, 0.25)';
                  e.currentTarget.style.background = 'rgba(6, 214, 160, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={14} color="var(--accent-teal)" />
                  <span>{timeStr}</span>
                </div>
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-teal)' }}>
                  AVAILABLE
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
