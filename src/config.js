/**
 * Shared configuration for museum APIs.
 * Secrets must be supplied through environment variables and never committed.
 */
const config = {
  MET_MUSEUM_API_URL: 'https://collectionapi.metmuseum.org/public/collection/v1.1',
  HARVARD_API_URL: 'https://api.harvardartmuseums.org',
  NMA_API_URL: 'https://data.nma.gov.au',

  HARVARD_API_KEY: process.env.REACT_APP_HARVARD_API_KEY || '',
  NMA_API_KEY: process.env.REACT_APP_NMA_API_KEY || '',

  DEFAULT_QUERY: 'painting',
};

export default config;
