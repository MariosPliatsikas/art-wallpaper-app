import React from 'react';

function ArtworkInfo({ artwork }) {
  if (!artwork) {
    return null; // Αν δεν υπάρχει έργο τέχνης, μην εμφανίσεις τίποτα
  }

  return (
    <div className="artwork-info">
      {artwork.artistDisplayName && (
        <p className="artist-name">{artwork.artistDisplayName}</p>
      )}
      {artwork.title && (
        <p className="artwork-title">{artwork.title}</p>
      )}
      {artwork.objectDate && (
        <p className="artwork-date">{artwork.objectDate}</p>
      )}
      {artwork.medium && (
        <p className="artwork-medium">{artwork.medium}</p>
      )}
    </div>
  );
}

export default React.memo(ArtworkInfo); // Χρησιμοποιήστε React.memo για βελτίωση απόδοσης
