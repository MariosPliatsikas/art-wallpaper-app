export async function fetchArtwork() {
  const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=painting');
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
  const artworkID = data.objectIDs[randomIndex];

  const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkID}`);
  const artwork = await res.json();

  return artwork;
}
