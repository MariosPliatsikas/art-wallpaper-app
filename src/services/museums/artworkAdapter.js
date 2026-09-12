/**
 * Temporary compatibility adapter for the existing UI.
 * This lets the new normalized provider model coexist with legacy components
 * until App.js and ArtworkInfo.js are migrated to the new field names.
 */
export function toLegacyArtwork(artwork) {
  if (!artwork) return null;

  return {
    ...artwork,
    primaryImage: artwork.imageLarge || artwork.image,
    objectDate: artwork.date,
    artistDisplayName: artwork.artist,
    source: artwork.museum,
  };
}

export default toLegacyArtwork;
