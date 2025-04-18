import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useArtwork from './useArtwork'; // Importing as default export
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import FavoritesList from './FavoritesList'; // Adding the FavoritesList component
import RefreshButton from './components/RefreshButton'; // Importing the RefreshButton component
import './App.css';
import { useNavigate } from 'react-router-dom';
import config from './config';
import { saveFavorite, getFavorites, clearFavorites } from './database'; // Adding clearFavorites functionality
import OpenSeadragon from 'openseadragon';

function App() {
  const artwork = useArtwork();
  const [hideText] = useState(false);
  const [showText, setShowText] = useState(false); // Initially false, will show after 15 seconds
  const [track, setTrack] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false); // State for showing the favorites list
  const [selectedArtwork, setSelectedArtwork] = useState(null); // State for the selected artwork
  const [hideButtons, setHideButtons] = useState(false); // State for hiding buttons
  const [showFallback, setShowFallback] = useState(false); // State for fallback display
  const [showCanvas, setShowCanvas] = useState(false); // State για την εμφάνιση του canvas
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
    const fetchTrackData = async () => {
      try {
        const response = await fetch('https://api.listenbrainz.org/1/user/MariosPls/listens', {
          headers: {
            'Authorization': `Bearer ${config.MUSIC_API_TOKEN}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.payload && data.payload.listens && data.payload.listens.length > 0) {
          setTrack(data.payload.listens[0].track_metadata); // Set the first track
        } else {
          console.warn('No listens found in the response');
          setTrack(null); // No track available
        }
      } catch (error) {
        console.error("Σφάλμα κατά τη λήψη του έργου τέχνης:", error);
        setTrack(null); // Fallback: No track available
      }
    };

    fetchTrackData();
  }, []);

  useEffect(() => {
    // console.log('Track state:', track);
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
    setShowCanvas(true); // Εμφάνιση του canvas
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setFavorites([]);
  };

  const handleExitCanvas = () => {
    setShowCanvas(false); // Απόκρυψη του canvas
  };

  const artworkToShow = selectedArtwork || artwork;

  useEffect(() => {
    let hideButtonsTimeout;

    const showButtons = () => {
      setHideButtons(false); // Εμφάνιση κουμπιών
      clearTimeout(hideButtonsTimeout); // Καθαρισμός του προηγούμενου timeout
      hideButtonsTimeout = setTimeout(() => {
        setHideButtons(true); // Απόκρυψη κουμπιών μετά από 5 δευτερόλεπτα
      }, 5000);
    };

    // Προσθήκη event listeners
    window.addEventListener('mousemove', showButtons);
    window.addEventListener('touchstart', showButtons);

    // Αρχικό timeout για απόκρυψη
    hideButtonsTimeout = setTimeout(() => {
      setHideButtons(true);
    }, 5000);

    return () => {
      // Καθαρισμός event listeners και timeout
      window.removeEventListener('mousemove', showButtons);
      window.removeEventListener('touchstart', showButtons);
      clearTimeout(hideButtonsTimeout);
    };
  }, []);

  useEffect(() => {
    if (!artworkToShow || !artworkToShow.primaryImage) {
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 7000); // 7 δευτερόλεπτα

      return () => clearTimeout(timer); // Καθαρισμός του timer όταν το component αποσυνδέεται
    } else {
      setShowFallback(false); // Επαναφορά αν υπάρχει artwork
    }
  }, [artworkToShow]);

  useEffect(() => {
    if (showCanvas) {
      const viewer = OpenSeadragon({
        id: 'openseadragon-canvas',
        prefixUrl: '/node_modules/openseadragon/images/', // Ενημερώστε τη διαδρομή αν χρειάζεται
        tileSources: {
          type: 'image',
          url: selectedArtwork?.primaryImage, // Το URL της εικόνας
        },
      });

      console.log('OpenSeadragon initialized');

      return () => {
        viewer.destroy(); // Καθαρισμός όταν το component αποσυνδέεται
      };
    }
  }, [showCanvas, selectedArtwork]);

  if (!artworkToShow || !artworkToShow.primaryImage) {
    if (!showFallback) {
      return null; // Μην εμφανίζετε τίποτα πριν περάσουν τα 7 δευτερόλεπτα
    }

    return (
      <div className="fallback">
        <p>No artwork available. Please try refreshing the page.</p>
        <RefreshButton />
      </div>
    );
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
      
      {/* Κουμπιά σε σειρά */}
      <div className="button-container">
        <button
          className={hideButtons ? 'hidden' : 'visible'}
          onClick={() => addToFavorites(artworkToShow)}
        >
          ❤️ Favorite
        </button>
        <button
          className={hideButtons ? 'hidden' : 'visible'}
          onClick={toggleFavorites}
        >
          Show Favorites
        </button>
      </div>

      {showFavorites && (
        <FavoritesList
          favorites={favorites}
          onSelectFavorite={handleSelectFavorite}
          onClearFavorites={handleClearFavorites}
        />
      )}

      {/* Εμφάνιση του OpenSeadragon Canvas */}
      {showCanvas && (
        <>
          <div
            id="openseadragon-canvas"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          ></div>
          <button
            onClick={handleExitCanvas}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1000, // Βεβαιωθείτε ότι το κουμπί εμφανίζεται πάνω από το canvas
              padding: '10px 20px',
              backgroundColor: '#ff4d4d',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Exit
          </button>
        </>
      )}

      <RefreshButton className="refresh-button" hidden={hideButtons} />
    </div>
  );
}

export default App;
