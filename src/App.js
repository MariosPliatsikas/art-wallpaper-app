
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useArtwork from './useArtwork'; 
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import TrackInfo from './components/TrackInfo/TrackInfo';
import FavoritesList from './FavoritesList';
import { useNavigate } from 'react-router-dom';
import config from './config';
import { saveFavorite, getFavorites, clearFavorites } from './database'; 
import './App.css';

function App() {
  const artwork = useArtwork();
  const [hideText] = useState(false);
  const [showText, setShowText] = useState(false);
  const [track, setTrack] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 15000);

    return () => clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    if (showText) {
      const hideTimer = setTimeout(() => {
        setShowText(false);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }
  }, [showText]);

  useEffect(() => {
    if (!artwork) {
      navigate('/next-page');
    }
  }, [artwork, navigate]);

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
    setShowText(true);
  }, []);

  const addToFavorites = (item) => {
    setFavorites([...favorites, item]);
    saveFavorite(item);
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setFavorites(getFavorites());
    }
  };

  const handleSelectFavorite = (item) => {
    setSelectedArtwork(item);
    setShowFavorites(false);
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
      <button className="museum-button" onClick={() => navigate('/rijksmuseum')}>🔍 Explore Rijksmuseum</button>
      {showFavorites && <FavoritesList favorites={favorites} onSelectFavorite={handleSelectFavorite} onClearFavorites={handleClearFavorites} />}
    </div>
  );
}

export default App;
