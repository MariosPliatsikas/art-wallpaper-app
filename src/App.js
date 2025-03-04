import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useArtwork from './useArtwork';  // Εισαγωγή ως default export
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import TrackInfo from './components/TrackInfo/TrackInfo';
import FavoritesList from './FavoritesList'; // Προσθήκη του component
import './App.css';
import { useNavigate } from 'react-router-dom';
import config from './config';
import { saveFavorite, getFavorites, clearFavorites } from './database'; // Προσθήκη της λειτουργίας εκκαθάρισης

function App() {
  const artwork = useArtwork();
  const [hideText] = useState(false);
  const [showText, setShowText] = useState(false); // Αρχικά false, θα εμφανιστεί μετά από 15 δευτερόλεπτα
  const [track, setTrack] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); // Κατάσταση για την εμφάνιση της λίστας αγαπημένων
  const [selectedArtwork, setSelectedArtwork] = useState(null); // Κατάσταση για το επιλεγμένο έργο τέχνης
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
    saveFavorite(item); // Αποθήκευση του αγαπημένου στη βάση δεδομένων
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setFavorites(getFavorites()); // Ανάκτηση των αγαπημένων από τη βάση δεδομένων
    }
  };

  const handleSelectFavorite = (item) => {
    setSelectedArtwork(item);
    setShowFavorites(false); // Απόκρυψη της λίστας αγαπημένων
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setFavorites([]);
  };

  const artworkToShow = selectedArtwork || artwork;

  if (!artworkToShow) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${artworkToShow.primaryImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}
      onClick={handleTextClick}
    >
      {!hideText && <MemoizedArtworkInfo artwork={artworkToShow} />}
      {showText && <FloatingText title={artworkToShow.title} date={artworkToShow.objectDate} />}
      {track && <TrackInfo track={track} />}
      <button className="favorite-button" onClick={() => addToFavorites(artworkToShow)}>❤️</button>
      <button className="show-favorites-button" onClick={toggleFavorites}>Show Favorites</button>
      {showFavorites && <FavoritesList favorites={favorites} onSelectFavorite={handleSelectFavorite} onClearFavorites={handleClearFavorites} />}
    </div>
  );
}

export default App;
