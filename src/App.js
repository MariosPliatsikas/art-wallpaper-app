import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';
import { useHistory } from 'react-router-dom'; // Προσθέστε την βιβλιοθήκη για ανακατεύθυνση

function App() {
  const artwork = useArtwork();
  const [backgroundPositionX, setBackgroundPositionX] = useState('50%');
  const [intervalTime, setIntervalTime] = useState(30000); // Αυξήστε το διάστημα για λιγότερες ενημερώσεις
  const [hideText, setHideText] = useState(false);
  const history = useHistory(); // Δημιουργία ιστορικού για ανακατεύθυνση

  useEffect(() => {
    const interval = setInterval(() => {
      const newPositionX = Math.random() * 100;
      setBackgroundPositionX(`${newPositionX}%`);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime]);

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
      history.push('/next-page'); // Ανακατεύθυνση στην επόμενη σελίδα αν δεν υπάρχει έργο
    }
  }, [artwork, history]);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  const MemoizedArtworkInfo = React.memo(ArtworkInfo);

  return (
    <div className="App" style={{ backgroundImage: `url(${artwork.primaryImage})`, backgroundPosition: `${backgroundPositionX} center`, backgroundSize: 'contain' }}>
      {!hideText && <MemoizedArtworkInfo artwork={artwork} />}
      <div className="bottom-right">
        <h1>{artwork.title}</h1>
        <p>{artwork.objectDate}</p>
      </div>
    </div>
  );
}

export default App;