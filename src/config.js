
/**
 * Configuration for API endpoints and keys.
 */
const config = {
  // Base URLs for APIs
  MET_MUSEUM_API_URL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  HARVARD_API_URL: 'https://api.harvardartmuseums.org', // Base URL for Harvard Museum API
  NMA_API_URL: 'https://data.nma.gov.au', // Base URL for National Museum of Australia API

  // API Keys
  HARVARD_API_KEY: process.env.REACT_APP_HARVARD_API_KEY || '7d4c21d2-b09a-486f-aac2-c2313293e96a',
  NMA_API_KEY: process.env.REACT_APP_NMA_API_KEY || 'placeholder-nma-api-key', // Replace with your NMA API key

  // Default query for APIs
  DEFAULT_QUERY: 'painting',
};

export default config;