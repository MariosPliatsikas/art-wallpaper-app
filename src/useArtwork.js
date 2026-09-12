import { useEffect, useState, useCallback } from 'react';
import { fetchArtwork } from './api';
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

/**
 * Custom hook to fetch and manage artwork data.
 * Random and museum-specific selections use the new provider architecture.
 * Other filters still use the legacy API layer until their migration is complete.
 */
const useArtwork = (query = 'random', subcategory = '') => {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getArtwork = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedArtwork = null;
      let fetchError = null;

      if (query === 'random') {
        const normalizedArtwork = await getRandomArtwork({ query: 'painting' });
        fetchedArtwork = toLegacyArtwork(normalizedArtwork);
      } else if (query === 'museum' && museumIdByLabel[subcategory]) {
        const normalizedArtwork = await getRandomArtwork({
          museumId: museumIdByLabel[subcategory],
          query: 'painting',
        });
        fetchedArtwork = toLegacyArtwork(normalizedArtwork);
      } else {
        const legacyResult = await fetchArtwork(query, subcategory);
        fetchedArtwork = legacyResult.artwork;
        fetchError = legacyResult.error;
      }

      if (fetchError || !fetchedArtwork || !fetchedArtwork.primaryImage) {
        setError(fetchError || 'No valid artwork found. Using default artwork.');
        setArtwork(defaultArtwork);
        return;
      }

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
