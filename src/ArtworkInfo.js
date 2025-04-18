import React from 'react';

function ArtworkInfo({ artwork }) {
  if (!artwork) {
    return null; // Αν δεν υπάρχει έργο τέχνης, μην εμφανίσεις τίποτα
  }

  const generateGoogleSearchLink = (title) => {
    const query = encodeURIComponent(`${title} museum`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="artwork-info">
      {artwork.artistDisplayName && (
        <p className="artist-name"><strong>Artist:</strong> {artwork.artistDisplayName}</p>
      )}
      {artwork.title && (
        <p className="artwork-title">
          <strong>Title:</strong>{' '}
          <a 
            href={generateGoogleSearchLink(artwork.title)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="google-search-link"
          >
            {artwork.title}
          </a>
        </p>
      )}
      {artwork.objectDate && (
        <p className="artwork-date"><strong>Date:</strong> {artwork.objectDate}</p>
      )}
      {artwork.medium && (
        <p className="artwork-medium"><strong>Medium:</strong> {artwork.medium}</p>
      )}
      {artwork.dimensions && (
        <p className="artwork-dimensions"><strong>Dimensions:</strong> {artwork.dimensions}</p>
      )}
      {artwork.creditLine && (
        <p className="artwork-credit-line"><strong>Credit Line:</strong> {artwork.creditLine}</p>
      )}
      {artwork.source && (
        <p className="artwork-source"><strong>Source:</strong> {artwork.source}</p>
      )}
      {artwork.additionalDetails && (
        <p className="artwork-additional-details"><strong>Details:</strong> {artwork.additionalDetails}</p>
      )}
    </div>
  );
}

export default React.memo(ArtworkInfo); // Χρησιμοποιήστε React.memo για βελτίωση απόδοσης
