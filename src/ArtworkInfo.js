import React from 'react';

function ArtworkInfo({ artwork }) {
  return (
    <div className="description">
      <h1>{artwork.title}</h1>
      <p>{artwork.artistDisplayName}</p>
      <p>{artwork.objectDate}</p>
    </div>
  );
}

export default ArtworkInfo;