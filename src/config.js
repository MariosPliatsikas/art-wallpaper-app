/**
 * Shared configuration for museum APIs.
 * Secrets must be supplied through environment variables and never committed.
 */
const config = {
  MET_MUSEUM_API_URL: 'https://collectionapi.metmuseum.org/public/collection/v1.1',
  HARVARD_API_URL: '/api/harvard',
};

export default config;
