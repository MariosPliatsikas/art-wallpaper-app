
const RIJKSMUSEUM_API_KEY = 'https://data.rijksmuseum.nl/oai';

export async function fetchArtwork(query = 'painting') {
  try {
    const searchResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch artwork list');
    }

    const searchData = await searchResponse.json();

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      throw new Error('No artworks found');
    }

    const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
    const artworkID = searchData.objectIDs[randomIndex];

    const artworkResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkID}`
    );

    if (!artworkResponse.ok) {
      throw new Error('Failed to fetch artwork details');
    }

    const artwork = await artworkResponse.json();

    if (!artwork.primaryImage || artwork.primaryImage === '') {
      throw new Error('Artwork has no image');
    }

    return artwork;
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return null;
  }
}

export async function fetchRijksmuseumArtwork(query = 'painting') {
  try {
    const response = await fetch(
      `https://www.rijksmuseum.nl/api/en/collection?key=${RIJKSMUSEUM_API_KEY}&format=json&q=${query}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Rijksmuseum artwork list');
    }

    const data = await response.json();

    if (!data.artObjects || data.artObjects.length === 0) {
      throw new Error('No artworks found');
    }

    const randomIndex = Math.floor(Math.random() * data.artObjects.length);
    const artwork = data.artObjects[randomIndex];

    return {
      title: artwork.title,
      artist: artwork.principalOrFirstMaker,
      image: artwork.webImage?.url || '',
      link: artwork.links?.web || '',
    };
  } catch (error) {
    console.error('Error fetching Rijksmuseum artwork:', error);
    return null;
  }
}
