import React, { useEffect, useRef, useState, useCallback } from 'react';
import useArtwork from './useArtwork';
import ArtworkInfo from './ArtworkInfo';
import FloatingText from './components/FloatingText/FloatingText';
import FavoritesList from './FavoritesList';
import RefreshButton from './components/RefreshButton';
import CategoryMenu from './components/CategoryMenu';
import { saveFavorite, getFavorites, clearFavorites } from './database';
import OpenSeadragon from 'openseadragon';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const { artwork, loading, error, refresh } = useArtwork(selectedCategory, selectedSubcategory);
  const [showText, setShowText] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [zoomArtwork, setZoomArtwork] = useState(null);
  const [hideButtons, setHideButtons] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [artworkInfoVisible, setArtworkInfoVisible] = useState(false);
  const artworkInfoTimerRef = useRef(null);
  const pendingWheelDeltaRef = useRef(0);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 15000);
    const hideTextTimer = showText ? setTimeout(() => setShowText(false), 10000) : null;

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

  useEffect(() => () => clearTimeout(artworkInfoTimerRef.current), []);

  useEffect(() => {
    if (showCanvas && zoomArtwork?.primaryImage) {
      const viewer = OpenSeadragon({
        id: 'openseadragon-canvas',
        prefixUrl: '/node_modules/openseadragon/images/',
        tileSources: { type: 'image', url: zoomArtwork.primaryImage },
      });

      viewer.addOnceHandler('open', () => {
        const delta = pendingWheelDeltaRef.current;
        if (delta !== 0) {
          const factor = delta < 0 ? 1.25 : 0.8;
          viewer.viewport.zoomBy(factor);
          viewer.viewport.applyConstraints();
          pendingWheelDeltaRef.current = 0;
        }
      });

      return () => viewer.destroy();
    }
  }, [showCanvas, zoomArtwork]);

  const isArtworkFirstMode = useCallback(() => {
    const desktop = window.matchMedia('(min-width: 769px) and (pointer: fine)').matches;
    const mobileLandscape = window.matchMedia(
      '(orientation: landscape) and (max-height: 500px) and (pointer: coarse)'
    ).matches;
    return desktop || mobileLandscape;
  }, []);

  const isDesktop = useCallback(() => {
    return window.matchMedia('(min-width: 769px) and (pointer: fine)').matches;
  }, []);

  const handleArtworkInteraction = useCallback((event) => {
    if (!isArtworkFirstMode() || showCanvas) return;
    if (event.target.closest('button, a, .category-menu, .favorites-list')) return;

    clearTimeout(artworkInfoTimerRef.current);
    setArtworkInfoVisible((visible) => {
      const nextVisible = !visible;
      if (nextVisible) {
        artworkInfoTimerRef.current = setTimeout(() => setArtworkInfoVisible(false), 7000);
      }
      return nextVisible;
    });
  }, [isArtworkFirstMode, showCanvas]);

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
    setZoomArtwork(item);
    setShowFavorites(false);
    setShowCanvas(true);
  }, []);

  const handleClearFavorites = useCallback(() => {
    clearFavorites();
    setFavorites([]);
  }, []);

  const handleExitCanvas = useCallback(() => {
    setShowCanvas(false);
    setZoomArtwork(null);
    pendingWheelDeltaRef.current = 0;
  }, []);

  const handleCategorySelect = useCallback((category, subcategory) => {
    setSelectedArtwork(null);
    setArtworkInfoVisible(false);
    clearTimeout(artworkInfoTimerRef.current);
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  }, []);

  const artworkToShow = selectedArtwork || artwork;

  const handleArtworkWheel = useCallback((event) => {
    if (!isDesktop() || showCanvas || !artworkToShow?.primaryImage) return;
    if (event.target.closest('button, a, .category-menu, .favorites-list')) return;

    event.preventDefault();
    pendingWheelDeltaRef.current = event.deltaY;
    setZoomArtwork(artworkToShow);
    setArtworkInfoVisible(false);
    clearTimeout(artworkInfoTimerRef.current);
    setShowCanvas(true);
  }, [artworkToShow, isDesktop, showCanvas]);

  if (loading) return <div className="fallback">Loading...</div>;

  if (!artworkToShow?.primaryImage) {
    return (
      <div className="fallback">
        <p>{error || 'No artwork available. Please try again.'}</p>
        <RefreshButton onRefresh={refresh} />
      </div>
    );
  }

  return (
    <div
      className={`App ${artworkInfoVisible ? 'artwork-info-visible' : ''}`}
      onClick={handleArtworkInteraction}
      onWheel={handleArtworkWheel}
      style={{
        backgroundImage: `url(${artworkToShow.primaryImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}
    >
      <div className={`app-title ${hideButtons ? 'hidden' : 'visible'}`} id="appTitle">
        Art Wallpaper Museum
      </div>
      <ArtworkInfo artwork={artworkToShow} />
      {showText && (
        <>
          <FloatingText text={artworkToShow.title} delay={15} position="center" />
          <FloatingText text={artworkToShow.objectDate} delay={16} position="bottom" />
        </>
      )}
      <CategoryMenu hidden={hideButtons} onSelectCategory={handleCategorySelect} />
      <div className="button-container">
        <button className={`favorite-button ${hideButtons ? 'hidden' : 'visible'}`} onClick={() => addToFavorites(artworkToShow)}>
          ❤️ Favorite
        </button>
        <button className={`favorites-toggle ${hideButtons ? 'hidden' : 'visible'}`} onClick={toggleFavorites}>
          Show Favorites
        </button>
      </div>
      {showFavorites && (
        <FavoritesList favorites={favorites} onSelectFavorite={handleSelectFavorite} onClearFavorites={handleClearFavorites} />
      )}
      {showCanvas && (
        <>
          <div id="openseadragon-canvas" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
          <button className="exit-canvas-button" onClick={handleExitCanvas}>Exit</button>
        </>
      )}
      <RefreshButton hidden={hideButtons} onRefresh={refresh} />
    </div>
  );
}

export default App;
