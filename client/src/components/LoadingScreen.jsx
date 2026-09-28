import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: black, 1: gradient, 2: logo, 3: tagline, 4: transition out

  useEffect(() => {
    // Stage 1: Introduce deep luminous gradient at 250ms
    const t1 = setTimeout(() => setPhase(1), 250);
    // Stage 2: Display EasyWay logo with glow at 600ms
    const t2 = setTimeout(() => setPhase(2), 650);
    // Stage 3: Display "Healthcare Made Easy" at 1150ms
    const t3 = setTimeout(() => setPhase(3), 1150);
    // Stage 4: Fade out and transition to home at 2100ms
    const t4 = setTimeout(() => setPhase(4), 2100);
    // Complete callback at 2500ms
    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#030508',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s ease',
        opacity: phase === 4 ? 0 : 1,
        pointerEvents: phase === 4 ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      {/* Background Luminous Gradient intro */}
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 212, 0.22) 0%, rgba(0, 180, 216, 0.12) 35%, rgba(121, 40, 202, 0.08) 60%, transparent 80%)',
          filter: 'blur(60px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.4)'
        }}
      />

      {/* Center Branding Content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        {/* Glowing Logo Frame */}
        <div
          style={{
            position: 'relative',
            transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'scale(1)' : 'scale(0.7)'
          }}
        >
          {/* Subtle cyan/green ambient halo */}
          <div
            style={{
              position: 'absolute',
              inset: '-18px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 245, 212, 0.5) 0%, rgba(6, 214, 160, 0.3) 50%, transparent 75%)',
              filter: 'blur(20px)',
              opacity: phase >= 2 ? 1 : 0,
              transition: 'opacity 0.8s ease'
            }}
          />
          <img
            src="/logo.svg"
            alt="EasyWay Official Logo"
            width={110}
            height={110}
            style={{
              position: 'relative',
              filter: 'drop-shadow(0 0 24px rgba(0, 245, 212, 0.6))',
              display: 'block'
            }}
          />
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.8rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #FFFFFF 20%, #00F5D4 80%, #06D6A0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            transition: 'all 0.6s ease',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(15px)'
          }}
        >
          EASYWAY
        </h1>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.7s ease',
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(15px)'
          }}
        >
          <span
            style={{
              width: '24px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00f5d4)'
            }}
          />
          <span
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#00f5d4',
              textShadow: '0 0 15px rgba(0, 245, 212, 0.5)'
            }}
          >
            Healthcare Made Easy
          </span>
          <span
            style={{
              width: '24px',
              height: '2px',
              background: 'linear-gradient(90deg, #00f5d4, transparent)'
            }}
          />
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#64748b',
            letterSpacing: '0.05em',
            margin: 0,
            transition: 'opacity 0.6s ease',
            opacity: phase >= 3 ? 0.8 : 0
          }}
        >
          Vijayawada, Andhra Pradesh
        </p>
      </div>

      {/* Skip button in corner */}
      <button
        onClick={() => {
          setPhase(4);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
        }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#94a3b8',
          fontSize: '0.78rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          opacity: phase >= 2 ? 0.7 : 0
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
      >
        Skip &rarr;
      </button>
    </div>
  );
};

export default LoadingScreen;
