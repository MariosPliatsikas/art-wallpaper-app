import config from '../../config';
import normalizeArtwork from './normalizeArtwork';

const MUSEUM_NAME = 'The Metropolitan Museum of Art';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Met API request failed: ${response.status}`);
  }
  return response.json();
}

function normalizeMetArtwork(item) {
  return normalizeArtwork({
    id: `met-${item.objectID}`,
    title: item.title,
    artist: item.artistDisplayName,
    date: item.objectDate,
    image: item.primaryImageSmall || item.primaryImage,
    imageLarge: item.primaryImage,
    museum: MUSEUM_NAME,
    sourceUrl: item.objectURL,
    category: item.classification || item.objectName,
    license: item.isPublicDomain ? 'Public Domain' : '',
    medium: item.medium,
  });
}

/**
 * Fetch a random public-domain Met artwork with an image.
 */
export async function getRandomMetArtwork(query = 'painting') {
  const params = new URLSearchParams({
    hasImages: 'true',
    isPublicDomain: 'true',
    q: query,
    limit: '100',
    offset: '0',
  });

  const search = await fetchJson(
    `${config.MET_MUSEUM_API_URL}/search?${params.toString()}`
  );

  const objectIDs = search.objectIDs || [];
  if (!objectIDs.length) {
    throw new Error('No Met artworks found');
  }

  const candidates = [...objectIDs]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(5, objectIDs.length));

  for (const objectID of candidates) {
    const item = await fetchJson(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    );
    if (item.primaryImage) {
      return normalizeMetArtwork(item);
    }
  }

  throw new Error('No Met artwork with a usable image was found');
}

export const metProvider = {
  id: 'met',
  name: MUSEUM_NAME,
  getRandomArtwork: getRandomMetArtwork,
};

export default metProvider;
