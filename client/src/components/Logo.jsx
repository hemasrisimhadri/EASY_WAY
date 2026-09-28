import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md', showTagline = false, clickable = true }) => {
  const sizeMap = {
    sm: { icon: 32, text: '1.15rem', sub: '0.65rem' },
    md: { icon: 42, text: '1.45rem', sub: '0.72rem' },
    lg: { icon: 64, text: '2.1rem', sub: '0.85rem' },
    xl: { icon: 84, text: '2.8rem', sub: '1rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      <img
        src="/logo.svg"
        alt="EasyWay Healthcare Logo"
        width={currentSize.icon}
        height={currentSize.icon}
        style={{
          filter: 'drop-shadow(0 0 14px rgba(0, 245, 212, 0.45))',
          display: 'block'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: currentSize.text,
            fontWeight: 800,
            letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #00F5D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}
        >
          EASYWAY
        </span>
        {showTagline && (
          <span
            style={{
              fontSize: currentSize.sub,
              fontWeight: 600,
              color: 'var(--accent-teal)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}
          >
            Healthcare Made Easy
          </span>
        )}
      </div>
    </div>
  );

  if (!clickable) return content;

  return (
    <Link to="/" style={{ textDecoration: 'none' }} aria-label="EASYWAY Home">
      {content}
    </Link>
  );
};

export default Logo;
