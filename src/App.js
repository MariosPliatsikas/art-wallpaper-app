import React, { useEffect, useState } from 'react';
import { fetchArtwork } from './api';
import './App.css';

function App() {
  const [artwork, setArtwork] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [backgroundPosition, setBackgroundPosition] = useState('center');

  useEffect(() => {
    async function getArtwork() {
      const painting = await fetchArtwork();
      setArtwork(painting);
    }
    getArtwork();

    const interval = setInterval(() => {
      getArtwork();
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newZoom = Math.random() * 2 + 1; // Random zoom between 1 and 3
      const newPositionX = Math.random() * 100;
      const newPositionY = Math.random() * 100;
      setZoom(newZoom);
      setBackgroundPosition(`${newPositionX}% ${newPositionY}%`);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, []);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${artwork.primaryImage})`, backgroundSize: `${zoom * 100}%`, backgroundPosition }}>
      <div className="description">
        <h1>{artwork.title}</h1>
        <p>{artwork.artistDisplayName}</p>
        <p>{artwork.objectDate}</p>
      </div>
    </div>
  );
}

export default App;
