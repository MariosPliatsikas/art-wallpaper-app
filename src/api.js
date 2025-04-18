import config from './config'; // Εισαγωγή του config

export async function fetchArtwork(query = 'painting') {
  try {
    // Βήμα 1: Αναζήτηση για έργα τέχνης στο Metropolitan Museum
    const searchResponse = await fetch(
      `${config.MET_MUSEUM_API_URL}/search?hasImages=true&q=${query}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch artwork list from Metropolitan Museum');
    }

    const searchData = await searchResponse.json();

    // Έλεγχος αν υπάρχουν διαθέσιμα έργα τέχνης
    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      throw new Error('No artworks found in Metropolitan Museum');
    }

    // Επιλογή τυχαίου έργου τέχνης
    const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
    const artworkID = searchData.objectIDs[randomIndex];

    // Βήμα 2: Ανάκτηση λεπτομερειών για το συγκεκριμένο έργο τέχνης
    const artworkResponse = await fetch(
      `${config.MET_MUSEUM_API_URL}/objects/${artworkID}`
    );

    if (!artworkResponse.ok) {
      throw new Error('Failed to fetch artwork details from Metropolitan Museum');
    }

    const fetchedArtwork = await artworkResponse.json();

    // Έλεγχος αν το έργο έχει εικόνα
    if (!fetchedArtwork.primaryImage || fetchedArtwork.primaryImage === '') {
      throw new Error('Artwork from Metropolitan Museum has no image');
    }

    // Επιστροφή έργου τέχνης από το Metropolitan Museum
    return {
      primaryImage: fetchedArtwork.primaryImage,
      title: fetchedArtwork.title || 'Untitled',
      objectDate: fetchedArtwork.objectDate || 'Unknown Date',
      artist: fetchedArtwork.artistDisplayName || 'Unknown Artist',
      source: 'Metropolitan Museum', // Προσθήκη πηγής
    };
  } catch (error) {
    console.warn('Falling back to Harvard Museum API:', error);

    // Fallback: Αναζήτηση στο Harvard Museum API
    try {
      const harvardResponse = await fetch(
        `${config.HARVARD_API_URL}/object?apikey=${config.HARVARD_API_KEY}&hasimage=1&size=100&q=${query}`
      );

      if (!harvardResponse.ok) {
        throw new Error('Failed to fetch artwork from Harvard Museum');
      }

      const harvardData = await harvardResponse.json();

      // Έλεγχος αν υπάρχουν διαθέσιμα έργα τέχνης
      if (!harvardData.records || harvardData.records.length === 0) {
        throw new Error('No artworks found in Harvard Museum');
      }

      // Επιλογή τυχαίου έργου τέχνης
      const randomIndex = Math.floor(Math.random() * harvardData.records.length);
      const harvardArtwork = harvardData.records[randomIndex];

      // Έλεγχος αν το έργο έχει εικόνα
      if (!harvardArtwork.primaryimageurl || harvardArtwork.primaryimageurl === '') {
        throw new Error('Artwork from Harvard Museum has no image');
      }

      // Επιστροφή έργου τέχνης από το Harvard Museum
      return {
        primaryImage: harvardArtwork.primaryimageurl,
        title: harvardArtwork.title || 'Untitled',
        objectDate: harvardArtwork.dated || 'Unknown Date',
        artist: harvardArtwork.people?.[0]?.name || 'Unknown Artist',
        source: 'Harvard Museum', // Προσθήκη πηγής
      };
    } catch (harvardError) {
      console.error('Error fetching artwork from Harvard Museum:', harvardError);
      return null; // Επιστροφή null σε περίπτωση σφάλματος
    }
  }
}
