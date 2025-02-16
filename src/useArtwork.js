import { useEffect, useState } from 'react';
import { fetchArtwork } from './api';

export function useArtwork() {
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    async function getArtwork() {
      const painting = await fetchArtwork();
      setArtwork(painting);
    }
    getArtwork();

    const interval = setInterval(() => {
      getArtwork();
    }, 600000); // 10 λεπτά σε χιλιοστά του δευτερολέπτου

    return () => clearInterval(interval);
  }, []);

  return artwork;
}