import { useEffect, useRef, useState, useCallback } from 'react';
import getRandomArtwork from './services/museums/artworkService';
import toLegacyArtwork from './services/museums/artworkAdapter';

const defaultArtwork = {
  primaryImage: '/images/fallback-artwork.png',
  title: 'Default Artwork',
  objectDate: 'Unknown',
  artistDisplayName: 'Unknown Artist',
  medium: 'Unknown Medium',
  source: 'Fallback',
};

const museumIdByLabel = {
  'The Metropolitan Museum of Art': 'met',
  Metropolitan: 'met',
  'Cleveland Museum of Art': 'cleveland',
  Cleveland: 'cleveland',
  'Harvard Art Museums': 'harvard',
  Harvard: 'harvard',
};

const typeByLabel = {
  Painting: 'Painting',
  Sculpture: 'Sculpture',
  Photography: 'Photography',
};

const periodByLabel = {
  'Pre-1600': { dateBegin: 0, dateEnd: 1599 },
  '1600-1800': { dateBegin: 1600, dateEnd: 1800 },
  '1800-1900': { dateBegin: 1800, dateEnd: 1900 },
  '1900-Present': { dateBegin: 1900, dateEnd: new Date().getFullYear() },
};

const movements = new Set(['Renaissance', 'Baroque', 'Impressionism', 'Modernism']);

function buildArtworkRequest(query, subcategory) {
  if (query === 'random') {
    return { filters: { type: 'Painting' } };
  }

  if (query === 'museum' && museumIdByLabel[subcategory]) {
    return {
      museumId: museumIdByLabel[subcategory],
      filters: { type: 'Painting' },
    };
  }

  if (query === 'type' && typeByLabel[subcategory]) {
    return { filters: { type: typeByLabel[subcategory] } };
  }

  if (query === 'period' && periodByLabel[subcategory]) {
    return {
      filters: {
        type: 'Painting',
        ...periodByLabel[subcategory],
      },
    };
  }

  if (query === 'movement' && movements.has(subcategory)) {
    return {
      filters: {
        type: 'Painting',
        movement: subcategory,
      },
    };
  }

  return { query: subcategory || 'art' };
}

/**
 * Custom hook backed by the unified museum provider system.
 */
const useArtwork = (query = 'random', subcategory = '') => {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousArtworkIdRef = useRef(null);

  const getArtwork = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const request = buildArtworkRequest(query, subcategory);
      let normalizedArtwork = null;

      // Avoid showing the exact same artwork on consecutive refreshes when
      // the selected filter has enough alternatives. A small retry cap keeps
      // network usage bounded for narrow queries that may only have one match.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        normalizedArtwork = await getRandomArtwork(request);
        if (
          !normalizedArtwork?.id ||
          normalizedArtwork.id !== previousArtworkIdRef.current ||
          attempt === 2
        ) {
          break;
        }
      }

      const fetchedArtwork = toLegacyArtwork(normalizedArtwork);

      if (!fetchedArtwork?.primaryImage) {
        setError('No valid artwork found. Using default artwork.');
        setArtwork(defaultArtwork);
        return;
      }

      previousArtworkIdRef.current = normalizedArtwork?.id || null;

      setArtwork({
        ...fetchedArtwork,
        primaryImage: fetchedArtwork.primaryImage,
        title: fetchedArtwork.title || 'Untitled',
        objectDate: fetchedArtwork.objectDate || 'Unknown Date',
        artistDisplayName: fetchedArtwork.artistDisplayName || 'Unknown Artist',
        medium: fetchedArtwork.medium || 'Unknown Medium',
        source: fetchedArtwork.source || 'Unknown Source',
      });
    } catch (err) {
      console.error('Error in useArtwork:', err);
      setError(err.message || 'Something went wrong. Please refresh the page.');
      setArtwork(defaultArtwork);
    } finally {
      setLoading(false);
    }
  }, [query, subcategory]);

  useEffect(() => {
    previousArtworkIdRef.current = null;
    getArtwork();
    const interval = setInterval(getArtwork, 600000);
    return () => clearInterval(interval);
  }, [getArtwork]);

  const refresh = useCallback(() => {
    getArtwork();
  }, [getArtwork]);

  return { artwork, loading, error, refresh };
};

export default useArtwork;
