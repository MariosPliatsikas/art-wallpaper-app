
import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';
import { useNavigate } from 'react-router-dom'; // Προσθέστε την βιβλιοθήκη για ανακατεύθυνση

function App() {
  const artwork = useArtwork();
  const [backgroundPositionX, setBackgroundPositionX] = useState('50%');
  const [hideText, setHideText] = useState(false);
  const [zoom, setZoom] = useState(false); // Νέα κατάσταση για το ζουμ
  const navigate = useNavigate(); // Δημιουργία ιστορικού για ανακατεύθυνση

  useEffect(() => {
    const interval = setInterval(() => {
      const newPositionX = Math.random() * 100;
      setBackgroundPositionX(`${newPositionX}%`);

      // Ελέγξτε αν η εικόνα βρίσκεται στη μέση της οθόνης
      if (newPositionX >= 45 && newPositionX <= 55) {
        setZoom(true);
      } else {
        setZoom(false);
      }
    }, 60000); // Αυξήστε το διάστημα για πιο αργές ενημερώσεις

    return () => clearInterval(interval);
  }, []);

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
        backgroundPosition: `${backgroundPositionX} center`,
        backgroundSize: zoom ? '120%' : 'contain', // Εφαρμογή ζουμ
        transition: 'background-position 60s linear, background-size 0.5s ease', // Ομαλή μετάβαση ζουμ και θέση
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