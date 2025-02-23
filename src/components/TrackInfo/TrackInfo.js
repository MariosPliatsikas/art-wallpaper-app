import React from 'react';
import './TrackInfo.css';

const TrackInfo = ({ title, artist }) => {
  return (
    <div className="track-info">
      <h3>{title}</h3>
      <p>{artist}</p>
    </div>
  );
};

export default TrackInfo;
