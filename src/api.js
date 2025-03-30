export async function fetchArtwork(query = 'painting') {
  try {
    // Βήμα 1: Αναζήτηση για έργα τέχνης
    const searchResponse = await fetch(
      
`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch artwork list');
    }

    const searchData = await searchResponse.json();

    // Έλεγχος αν υπάρχουν διαθέσιμα έργα τέχνης
    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      throw new Error('No artworks found');
    }

    // Επιλογή τυχαίου έργου τέχνης
    const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
    const artworkID = searchData.objectIDs[randomIndex];

    // Βήμα 2: Ανάκτηση λεπτομερειών για το συγκεκριμένο έργο τέχνης
    const artworkResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkID}`
    );

    if (!artworkResponse.ok) {
      throw new Error('Failed to fetch artwork details');
    }

    const fetchedArtwork = await artworkResponse.json();

    // Έλεγχος αν το έργο έχει εικόνα
    if (!fetchedArtwork.primaryImage || fetchedArtwork.primaryImage === '') {
      throw new Error('Artwork has no image');
    }

    const defaultArtwork = {
      image: '/path/to/default-image.png',
      title: 'Default Artwork',
    };

    const artwork = fetchedArtwork || defaultArtwork;

    return artwork;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return null; // Επιστροφή null σε περίπτωση σφάλματος
  }
}
