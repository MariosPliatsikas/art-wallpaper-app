
import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';
import { useNavigate } from 'react-router-dom'; // Προσθέστε την βιβλιοθήκη για ανακατεύθυνση

function App() {
  const artwork = useArtwork();
  const [hideText, setHideText] = useState(false);
  const navigate = useNavigate(); // Δημιουργία ιστορικού για ανακατεύθυνση

  useEffect(() => {
    if (!hideText) {
      const timeout = setTimeout(() => {
        setHideText(true);
      }, 15000); // Απόκρυψη μετά από 15 δευτερόλεπτα

      return () => clearTimeout(timeout);
    }
  }, [hideText]);

  useEffect(() => {
    if (!artwork) {
      navigate('/next-page'); // Ανακατεύθυνση στην επόμενη σελίδα αν δεν υπάρχει έργο
    }
  }, [artwork, navigate]);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  const MemoizedArtworkInfo = React.memo(ArtworkInfo);

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${artwork.primaryImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain', // Εφαρμογή ζουμ
      }}
    >
      {!hideText && <MemoizedArtworkInfo artwork={artwork} />}
      <div className="floating-text">
        <h1>{artwork.title}</h1>
        <p>{artwork.objectDate}</p>
      </div>
    </div>
  );
}

export default App;