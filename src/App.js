
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useArtwork from './useArtwork';  // Εισαγωγή ως default export
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import TrackInfo from './components/TrackInfo/TrackInfo';
import './App.css';
import { useNavigate } from 'react-router-dom';
import config from './config';

function App() {
  const artwork = useArtwork();
  const [hideText] = useState(false);
  const [showText, setShowText] = useState(false); // Αρχικά false, θα εμφανιστεί μετά από 15 δευτερόλεπτα
  const [track, setTrack] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [showButtons, setShowButtons] = useState(true);
  const navigate = useNavigate();

  // Timer για το κείμενο (15 δευτερόλεπτα)
  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 15000);

    return () => clearTimeout(textTimer);
  }, []);

  // Timer για απόκρυψη του κειμένου (10 δευτερόλεπτα μετά την εμφάνιση)
  useEffect(() => {
    if (showText) {
      const hideTimer = setTimeout(() => {
        setShowText(false);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }
  }, [showText]);

  // Timer για απόκρυψη των κουμπιών ζουμ (10 δευτερόλεπτα μετά την εμφάνιση)
  useEffect(() => {
    const buttonsTimer = setTimeout(() => {
      setShowButtons(false);
    }, 10000);

    return () => clearTimeout(buttonsTimer);
  }, []);

  // Ανακατεύθυνση αν δεν υπάρχει έργο τέχνης
  useEffect(() => {
    if (!artwork) {
      navigate('/next-page');
    }
  }, [artwork, navigate]);

  // Αναζήτηση τραγουδιού από το ListenBrainz
  useEffect(() => {
    fetch('https://api.listenbrainz.org/1/stats/user/MariosPliatsikas/play-count', {
      headers: {
        'Authorization': `Bearer ${config.MUSIC_API_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Tracks:', data);
        if (data.play_count && data.play_count.length > 0) {
          setTrack(data.play_count[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching tracks:', error);
      });
  }, []);

  const MemoizedArtworkInfo = useMemo(() => React.memo(ArtworkInfo), []);

  const handleTextClick = useCallback(() => {
    setShowText(true); // Εμφάνιση κειμένου όταν ο χρήστης κάνει κλικ
  }, []);

  const addToFavorites = (item) => {
    setFavorites([...favorites, item]);
  };

  const zoomIn = () => setZoom(zoom + 0.1);
  const zoomOut = () => setZoom(zoom - 0.1);

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
        transform: `scale(${zoom})`,
      }}
      onClick={handleTextClick}
    >
      {!hideText && <MemoizedArtworkInfo artwork={artwork} />}
      {showText && <FloatingText title={artwork.title} date={artwork.objectDate} />}
      {track && <TrackInfo track={track} />}
      {showButtons && (
        <div className="zoom-buttons">
          <button className="zoom-button" onClick={zoomIn}>+</button>
          <button className="zoom-button" onClick={zoomOut}>-</button>
        </div>
      )}
      <button className="favorite-button" onClick={() => addToFavorites(artwork)}>❤️</button>
    </div>
  );
}

export default App;