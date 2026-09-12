import config from '../../config';
import normalizeArtwork from './normalizeArtwork';

const MUSEUM_NAME = 'Harvard Art Museums';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Harvard API request failed: ${response.status}`);
  }
  return response.json();
}

function normalizeHarvardArtwork(item) {
  return normalizeArtwork({
    id: `harvard-${item.id}`,
    title: item.title,
    artist: item.people?.[0]?.name,
    date: item.dated,
    image: item.primaryimageurl,
    imageLarge: item.primaryimageurl,
    museum: MUSEUM_NAME,
    sourceUrl: item.url,
    category: item.classification,
    license: item.copyright || item.creditline || '',
    medium: item.medium,
  });
}

export async function getRandomHarvardArtwork(query = 'painting') {
  if (!config.HARVARD_API_KEY) {
    throw new Error('Harvard API key is not configured');
  }

  const params = new URLSearchParams({
    apikey: config.HARVARD_API_KEY,
    hasimage: '1',
    size: '100',
    q: query,
  });

  const data = await fetchJson(`${config.HARVARD_API_URL}/object?${params.toString()}`);
  const records = (data.records || []).filter((item) => item.primaryimageurl);

  if (!records.length) {
    throw new Error('No Harvard artworks with usable images were found');
  }

  const item = records[Math.floor(Math.random() * records.length)];
  return normalizeHarvardArtwork(item);
}

export const harvardProvider = {
  id: 'harvard',
  name: MUSEUM_NAME,
  isConfigured: () => Boolean(config.HARVARD_API_KEY),
  getRandomArtwork: getRandomHarvardArtwork,
};

export default harvardProvider;
