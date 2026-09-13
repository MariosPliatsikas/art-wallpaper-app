/**
 * Create the museum-agnostic artwork shape used by the UI.
 */
export function normalizeArtwork({
  id,
  title,
  artist,
  date,
  image,
  imageLarge,
  museum,
  sourceUrl,
  category,
  license,
  medium,
}) {
  return {
    id: id ?? '',
    title: title || 'Untitled',
    artist: artist || 'Unknown Artist',
    date: date || 'Unknown Date',
    image: image || '',
    imageLarge: imageLarge || image || '',
    museum: museum || 'Unknown Museum',
    sourceUrl: sourceUrl || '',
    category: category || '',
    license: license || '',
    medium: medium || 'Unknown Medium',
  };
}

export default normalizeArtwork;
