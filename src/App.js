import React, { useEffect, useState } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';

function App() {
  const artwork = useArtwork();
  const [zoom, setZoom] = useState(1);
  const [backgroundPosition, setBackgroundPosition] = useState('center');

  useEffect(() => {
    const interval = setInterval(() => {
      const newZoom = Math.random() * 2 + 1; // Τυχαίο zoom μεταξύ 1 και 3
      const newPositionX = Math.random() * 100;
      const newPositionY = Math.random() * 100;
      setZoom(newZoom);
      setBackgroundPosition(`${newPositionX}% ${newPositionY}%`);
    }, 15000); // Αλλαγή κάθε 15 δευτερόλεπτα

    return () => clearInterval(interval);
  }, []);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${artwork.primaryImage})`, backgroundSize: `${zoom * 100}%`, backgroundPosition }}>
      <ArtworkInfo artwork={artwork} />
    </div>
  );
}

export default App;
