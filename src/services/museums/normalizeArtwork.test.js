import normalizeArtwork from './normalizeArtwork';

describe('normalizeArtwork', () => {
  test('fills the common artwork model with sensible fallbacks', () => {
    const artwork = normalizeArtwork({
      id: 'test-1',
      title: '',
      artist: '',
      date: '',
      image: 'https://example.com/small.jpg',
      imageLarge: '',
      museum: 'Test Museum',
    });

    expect(artwork).toEqual(
      expect.objectContaining({
        id: 'test-1',
        title: 'Untitled',
        artist: 'Unknown Artist',
        date: 'Unknown Date',
        image: 'https://example.com/small.jpg',
        imageLarge: 'https://example.com/small.jpg',
        museum: 'Test Museum',
        medium: 'Unknown Medium',
      })
    );
  });
});
