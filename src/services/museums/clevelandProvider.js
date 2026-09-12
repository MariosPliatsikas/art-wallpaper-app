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

/**
 * Fetch a random Cleveland Museum of Art object that has an image.
 * The Open Access API does not require an API key.
 */
export async function getRandomClevelandArtwork(query = '') {
  const params = new URLSearchParams({
    has_image: '1',
    limit: '100',
  });

  if (query && query !== 'painting') {
    params.set('q', query);
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
