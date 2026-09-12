import metProvider from './metProvider';
import clevelandProvider from './clevelandProvider';

const providers = [metProvider, clevelandProvider];

export function getMuseumProviders() {
  return providers;
}

export function getMuseumProvider(id) {
  return providers.find((provider) => provider.id === id) || null;
}

export function getMuseumOptions() {
  return providers.map(({ id, name }) => ({ id, name }));
}

export default providers;
