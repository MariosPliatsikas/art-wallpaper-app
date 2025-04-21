
import { useEffect, useState, useCallback } from 'react';
import { fetchArtwork } from './api';

// Default artwork for fallback cases
const defaultArtwork = {
  primaryImage: '/images/fallback-artwork.png', // Ensure this file exists in public/images
  title: 'Default Artwork',
  objectDate: 'Unknown',
  artistDisplayName: 'Unknown Artist',
  medium: 'Unknown Medium',
  source: 'Fallback',
};

/**
 * Custom hook to fetch and manage artwork data.
 * Returns artwork, loading state, error message, and refresh function.
 * @param {string} query - Search query (default: 'painting')
 * @param {string} subcategory - Subcategory for filtering (optional)
 */
const useArtwork = (query = 'painting', subcategory = '') => {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch artwork data
  const getArtwork = useCallback(async () => {
    console.log('getArtwork called with:', { query, subcategory });
    try {
      setLoading(true);
      setError(null);
      const { artwork: fetchedArtwork, error: fetchError } = await fetchArtwork(query, subcategory);
      console.log('Fetched artwork in useArtwork:', { artwork: fetchedArtwork, error: fetchError });

      // Validate fetched artwork
      if (fetchError || !fetchedArtwork || !fetchedArtwork.primaryImage) {
        console.warn('No valid artwork received, using default. Details:', {
          fetchError,
          fetchedArtwork,
          hasPrimaryImage: fetchedArtwork?.primaryImage,
        });
        setError(fetchError || 'No valid artwork found. Using default artwork.');
        setArtwork(defaultArtwork);
      } else {
        // Ensure all fields have fallback values
        const validatedArtwork = {
          primaryImage: fetchedArtwork.primaryImage,
          title: fetchedArtwork.title || 'Untitled',
          objectDate: fetchedArtwork.objectDate || 'Unknown Date',
          artistDisplayName: fetchedArtwork.artistDisplayName || 'Unknown Artist',
          medium: fetchedArtwork.medium || 'Unknown Medium',
          source: fetchedArtwork.source || 'Unknown Source',
        };
        console.log('Setting validated artwork:', validatedArtwork);
        setArtwork(validatedArtwork);
      }
    } catch (err) {
      console.error('Error in useArtwork:', err.message, err.stack);
      setError(err.message || 'Something went wrong. Please refresh the page.');
      setArtwork(defaultArtwork);
    } finally {
      setLoading(false);
    }
  }, [query, subcategory]);

  // Fetch artwork on mount and every 10 minutes
  useEffect(() => {
    getArtwork();

    // Set interval to refresh every 10 minutes
    const interval = setInterval(() => {
      console.log('Refreshing artwork via interval');
      getArtwork();
    }, 600000); // 10 minutes in milliseconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [getArtwork]);

  // Manual refresh function
  const refresh = () => {
    console.log('Manual refresh triggered');
    getArtwork();
  };

  return { artwork, loading, error, refresh };
};

export default useArtwork;