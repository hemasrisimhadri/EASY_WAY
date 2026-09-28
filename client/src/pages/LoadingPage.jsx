import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);

  return (
    <div style={{ minHeight: '80vh', position: 'relative' }}>
      <LoadingScreen
        forceShow={true}
        onComplete={() => {
          setComplete(true);
          navigate('/');
        }}
      />
      {complete && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h2>Opening Animation Finished</h2>
          <p>Redirecting to Homepage...</p>
        </div>
      )}
    </div>
  );
};

export default LoadingPage;
