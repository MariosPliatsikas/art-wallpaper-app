import normalizeArtwork from './normalizeArtwork';

const MUSEUM_NAME = 'Cleveland Museum of Art';
const API_URL = 'https://openaccess-api.clevelandart.org/api/artworks/';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Cleveland API request failed: ${response.status}`);
  }
  return response.json();
}

function normalizeClevelandArtwork(item) {
  return normalizeArtwork({
    id: `cleveland-${item.id}`,
    title: item.title,
    artist: item.creators?.[0]?.description,
    date: item.creation_date,
    image: item.images?.web?.url,
    imageLarge: item.images?.print?.url || item.images?.web?.url,
    museum: MUSEUM_NAME,
    sourceUrl: item.url,
    category: item.type,
    license: item.share_license_status,
    medium: item.technique || item.medium,
  });
}

function toSearchOptions(input = {}) {
  if (typeof input === 'string') return { query: input };
  return input || {};
}

export async function getRandomClevelandArtwork(input = {}) {
  const { query, type, movement, dateBegin, dateEnd } = toSearchOptions(input);
  const params = new URLSearchParams({
    has_image: '1',
    limit: '100',
  });

  if (type) params.set('type', type);
  if (movement) params.set('q', movement);
  else if (query) params.set('q', query);

  if (Number.isFinite(dateBegin)) {
    params.set('created_after', String(dateBegin - 1));
  }
  if (Number.isFinite(dateEnd)) {
    params.set('created_before', String(dateEnd + 1));
  }

  const data = await fetchJson(`${API_URL}?${params.toString()}`);
  const items = (data.data || []).filter((item) => item.images?.web?.url);

  if (!items.length) {
    throw new Error('No Cleveland artworks with usable images were found');
  }

  const item = items[Math.floor(Math.random() * items.length)];
  return normalizeClevelandArtwork(item);
}

export const clevelandProvider = {
  id: 'cleveland',
  name: MUSEUM_NAME,
  getRandomArtwork: getRandomClevelandArtwork,
};

export default clevelandProvider;
