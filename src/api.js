
import config from './config'; // Import configuration

// Mock artwork for offline testing
const mockArtwork = {
  primaryImage: 'https://via.placeholder.com/800x600?text=Mock+Artwork',
  title: 'Mock Artwork',
  objectDate: '2023',
  artistDisplayName: 'Mock Artist',
  medium: 'Digital',
  source: 'Mock API',
};

// Mapping subcategories to API queries (placeholder, adjust as needed)
const subcategoryMapping = {
  period: {
    'Pre-1600': 'dateBegin<=1600',
    '1600-1800': 'dateBegin>=1600&dateEnd<=1800',
    'Post-1800': 'dateBegin>=1800',
  },
  movement: {
    Impressionism: 'Impressionism',
    Renaissance: 'Renaissance',
    Baroque: 'Baroque',
  },
  museum: {
    Metropolitan: 'source:Metropolitan',
    Harvard: 'source:Harvard',
  },
};

/**
 * Fetches artwork from Metropolitan Museum API with fallback to Harvard Museum API.
 * @param {string} query - Search query (default: 'painting')
 * @param {string} subcategory - Subcategory for filtering (optional)
 * @param {boolean} useMock - Use mock data for testing (default: false)
 * @returns {Promise<Object|null>} Artwork object or null if failed
 */
export async function fetchArtwork(query = 'painting', subcategory = '', useMock = false) {
  // Return mock data if enabled
  if (useMock) {
    console.log('Using mock artwork');
    return mockArtwork;
  }

  // Adjust query based on subcategory
  let adjustedQuery = query;
  if (subcategory && subcategoryMapping[query]?.[subcategory]) {
    adjustedQuery = subcategoryMapping[query][subcategory];
    console.log(`Adjusted query for subcategory ${subcategory}: ${adjustedQuery}`);
  }

  // Attempt to fetch from Metropolitan Museum API
  try {
    // Step 1: Search for artworks (limit to 100 results for performance)
    const searchResponse = await fetch(
      `${config.MET_MUSEUM_API_URL}/search?hasImages=true&q=${adjustedQuery}&size=100`
    );

    if (!searchResponse.ok) {
      throw new Error(`Metropolitan Museum search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('Metropolitan search data:', searchData);

    // Check if artworks are available
    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      throw new Error('No artworks found in Metropolitan Museum');
    }

    // Select random artwork
    const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
    const artworkID = searchData.objectIDs[randomIndex];

    // Step 2: Fetch artwork details
    const artworkResponse = await fetch(
      `${config.MET_MUSEUM_API_URL}/objects/${artworkID}`
    );

    if (!artworkResponse.ok) {
      throw new Error(`Metropolitan Museum details fetch failed: ${artworkResponse.status}`);
    }

    const fetchedArtwork = await artworkResponse.json();
    console.log('Metropolitan artwork details:', fetchedArtwork);

    // Validate primary image
    if (!fetchedArtwork.primaryImage || fetchedArtwork.primaryImage === '') {
      throw new Error('Metropolitan artwork missing primary image');
    }

    // Return normalized artwork object
    return {
      primaryImage: fetchedArtwork.primaryImage,
      title: fetchedArtwork.title || 'Untitled',
      objectDate: fetchedArtwork.objectDate || 'Unknown Date',
      artistDisplayName: fetchedArtwork.artistDisplayName || 'Unknown Artist',
      medium: fetchedArtwork.medium || 'Unknown Medium',
      source: 'Metropolitan Museum',
    };
  } catch (error) {
    console.warn('Metropolitan Museum API failed:', error);

    // Fallback to Harvard Museum API
    try {
      const harvardResponse = await fetch(
        `${config.HARVARD_API_URL}/object?apikey=${config.HARVARD_API_KEY}&hasimage=1&size=100&q=${adjustedQuery}`
      );

      if (!harvardResponse.ok) {
        throw new Error(`Harvard Museum fetch failed: ${harvardResponse.status}`);
      }

      const harvardData = await harvardResponse.json();
      console.log('Harvard search data:', harvardData);

      // Check if artworks are available
      if (!harvardData.records || harvardData.records.length === 0) {
        throw new Error('No artworks found in Harvard Museum');
      }

      // Select random artwork
      const randomIndex = Math.floor(Math.random() * harvardData.records.length);
      const harvardArtwork = harvardData.records[randomIndex];
      console.log('Harvard selected artwork:', harvardArtwork);

      // Validate primary image
      if (!harvardArtwork.primaryimageurl || harvardArtwork.primaryimageurl === '') {
        throw new Error('Harvard artwork missing primary image');
      }

      // Return normalized artwork object
      return {
        primaryImage: harvardArtwork.primaryimageurl,
        title: harvardArtwork.title || 'Untitled',
        objectDate: harvardArtwork.dated || 'Unknown Date',
        artistDisplayName: harvardArtwork.people?.[0]?.name || 'Unknown Artist',
        medium: harvardArtwork.medium || 'Unknown Medium',
        source: 'Harvard Museum',
      };
    } catch (harvardError) {
      console.error('Harvard Museum API failed:', harvardError);
      return null; // Return null on failure
    }
  }
}