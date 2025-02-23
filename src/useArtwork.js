import { useEffect, useState } from 'react';
import { fetchArtwork } from './api';

// Δημιουργία του custom hook
const useArtwork = () => {
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    const getArtwork = async () => {
      const data = await fetchArtwork('painting'); // Μπορείς να αλλάξεις το query 

      if (data) {
        setArtwork(data);
      } else {
        console.log('No artwork found or an error occurred.');
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
