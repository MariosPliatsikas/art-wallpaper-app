import config from '../../config';
import normalizeArtwork from './normalizeArtwork';

const MUSEUM_NAME = 'Harvard Art Museums';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status === 401 || response.status === 403
      ? 'Harvard rejected the API key. Check the local configuration.'
      : `Harvard API request failed (HTTP ${response.status}). Please try again.`);
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

function toSearchOptions(input = {}) {
  if (typeof input === 'string') return { query: input };
  return input || {};
}

function classificationForType(type) {
  const map = {
    Painting: 'Paintings',
    Sculpture: 'Sculpture',
    Photography: 'Photographs',
  };
  return map[type] || type;
}

export async function getRandomHarvardArtwork(input = {}) {
  const { query, type, movement, dateBegin, dateEnd } = toSearchOptions(input);
  const params = new URLSearchParams({
    hasimage: '1',
    size: '100',
    sort: 'random',
  });

  if (type) params.set('classification', classificationForType(type));
  if (movement) params.set('keyword', movement);
  else if (query) params.set('q', query);

  if (Number.isFinite(dateBegin) && Number.isFinite(dateEnd)) {
    params.set('yearmade', `${dateBegin}-${dateEnd}`);
  }

  const data = await fetchJson(`${config.HARVARD_API_URL}?${params.toString()}`);
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
  getRandomArtwork: getRandomHarvardArtwork,
};

export default harvardProvider;
