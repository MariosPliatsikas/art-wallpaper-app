
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

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Mapping subcategories to API queries
const subcategoryMapping = {
  period: {
    'Pre-1600': {
      met: 'dateBegin<=1600',
      harvard: 'datebegin<=1600',
      nma: 'date<=1600',
    },
    '1600-1800': {
      met: 'dateBegin>=1600&dateEnd<=1800',
      harvard: 'datebegin>=1600&dateend<=1800',
      nma: 'date>=1600&date<=1800',
    },
    '1800-1900': {
      met: 'dateBegin>=1800&dateEnd<=1900',
      harvard: 'datebegin>=1800&dateend<=1900',
      nma: 'date>=1800&date<=1900',
    },
    '1900-Present': {
      met: 'dateBegin>=1900',
      harvard: 'datebegin>=1900',
      nma: 'date>=1900',
    },
  },
  movement: {
    Impressionism: {
      met: 'classification:painting+Impressionism',
      harvard: 'classification=paintings+Impressionism',
      nma: 'Impressionism',
    },
    Renaissance: {
      met: 'classification:painting+Renaissance',
      harvard: 'classification=paintings+Renaissance',
      nma: 'Renaissance',
    },
    Baroque: {
      met: 'classification:painting+Baroque',
      harvard: 'classification=paintings+Baroque',
      nma: 'Baroque',
    },
    Modernism: {
      met: 'classification:painting+Modern',
      harvard: 'classification=paintings+Modern',
      nma: 'Modern',
    },
  },
  type: {
    Painting: {
      met: 'classification:painting',
      harvard: 'classification=paintings',
      nma: 'additionalType:Painting',
    },
    Sculpture: {
      met: 'classification:sculpture',
      harvard: 'classification=sculptures',
      nma: 'additionalType:Sculpture',
    },
    Photography: {
      met: 'classification:photograph',
      harvard: 'classification=photographs',
      nma: 'additionalType:Photograph',
    },
  },
  museum: {
    Metropolitan: {
      met: 'painting',
      harvard: '',
      nma: '',
    },
    Harvard: {
      met: '',
      harvard: 'painting',
      nma: '',
    },
    'National Museum of Australia': {
      met: '',
      harvard: '',
      nma: 'art',
    },
  },
  indigenous: {
    'Aboriginal Art': {
      met: 'classification:painting+Aboriginal',
      harvard: 'classification=paintings+Aboriginal',
      nma: 'Indigenous+Art',
    },
    'Torres Strait Islander Art': {
      met: 'classification:painting+Torres+Strait',
      harvard: 'classification=paintings+Torres+Strait',
      nma: 'Torres+Strait+Art',
    },
  },
  contemporary: {
    'Contemporary Australian': {
      met: 'classification:painting+Contemporary+Australian',
      harvard: 'classification=paintings+Contemporary+Australian',
      nma: 'Contemporary+Art',
    },
  },
};

/**
 * Retries a fetch request with exponential backoff
 * @param {string} url - API URL
 * @param {number} retries - Number of retries
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithRetry(url, retries = 3, initialDelay = 1000) {
  for (let i = 0; i < retries; i++) {
    const delay = initialDelay * Math.pow(2, i); // Calculate delay for this retry
    try {
      console.log(`Fetching URL: ${url}`); // Debug URL
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status === 429 && i < retries - 1) {
        console.warn(`Rate limit hit for ${url}, retrying after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`Fetch failed for ${url}: ${response.status}`);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error.message);
      if (i === retries - 1) throw error;
    }
  }
}

/**
 * Fetches artwork from APIs with fallback
 * @param {string} query - Search query (default: 'painting')
 * @param {string} subcategory - Subcategory for filtering (optional)
 * @param {boolean} useMock - Use mock data (default: false)
 * @returns {Promise<{ artwork: Object|null, error: string|null }>} Artwork object or error
 */
export async function fetchArtwork(query = config.DEFAULT_QUERY, subcategory = '', useMock = false) {
  console.log('fetchArtwork called with:', { query, subcategory, useMock });

  // Return mock data if enabled
  if (useMock) {
    console.log('Using mock artwork');
    return { artwork: mockArtwork, error: null };
  }

  // Cache key
  const cacheKey = `${query}:${subcategory}`;
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('Returning cached artwork:', cacheKey);
      return { artwork: data, error: null };
    }
  }

  // Adjust query based on subcategory
  let adjustedQueries = { met: query, harvard: query, nma: query };
  if (subcategory && subcategoryMapping[query]?.[subcategory]) {
    adjustedQueries = subcategoryMapping[query][subcategory];
    console.log(`Adjusted queries for subcategory ${subcategory}:`, adjustedQueries);
  }

  // Attempt Metropolitan Museum API
  try {
    const metUrl = `${config.MET_MUSEUM_API_URL}/search?hasImages=true&isPublicDomain=true&q=${adjustedQueries.met}&size=100`;
    const searchResponse = await fetchWithRetry(metUrl);
    const searchData = await searchResponse.json();
    console.log('Metropolitan search data:', searchData);

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      throw new Error('No artworks found in Metropolitan Museum');
    }

    // Try up to 3 artworks to ensure valid primaryImage
    let artwork = null;
    for (let i = 0; i < Math.min(3, searchData.objectIDs.length); i++) {
      const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
      const artworkID = searchData.objectIDs[randomIndex];

      const artworkResponse = await fetchWithRetry(
        `${config.MET_MUSEUM_API_URL}/objects/${artworkID}`
      );
      const fetchedArtwork = await artworkResponse.json();
      console.log('Metropolitan artwork details:', fetchedArtwork);

      if (fetchedArtwork.primaryImage && fetchedArtwork.primaryImage !== '') {
        artwork = {
          primaryImage: fetchedArtwork.primaryImage,
          title: fetchedArtwork.title || 'Untitled',
          objectDate: fetchedArtwork.objectDate || 'Unknown Date',
          artistDisplayName: fetchedArtwork.artistDisplayName || 'Unknown Artist',
          medium: fetchedArtwork.medium || 'Unknown Medium',
          source: 'Metropolitan Museum',
        };
        break;
      }
    }

    if (!artwork) {
      throw new Error('No valid artwork with primary image found in Metropolitan Museum');
    }

    cache.set(cacheKey, { data: artwork, timestamp: Date.now() });
    return { artwork, error: null };
  } catch (error) {
    console.warn('Metropolitan Museum API failed:', error.message);

    // Fallback to Harvard Museum API
    try {
      const harvardUrl = `${config.HARVARD_API_URL}/object?apikey=${config.HARVARD_API_KEY}&hasimage=1&size=100&q=${adjustedQueries.harvard}`;
      const harvardResponse = await fetchWithRetry(harvardUrl);
      const harvardData = await harvardResponse.json();
      console.log('Harvard search data:', harvardData);

      if (!harvardData.records || harvardData.records.length === 0) {
        throw new Error('No artworks found in Harvard Museum');
      }

      // Try up to 3 artworks
      let artwork = null;
      for (let i = 0; i < Math.min(3, harvardData.records.length); i++) {
        const randomIndex = Math.floor(Math.random() * harvardData.records.length);
        const harvardArtwork = harvardData.records[randomIndex];
        console.log('Harvard selected artwork:', harvardArtwork);

        if (harvardArtwork.primaryimageurl && harvardArtwork.primaryimageurl !== '') {
          artwork = {
            primaryImage: harvardArtwork.primaryimageurl,
            title: harvardArtwork.title || 'Untitled',
            objectDate: harvardArtwork.dated || 'Unknown Date',
            artistDisplayName: harvardArtwork.people?.[0]?.name || 'Unknown Artist',
            medium: harvardArtwork.medium || 'Unknown Medium',
            source: 'Harvard Museum',
          };
          break;
        }
      }

      if (!artwork) {
        throw new Error('No valid artwork with primary image found in Harvard Museum');
      }

      cache.set(cacheKey, { data: artwork, timestamp: Date.now() });
      return { artwork, error: null };
    } catch (harvardError) {
      console.warn('Harvard Museum API failed:', harvardError.message);

      // Fallback to National Museum of Australia API
      try {
        const nmaUrl = `${config.NMA_API_URL}/object?text=${adjustedQueries.nma}&size=100&apiKey=${config.NMA_API_KEY}`;
        const nmaResponse = await fetchWithRetry(nmaUrl);
        const nmaData = await nmaResponse.json();
        console.log('NMA search data:', nmaData);

        if (!nmaData.data || nmaData.data.length === 0) {
          throw new Error('No artworks found in National Museum of Australia');
        }

        // Filter artworks with valid media
        const validArtworks = nmaData.data.filter(
          (item) => item.media && item.media[0]?.url
        );
        console.log('NMA valid artworks with media:', validArtworks);

        if (validArtworks.length === 0) {
          throw new Error('No artworks with valid media found in National Museum of Australia');
        }

        // Try up to 3 artworks
        let artwork = null;
        for (let i = 0; i < Math.min(3, validArtworks.length); i++) {
          const randomIndex = Math.floor(Math.random() * validArtworks.length);
          const nmaArtwork = validArtworks[randomIndex];
          console.log('NMA selected artwork:', nmaArtwork);

          if (nmaArtwork.media && nmaArtwork.media[0]?.url) {
            artwork = {
              primaryImage: nmaArtwork.media[0].url,
              title: nmaArtwork.title || 'Untitled',
              objectDate: nmaArtwork.date || 'Unknown Date',
              artistDisplayName: nmaArtwork.creator || 'Unknown Artist',
              medium: nmaArtwork.medium || 'Unknown Medium',
              source: 'National Museum of Australia',
            };
            console.log('Valid NMA artwork found:', artwork);
            break;
          }
        }

        if (!artwork) {
          throw new Error('No valid artwork with primary image found in National Museum of Australia');
        }

        cache.set(cacheKey, { data: artwork, timestamp: Date.now() });
        return { artwork, error: null };
      } catch (nmaError) {
        console.error('National Museum of Australia API failed:', nmaError.message);
        return { artwork: null, error: 'All APIs failed to fetch artwork. Please try again later.' };
      }
    }
  }
}