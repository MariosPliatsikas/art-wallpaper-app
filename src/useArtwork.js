import { useEffect, useState } from 'react';
import { fetchArtwork } from './api';

const defaultArtwork = {
  image: '/path/to/default-image.png', // Βεβαιωθείτε ότι η διαδρομή είναι σωστή
  title: 'Default Artwork',
};

// Δημιουργία του custom hook
const useArtwork = () => {
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    const getArtwork = async () => {
      const fetchedArtwork = await fetchArtwork('painting'); // Μπορείς να αλλάξεις το query 

      const artwork = fetchedArtwork || defaultArtwork;

      if (artwork) {
        setArtwork(artwork);
      } else {
        console.error("No artwork found or an error occurred.");
        setArtwork(defaultArtwork); // Προεπιλεγμένο έργο τέχνης
      }
    };

    // Αρχική κλήση για να φέρουμε τα δεδομένα
    getArtwork();

    // Ρύθμιση interval για να ανανεώνουμε τα δεδομένα κάθε 10 λεπτά
    const interval = setInterval(() => {
      getArtwork();
    }, 600000); // 10 λεπτά σε χιλιοστά του δευτερολέπτου

    // Καθαρισμός του interval όταν το component unmounts
    return () => clearInterval(interval);
  }, []);

  return artwork;
};

// Εξαγωγή του custom hook
export default useArtwork;  // Χρησιμοποιήστε default export
