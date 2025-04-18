const config = {
  // API Token for ListenBrainz
  MUSIC_API_TOKEN: process.env.REACT_APP_MUSIC_API_TOKEN || 
    '71bdc45f-1445-4a1c-b1e7-8f15beec9be9',

  // Base URLs for APIs
  MET_MUSEUM_API_URL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  MUSICBRAINZ_API_URL: 'https://api.listenbrainz.org/1',
  HARVARD_API_URL: 'https://api.harvardartmuseums.org', // Base URL for Harvard Museum API

  // API Key for Harvard Museum
  HARVARD_API_KEY: process.env.REACT_APP_HARVARD_API_KEY || '7d4c21d2-b09a-486f-aac2-c2313293e96a',

  // Other settings
  DEFAULT_QUERY: 'painting', // Default query for the Met Museum API
};

export default config;
