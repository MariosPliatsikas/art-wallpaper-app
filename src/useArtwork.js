
import { useEffect, useState } from 'react';
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
 */
const useArtwork = () => {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch artwork data
  const getArtwork = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArtwork = await fetchArtwork('painting'); // Query can be customized
      console.log('Fetched artwork in useArtwork:', fetchedArtwork); // Debug API response

      // Validate fetched artwork
      if (fetchedArtwork && fetchedArtwork.primaryImage) {
        setArtwork(fetchedArtwork);
      } else {
        console.warn('No valid artwork received, using default');
        setError('No valid artwork found. Using default artwork.');
        setArtwork(defaultArtwork);
      }
    } catch (err) {
      console.error('Error in useArtwork:', err);
      setError(err.message || 'Something went wrong. Please refresh the page.');
      setArtwork(defaultArtwork);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  // Manual refresh function
  const refresh = () => {
    console.log('Manual refresh triggered');
    getArtwork();
  };

  return { artwork, loading, error, refresh };
};

export default useArtwork;