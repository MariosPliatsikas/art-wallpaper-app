
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useArtwork from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import FavoritesList from './FavoritesList';
import RefreshButton from './components/RefreshButton';
import CategoryMenu from './components/CategoryMenu';
import { saveFavorite, getFavorites, clearFavorites } from './database';
import OpenSeadragon from 'openseadragon';
import './App.css';

/**
 * Main component of the Art Wallpaper App.
 * Displays random artworks, manages favorites, and integrates zoom functionality.
 */
function App() {
  const [selectedCategory, setSelectedCategory] = useState('type');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const { artwork, loading, error, refresh } = useArtwork(selectedCategory, selectedSubcategory);
  const [showText, setShowText] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [hideButtons, setHideButtons] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();

  // Debug artwork, loading, error, and hideButtons states
  useEffect(() => {
    console.log('useArtwork state:', { artwork, loading, error });
    console.log('hideButtons state:', hideButtons);
  }, [artwork, loading, error, hideButtons]);

  // Manage UI visibility (text and buttons)
  useEffect(() => {
    // Show text after 15 seconds
    const textTimer = setTimeout(() => setShowText(true), 15000);

    // Hide text after 10 seconds
    const hideTextTimer = showText ? setTimeout(() => setShowText(false), 10000) : null;

    // Show buttons on mouse move/touch and hide after 5 seconds
    let hideButtonsTimeout;
    const showButtons = () => {
      setHideButtons(false);
      clearTimeout(hideButtonsTimeout);
      hideButtonsTimeout = setTimeout(() => setHideButtons(true), 5000);
    };

    window.addEventListener('mousemove', showButtons);
    window.addEventListener('touchstart', showButtons);

    hideButtonsTimeout = setTimeout(() => setHideButtons(true), 5000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(hideTextTimer);
      clearTimeout(hideButtonsTimeout);
      window.removeEventListener('mousemove', showButtons);
      window.removeEventListener('touchstart', showButtons);
    };
  }, [showText]);

  // Redirect if no artwork or error
  useEffect(() => {
    if (loading) return;
    if (error && !artwork?.primaryImage) {
      console.log('Redirecting to /next-page due to:', { error, hasPrimaryImage: !!artwork?.primaryImage });
      navigate('/next-page');
    }
  }, [artwork, loading, error, navigate]);

  // Initialize OpenSeadragon for zoom
  useEffect(() => {
    if (showCanvas && selectedArtwork?.primaryImage) {
      const viewer = OpenSeadragon({
        id: 'openseadragon-canvas',
        prefixUrl: '/node_modules/openseadragon/images/',
        tileSources: { type: 'image', url: selectedArtwork.primaryImage },
      });
      return () => viewer.destroy();
    }
  }, [showCanvas, selectedArtwork]);

  // Favorites management
  const addToFavorites = useCallback((item) => {
    setFavorites((prev) => [...prev, item]);
    saveFavorite(item);
  }, []);

  const toggleFavorites = useCallback(() => {
    setShowFavorites((prev) => !prev);
    if (!showFavorites) setFavorites(getFavorites());
  }, [showFavorites]);

  const handleSelectFavorite = useCallback((item) => {
    setSelectedArtwork(item);
    setShowFavorites(false);
    setShowCanvas(true);
  }, []);

  const handleClearFavorites = useCallback(() => {
    clearFavorites();
    setFavorites([]);
  }, []);

  const handleExitCanvas = useCallback(() => {
    setShowCanvas(false);
  }, []);

  // Handle category and subcategory selection
  const handleCategorySelect = useCallback((category, subcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    refresh();
  }, [refresh]);

  const artworkToShow = selectedArtwork || artwork;

  // Fallback UI
  if (loading) {
    return <div className="fallback">Loading...</div>;
  }

  if (!artworkToShow?.primaryImage) {
    return (
      <div className="fallback">
        <p>{error || 'No artwork available. Please refresh the page.'}</p>
        <RefreshButton onRefresh={refresh} />
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
    >
      <ArtworkInfo artwork={artworkToShow} />
      {showText && (
        <>
          <FloatingText text={artworkToShow.title} delay={15} position="center" />
          <FloatingText text={artworkToShow.objectDate} delay={16} position="bottom" />
        </>
      )}
      <CategoryMenu hidden={hideButtons} onSelectCategory={handleCategorySelect} />
      <div className="button-container">
        <button
          className={`favorite-button ${hideButtons ? 'hidden' : 'visible'}`}
          onClick={() => addToFavorites(artworkToShow)}
        >
          ❤️ Favorite
        </button>
        <button
          className={`favorites-toggle ${hideButtons ? 'hidden' : 'visible'}`}
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
          />
          <button className="exit-canvas-button" onClick={handleExitCanvas}>
            Exit
          </button>
        </>
      )}
      <RefreshButton hidden={hideButtons} onRefresh={refresh} />
    </div>
  );
}

export default App;