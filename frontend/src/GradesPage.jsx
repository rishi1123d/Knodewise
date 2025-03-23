import React from 'react';
import backgroundImage from './assets/Screenshot_2025-03-22_at_9.02.14_PM.webp';
import { useNavigate } from 'react-router-dom';

function GradesPage() {
  const navigate = useNavigate();

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    margin: 0,
    padding: 0
  };

  const buttonStyle = {
    position: 'absolute',
    left: '7.6%',
    top: '49.8%',
    color: '#2D3B45',
    fontFamily: 'Lato, "Helvetica Neue", Arial, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    lineHeight: '20px',
    zIndex: 1000,
    margin: 0,
    padding: '8px 0',
    transform: 'scale(1)',
    transformOrigin: 'left center',
    whiteSpace: 'nowrap'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = 'rgba(45, 59, 69, 0.1)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
  };

  return (
    <div style={containerStyle}>
      <img 
        src={backgroundImage} 
        alt="Grades Screenshot" 
        style={imageStyle}
      />
      <button 
        onClick={() => navigate('/knowledge-map')}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Knowledge Map
      </button>
    </div>
  );
}

export default GradesPage;