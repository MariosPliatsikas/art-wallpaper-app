import {
  getMuseumProvider,
  getMuseumProviders,
  getMuseumOptions,
} from './museumRegistry';

describe('museumRegistry', () => {
  test('always exposes the configured Met and Cleveland providers', () => {
    expect(getMuseumProvider('met')).toBeTruthy();
    expect(getMuseumProvider('cleveland')).toBeTruthy();
  });

  test('returns null for an unknown provider', () => {
    expect(getMuseumProvider('does-not-exist')).toBeNull();
  });

  test('returns unique provider ids and menu options', () => {
    const providers = getMuseumProviders();
    const ids = providers.map((provider) => provider.id);
    const options = getMuseumOptions();

    expect(new Set(ids).size).toBe(ids.length);
    expect(options).toHaveLength(providers.length);
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'met' }),
        expect.objectContaining({ id: 'cleveland' }),
      ])
    );
  });
});
