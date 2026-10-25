import config from '../../config';
import { getRandomHarvardArtwork } from './harvardProvider';

describe('Harvard loading', () => {
  const originalKey = config.HARVARD_API_KEY;
  const originalFetch = global.fetch;
  beforeEach(() => { config.HARVARD_API_KEY = 'test-key'; global.fetch = jest.fn(); });
  afterEach(() => { config.HARVARD_API_KEY = originalKey; global.fetch = originalFetch; });
  test('missing credentials do not issue a request', async () => {
    config.HARVARD_API_KEY = '';
    await expect(getRandomHarvardArtwork()).rejects.toThrow('not configured');
    expect(global.fetch).not.toHaveBeenCalled();
  });
  test('normalizes a usable image and skips records without images', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ records: [
      { id: 1 }, { id: 2, title: 'Test', primaryimageurl: 'https://example.com/image.jpg' }
    ] }) });
    const art = await getRandomHarvardArtwork({ type: 'Painting' });
    expect(art.id).toBe('harvard-2');
    expect(art.image).toBe('https://example.com/image.jpg');
    const url = new URL(global.fetch.mock.calls[0][0]);
    expect(url.searchParams.get('classification')).toBe('Paintings');
  });
  test('reports an invalid key without exposing its value', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 403 });
    await expect(getRandomHarvardArtwork()).rejects.toThrow('rejected the API key');
  });
  test('reports missing images', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ records: [{ id: 1 }] }) });
    await expect(getRandomHarvardArtwork()).rejects.toThrow('No Harvard artworks');
  });
});
