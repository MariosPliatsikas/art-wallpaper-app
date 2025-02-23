import React from 'react';
import './FloatingText.css';

const FloatingText = ({ text }) => {
  return (
    <div className="floating-text">
      {text}
    </div>
  );
};

export default FloatingText;
