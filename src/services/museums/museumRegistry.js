import metProvider from './metProvider';
import clevelandProvider from './clevelandProvider';
import harvardProvider from './harvardProvider';

const allProviders = [metProvider, clevelandProvider, harvardProvider];

const providers = allProviders.filter(
  (provider) => !provider.isConfigured || provider.isConfigured()
);

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
