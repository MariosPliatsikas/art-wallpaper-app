const config = {
  // API Token για το MusicBrainz
  MUSIC_API_TOKEN: process.env.REACT_APP_MUSIC_API_TOKEN || 
'HkAXEcoNEeBpMW5LENsV1oMqZuI9aSv1y3HJfyF9',

  // URLs για APIs
  MET_MUSEUM_API_URL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  MUSICBRAINZ_API_URL: 'https://api.listenbrainz.org/1',

  // Άλλες ρυθμίσεις
  DEFAULT_QUERY: 'painting', // Προεπιλεγμένο query για το Met Museum API
};

export default config;
