import React, { useState } from 'react';
import './TrackInfo.css';

const TrackInfo = ({ title, artist }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false); // Κλείνει το πεδίο
  };

  if (!isVisible) return null; // Δεν εμφανίζεται αν είναι κλειστό

  return (
    <div className="track-info">
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
        onClick={handleClose}
      >
        X
      </button>
      <h3>{title}</h3>
      <p>{artist}</p>
    </div>
  );
};

export default TrackInfo;
