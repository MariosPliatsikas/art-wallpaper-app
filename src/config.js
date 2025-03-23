const config = {
  // API Token for ListenBrainz
  MUSIC_API_TOKEN: process.env.REACT_APP_MUSIC_API_TOKEN || 
    '71bdc45f-1445-4a1c-b1e7-8f15beec9be9',

  // Base URLs for APIs
  MET_MUSEUM_API_URL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  MUSICBRAINZ_API_URL: 'https://api.listenbrainz.org/1',

  // Other settings
  DEFAULT_QUERY: 'painting', // Default query for the Met Museum API
};

export default config;
