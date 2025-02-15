import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';

function App() {
  const artwork = useArtwork();
  const [backgroundPositionX, setBackgroundPositionX] = useState('50%');
  const [intervalTime, setIntervalTime] = useState(15000); // default interval time
  const [showSettings, setShowSettings] = useState(false);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPositionX = Math.random() * 100;
      setBackgroundPositionX(`${newPositionX}%`);
    }, intervalTime); // Χρήση του προσαρμοσμένου διαστήματος

    return () => clearInterval(interval);
  }, [intervalTime]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHideText(true);
    }, 15000); // Απόκρυψη μετά από 15 δευτερόλεπτα

    return () => clearTimeout(timeout);
  }, []);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${artwork.primaryImage})`, backgroundPosition: `${backgroundPositionX} center`, backgroundSize: 'contain' }}>
      <div className="header">
        <button onClick={() => setShowSettings(!showSettings)}>Ρυθμίσεις</button>
      </div>
      {showSettings && (
        <div className="settings">
          <label>
            Διάστημα Χρόνου (δευτερόλεπτα):
            <input type="number" value={intervalTime / 1000} onChange={(e) => setIntervalTime(e.target.value * 1000)} />
          </label>
        </div>
      )}
      {!hideText && <ArtworkInfo artwork={artwork} />}
      <div className="bottom-right">
        <h1>{artwork.title}</h1>
        <p>{artwork.objectDate}</p>
      </div>
    </div>
  );
}

export default App;