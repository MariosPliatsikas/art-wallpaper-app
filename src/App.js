import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';

function App() {
  const artwork = useArtwork();
  const [zoom, setZoom] = useState(1);
  const [backgroundPosition, setBackgroundPosition] = useState('center');
  const [intervalTime, setIntervalTime] = useState(15000); // default interval time
  const [showSettings, setShowSettings] = useState(false);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newZoom = Math.random() * 2 + 1; // Τυχαίο zoom μεταξύ 1 και 3
      const newPositionX = Math.random() * 100;
      const newPositionY = Math.random() * 100;
      setZoom(newZoom);
      setBackgroundPosition(`${newPositionX}% ${newPositionY}%`);
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
    <div className="App" style={{ backgroundImage: `url(${artwork.primaryImage})`, backgroundSize: `${zoom * 100}%`, backgroundPosition }}>
      <div className="header">
        <button onClick={() => setShowSettings(!showSettings)}>Ρυθμίσεις</button>
      </div>
      {showSettings && (
        <div className="settings">
          <label>
            Διάστημα Χρόνου (δευτερόλεπτα):
            <input type="number" value={intervalTime / 1000} onChange={(e) => setIntervalTime(e.target.value * 1000)} />
          </label>
          <label>
            Επίπεδο Zoom:
            <input type="number" value={zoom} onChange={(e) => setZoom(e.target.value)} />
          </label>
        </div>
      )}
      {!hideText && <ArtworkInfo artwork={artwork} />}
    </div>
  );
}

export default App;