import toLegacyArtwork from './artworkAdapter';

describe('toLegacyArtwork', () => {
  test('maps normalized artwork fields to the legacy UI shape', () => {
    const result = toLegacyArtwork({
      id: 'met-1',
      title: 'Example',
      artist: 'Artist',
      date: '1900',
      image: 'small.jpg',
      imageLarge: 'large.jpg',
      museum: 'Museum',
      medium: 'Oil on canvas',
    });

    expect(result.primaryImage).toBe('large.jpg');
    expect(result.objectDate).toBe('1900');
    expect(result.artistDisplayName).toBe('Artist');
    expect(result.source).toBe('Museum');
    expect(result.title).toBe('Example');
  });

  test('returns null for empty input', () => {
    expect(toLegacyArtwork(null)).toBeNull();
  });
});
