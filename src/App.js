
import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';
import { useNavigate } from 'react-router-dom'; // Προσθέστε την βιβλιοθήκη για ανακατεύθυνση

function App() {
  const artwork = useArtwork();
  const [hideText, setHideText] = useState(false);
  const [showText, setShowText] = useState(true); // Νέα κατάσταση για την εμφάνιση του τίτλου και της ημερομηνίας
  const navigate = useNavigate(); // Δημιουργία ιστορικού για ανακατεύθυνση

  useEffect(() => {
    if (showText) {
      const timeout = setTimeout(() => {
        setShowText(false);
      }, 10000); // Απόκρυψη μετά από 10 δευτερόλεπτα

      return () => clearTimeout(timeout);
    }
  }, [showText]);

  useEffect(() => {
    if (!artwork) {
      navigate('/next-page'); // Ανακατεύθυνση στην επόμενη σελίδα αν δεν υπάρχει έργο
    }
  }, [artwork, navigate]);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  const MemoizedArtworkInfo = React.memo(ArtworkInfo);

  const handleTextClick = () => {
    setShowText(true);
  };

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${artwork.primaryImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain', // Εφαρμογή ζουμ
      }}
      onClick={handleTextClick} // Προσθήκη χειριστή κλικ
    >
      {!hideText && <MemoizedArtworkInfo artwork={artwork} />}
      {showText && (
        <div className="floating-text">
          <h1>{artwork.title}</h1>
          <p>{artwork.objectDate}</p>
        </div>
      )}
    </div>
  );
}

export default App;