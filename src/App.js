import React, { useCallback, useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import useArtwork from './useArtwork';
import { getMuseumOptions } from './services/museums/museumRegistry';
import { getFavorites, saveFavorite } from './database';
import './App.css';

const groups = [
  ['Museum', 'museum', null],
  ['Period', 'period', ['Pre-1600', '1600-1800', '1800-1900', '1900-Present']],
  ['Movement', 'movement', ['Renaissance', 'Baroque', 'Impressionism', 'Modernism']],
  ['Type', 'type', ['Painting', 'Sculpture', 'Photography']],
];

function App() {
  const [category, setCategory] = useState('random');
  const [filter, setFilter] = useState('');
  const [paused, setPaused] = useState(false);
  const [panel, setPanel] = useState('');
  const [zoom, setZoom] = useState(false);
  const [visible, setVisible] = useState(true);
  const [favorites, setFavorites] = useState(getFavorites);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState('');
  const { artwork, loading, error, refresh, secondsRemaining } = useArtwork(category, filter, paused || zoom || Boolean(panel) || Boolean(selected));
  const current = selected || artwork;
  const viewerRef = useRef(null);
  const stageRef = useRef(null);
  const timer = useRef(null);
  const touch = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const pinchUntilRef = useRef(0);
  const showControls = useCallback(() => {
    if (Date.now() < pinchUntilRef.current) return;
    document.querySelector('.museum-app')?.classList.remove('gesture-clean');
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 5000);
  }, []);
  useEffect(() => { showControls(); return () => clearTimeout(timer.current); }, [showControls]);
  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(id);
  }, [notice]);
  const closePanel = useCallback(() => { setPanel(''); showControls(); }, [showControls]);
  useEffect(() => {
    if (!panel) return undefined;
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('button')?.focus();
    return () => { document.body.style.overflow = previousOverflow; triggerRef.current?.focus(); };
  }, [panel]);
  useEffect(() => {
    if (!zoom || !current?.primaryImage) return undefined;
    const viewer = OpenSeadragon({
      element: stageRef.current, showNavigationControl: false, zoomPerScroll: 1.05,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
      gestureSettingsTouch: { pinchToZoom: true, dragToPan: true },
      tileSources: { type: 'image', url: current.primaryImage },
    });
    viewerRef.current = viewer;
    return () => { viewer.destroy(); viewerRef.current = null; };
  }, [zoom, current?.primaryImage]);
  const next = useCallback(() => { setSelected(null); refresh(); showControls(); }, [refresh, showControls]);
  const closeZoom = useCallback(() => { setZoom(false); showControls(); }, [showControls]);
  function keyboard(event) {
    if (event.key === 'Escape') { closePanel(); closeZoom(); }
    if (panel && event.key === 'Tab') {
      const items = [...panelRef.current.querySelectorAll('button, a[href]')];
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'ArrowRight' && !panel && !zoom && event.target === event.currentTarget) next();
  }
  const favorite = current && favorites.some(item => item.primaryImage === current.primaryImage);
  function toggleFavorite() {
    if (!current) return;
    try {
      if (favorite) {
        const updated = favorites.filter(item => item.primaryImage !== current.primaryImage);
        localStorage.setItem('favorites', JSON.stringify(updated)); setFavorites(updated);
        setNotice('Removed from your collection');
      } else { saveFavorite(current); setFavorites(getFavorites()); setNotice('Saved to your collection'); }
    } catch { setNotice('Could not save. Check browser storage settings.'); }
  }
  const controlsVisible = visible || Boolean(panel);
  return (
    <main className={`museum-app ${controlsVisible ? 'controls-visible' : ''} ${zoom ? 'zoom-active' : ''}`}
      tabIndex={-1} onKeyDown={keyboard} onMouseMove={showControls}
      onTouchStartCapture={e => {
        if (e.touches.length < 2) return;
        pinchUntilRef.current = Date.now() + 1200;
        clearTimeout(timer.current);
        touch.current = null;
        setVisible(false);
        e.currentTarget.classList.add('gesture-clean');
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }}
      onTouchMoveCapture={e => {
        if (e.touches.length > 1) {
          pinchUntilRef.current = Date.now() + 1200;
        }
      }}>
      <div className="art-stage" role="button" tabIndex={0} aria-label="Show artwork controls"
        onClick={showControls} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showControls(); } }}
        onTouchStart={e => { touch.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; if (e.touches.length > 1) setVisible(false); }}
        onTouchEnd={e => { if (!touch.current || zoom || panel) return; const point = e.changedTouches[0]; const dx = point.clientX - touch.current.x; const dy = point.clientY - touch.current.y; touch.current = null; if (dx < -85 && Math.abs(dy) < 55) next(); else showControls(); }}>
        {current?.primaryImage && <img className="hero-art" src={current.primaryImage} alt={current.title || 'Museum artwork'} draggable="false" onError={() => setNotice('This image could not load. Try the next artwork.')} />}
      </div>
      {!zoom && <>
        <header className="museum-header auto-hide">
          <div className="wordmark"><span className="brand-symbol" aria-hidden="true">◒</span><div>ART WALLPAPER<small>A quiet place for art</small></div></div>
          <button className="collection-button" onClick={() => setPanel('collection')}>Collection <span>{favorites.length}</span></button>
        </header>
        <div className="art-caption auto-hide"><span>{current?.source || 'YOUR PERSONAL MUSEUM'}</span><h1>{current?.title || 'A moment for art'}</h1><p>{current?.artistDisplayName || ''}{current?.objectDate ? ` · ${current.objectDate}` : ''}</p></div>
        <div className="playback auto-hide"><button aria-label={paused ? 'Resume automatic rotation' : 'Pause automatic rotation'} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? '▶' : 'Ⅱ'}</button><div>{paused ? 'Stay with this artwork' : selected ? 'From your collection' : panel ? 'Take your time' : `Next artwork in ${Math.floor((secondsRemaining ?? 600) / 60)}:${String((secondsRemaining ?? 600) % 60).padStart(2, '0')}`}<small>{paused ? 'Automatic rotation paused' : 'A new perspective, every 10 minutes'}</small></div></div>
        <nav className="control-dock auto-hide" aria-label="Artwork controls" onFocus={showControls}>
          <button aria-expanded={panel === 'explore'} onClick={() => setPanel('explore')}><span aria-hidden="true">⌘</span>Explore</button>
          <button aria-expanded={panel === 'info'} onClick={() => setPanel('info')}><span aria-hidden="true">ⓘ</span>Details</button>
          <button aria-pressed={Boolean(favorite)} disabled={!current} onClick={toggleFavorite}><span aria-hidden="true">{favorite ? '♥' : '♡'}</span>{favorite ? 'Saved' : 'Save'}</button>
          <button className="zoom-button" disabled={!current} onClick={() => setZoom(true)}><span aria-hidden="true">⤢</span>Zoom</button>
          <span className="dock-divider" />
          <button className="next-button" disabled={loading} onClick={next}><span aria-hidden="true">→</span>Next</button>
        </nav>
      </>}
      {loading && <div className="loading-pill" role="status">Finding your next artwork…</div>}
      {error && !zoom && <div className="error-card" role="alert"><p>{error}</p><button onClick={next}>Try again</button><button onClick={() => setPanel('explore')}>Choose a museum</button></div>}
      {notice && <div className="toast" role="status">{notice}</div>}
      {zoom && <section className="zoom-layer" aria-label="Artwork magnification"><div id="openseadragon-canvas" ref={stageRef} /><div className="zoom-tools"><button onClick={() => viewerRef.current?.viewport.goHome()}>Reset view</button><button className="exit-canvas-button" onClick={closeZoom}>Exit zoom ×</button></div></section>}
      {panel && !zoom && <div className="panel-backdrop" onClick={closePanel}>
        <section className="museum-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" ref={panelRef} onClick={e => e.stopPropagation()}>
          <div className="panel-heading"><div><span className="eyebrow">ART WALLPAPER MUSEUM</span><h2 id="panel-title">{panel === 'explore' ? 'Follow your curiosity' : panel === 'info' ? 'Behind the artwork' : 'Your collection'}</h2></div><button aria-label="Close panel" onClick={closePanel}>×</button></div>
          {panel === 'explore' && <><p className="panel-intro">Choose one lens for your next discovery.</p><button className={`filter-chip ${category === 'random' ? 'selected' : ''}`} onClick={() => { setCategory('random'); setFilter(''); setSelected(null); closePanel(); }}>Surprise me · All museums</button>{groups.map(([label, key, options]) => <section className="filter-group" key={key}><h3>{label}</h3><div className="filter-options">{(options || getMuseumOptions().map(x => x.name)).map(option => <button className={`filter-chip ${category === key && filter === option ? 'selected' : ''}`} aria-pressed={category === key && filter === option} key={option} onClick={() => { setCategory(key); setFilter(option); setSelected(null); if (category === key && filter === option) refresh(); closePanel(); }}>{option}</button>)}</div></section>)}</>}
          {panel === 'info' && current && <><p className="eyebrow source-label">{current.source}</p><h3 className="detail-title">{current.title}</h3><p className="detail-artist">{current.artistDisplayName}</p><dl>{[['Date', current.objectDate], ['Medium', current.medium], ['Dimensions', current.dimensions], ['Credit', current.creditLine], ['Rights', current.license]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{current.sourceUrl && /^https?:\/\//i.test(current.sourceUrl) && <a className="museum-link" href={current.sourceUrl} target="_blank" rel="noopener noreferrer">View at the museum ↗</a>}</>}
          {panel === 'collection' && <>{!favorites.length ? <p className="empty-collection">Keep what moves you.<small>Tap Save on an artwork to find it here.</small></p> : <div className="collection-grid">{favorites.map((item, index) => <button key={`${item.primaryImage}-${index}`} onClick={() => { setSelected(item); closePanel(); }}><img src={item.primaryImage} alt="" loading="lazy" /><strong>{item.title}</strong><small>{item.artistDisplayName}</small></button>)}</div>}</>}
        </section>
      </div>}
    </main>
  );
}
export default App;
