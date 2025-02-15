import React from 'react';

function ArtworkInfo({ artwork }) {
  return (
    <div className="description">
      <p>{artwork.artistDisplayName}</p>
    </div>
  );
}

export default ArtworkInfo;