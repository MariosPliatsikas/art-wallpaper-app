import { getMuseumProvider, getMuseumProviders } from './museumRegistry';

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

/**
 * Fetch artwork from a specific museum or try all enabled providers in random order.
 */
export async function getRandomArtwork({ museumId = '', query = 'painting' } = {}) {
  const providers = museumId
    ? [getMuseumProvider(museumId)].filter(Boolean)
    : shuffled(getMuseumProviders());

  if (!providers.length) {
    throw new Error(`Unknown museum provider: ${museumId}`);
  }

  const errors = [];

  for (const provider of providers) {
    try {
      const artwork = await provider.getRandomArtwork(query);
      if (artwork?.image) return artwork;
    } catch (error) {
      errors.push(`${provider.name}: ${error.message}`);
      console.warn(`Museum provider failed: ${provider.id}`, error);
    }
  }

  throw new Error(errors.length ? errors.join(' | ') : 'No artwork providers succeeded');
}

export default getRandomArtwork;
