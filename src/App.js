import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useArtwork from './useArtwork'; // Importing as default export
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import FavoritesList from './FavoritesList'; // Adding the FavoritesList component
import './App.css';
import { useNavigate } from 'react-router-dom';
import config from './config';
import { saveFavorite, getFavorites, clearFavorites } from './database'; // Adding clearFavorites functionality
// eslint-disable-next-line no-unused-vars
import TrackInfo from './components/TrackInfo/TrackInfo';

function App() {
  const artwork = useArtwork();
  const [hideText] = useState(false);
  const [showText, setShowText] = useState(false); // Initially false, will show after 15 seconds
  const [track, setTrack] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); // State for showing the favorites list
  const [selectedArtwork, setSelectedArtwork] = useState(null); // State for the selected artwork
  const [showTrackInfo, setShowTrackInfo] = useState(true);
  const navigate = useNavigate();

  // Timer to show text (15 seconds)
  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 15000);

    return () => clearTimeout(textTimer);
  }, []);

  // Timer to hide text (10 seconds after showing)
  useEffect(() => {
    if (showText) {
      const hideTimer = setTimeout(() => {
        setShowText(false);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }
  }, [showText]);

  // Redirect if no artwork is available
  useEffect(() => {
    if (!artwork) {
      navigate('/next-page');
    }
  }, [artwork, navigate]);

  // Fetch track data from ListenBrainz
  useEffect(() => {
    fetch('https://api.listenbrainz.org/1/user/MariosPls/listens', {
      headers: {
        'Authorization': `Bearer ${config.MUSIC_API_TOKEN}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Listens:', data);
        if (data.payload && data.payload.listens && data.payload.listens.length > 0) {
          setTrack(data.payload.listens[0].track_metadata); // Set the first track
        } else {
          console.warn('No listens found in the response');
          setTrack(null); // No track available
        }
      })
      .catch((error) => {
        console.error('Error fetching listens:', error);
        setTrack(null); // Fallback: No track available
      });
  }, []);

  useEffect(() => {
    console.log('Track state:', track);
  }, [track]);

  const MemoizedArtworkInfo = useMemo(() => React.memo(ArtworkInfo), []);

  const handleTextClick = useCallback(() => {
    setShowText(true); // Show text when the user clicks
  }, []);

  const addToFavorites = (item) => {
    setFavorites([...favorites, item]);
    saveFavorite(item); // Save the favorite to the database
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setFavorites(getFavorites()); // Retrieve favorites from the database
    }
  };

  const handleSelectFavorite = (item) => {
    setSelectedArtwork(item);
    setShowFavorites(false); // Hide the favorites list
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setFavorites([]);
  };

  const artworkToShow = selectedArtwork || artwork;

  useEffect(() => {
    let hideButtonsTimeout;

    const showButtons = () => {
      document.body.classList.remove('hidden-buttons');
      clearTimeout(hideButtonsTimeout);
      hideButtonsTimeout = setTimeout(() => {
        document.body.classList.add('hidden-buttons');
      }, 5000); // Hide buttons after 5 seconds
    };

    // Add event listeners for mouse movement and touch
    window.addEventListener('mousemove', showButtons);
    window.addEventListener('touchstart', showButtons);

    // Start the initial timeout
    hideButtonsTimeout = setTimeout(() => {
      document.body.classList.add('hidden-buttons');
    }, 5000);

    return () => {
      // Cleanup event listeners and timeout
      window.removeEventListener('mousemove', showButtons);
      window.removeEventListener('touchstart', showButtons);
      clearTimeout(hideButtonsTimeout);
    };
  }, []);

  useEffect(() => {
    let hideTimeout;

    const showTrackInfoHandler = () => {
      // Εμφάνιση του track-info μόνο αν είναι κρυφό
      if (!showTrackInfo) {
        setShowTrackInfo(true);
      }

      // Επανεκκίνηση του χρονόμετρου για να κρυφτεί μετά από 5 δευτερόλεπτα
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setShowTrackInfo(false);
      }, 5000);
    };

    // Προσθήκη event listeners για κίνηση κέρσορα και αφή
    window.addEventListener('mousemove', showTrackInfoHandler);
    window.addEventListener('touchstart', showTrackInfoHandler);

    return () => {
      // Καθαρισμός του χρονόμετρου και των event listeners
      clearTimeout(hideTimeout);
      window.removeEventListener('mousemove', showTrackInfoHandler);
      window.removeEventListener('touchstart', showTrackInfoHandler);
    };
  }, [showTrackInfo]);

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
      {showTrackInfo && track ? (
        <div className="track-info">
          <h3>Now Playing:</h3>
          <p><strong>Track:</strong> {track.track_name || 'Unknown Track'}</p>
          <p><strong>Artist:</strong> {track.artist_name || 'Unknown Artist'}</p>
          <p><strong>Source:</strong> {track.additional_info?.music_service_name || 'Unknown Source'}</p>
          <a href={track.additional_info?.origin_url} target="_blank" rel="noopener noreferrer">
            Listen Here
          </a>
        </div>
      ) : showTrackInfo && (
        <div className="track-info">
          No music data available.
        </div>
      )}
      <button className="favorite-button" onClick={() => addToFavorites(artworkToShow)}>❤️</button>
      <button className="show-favorites-button" onClick={toggleFavorites}>Show Favorites</button>
      {showFavorites && (
        <FavoritesList
          favorites={favorites}
          onSelectFavorite={handleSelectFavorite}
          onClearFavorites={handleClearFavorites}
        />
      )}
    </div>
  );
}

export default App;
