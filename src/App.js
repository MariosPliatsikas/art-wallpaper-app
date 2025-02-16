
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useArtwork } from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const artwork = useArtwork();
  const [hideText, setHideText] = useState(false);
  const [showText, setShowText] = useState(true);
  const [track, setTrack] = useState(null); // Νέα κατάσταση για το track
  const navigate = useNavigate();

  useEffect(() => {
    if (showText) {
      const timeout = setTimeout(() => {
        setShowText(false);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [showText]);

  useEffect(() => {
    if (!artwork) {
      navigate('/next-page');
    }
  }, [artwork, navigate]);

  useEffect(() => {
    // Αναζήτηση και αναπαραγωγή ενός track από το MusicBrainz
    fetch('https://musicbrainz.org/ws/2/recording/?query=ambient&fmt=json')
      .then(response => response.json())
      .then(data => {
        console.log('Tracks:', data);
        if (data.recordings && data.recordings.length > 0) {
          setTrack(data.recordings[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching tracks:', error);
      });
  }, []);

  const MemoizedArtworkInfo = useMemo(() => React.memo(ArtworkInfo), []);

  const handleTextClick = useCallback(() => {
    setShowText(true);
  }, []);

  if (!artwork) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${artwork.primaryImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}
      onClick={handleTextClick}
    >
      {!hideText && <MemoizedArtworkInfo artwork={artwork} />}
      {showText && (
        <div className="floating-text">
          <h1>{artwork.title}</h1>
          <p>{artwork.objectDate}</p>
        </div>
      )}
      {track && (
        <div className="track-info">
          <p>Now playing: {track.title}</p>
        </div>
      )}
    </div>
  );
}

export default App;