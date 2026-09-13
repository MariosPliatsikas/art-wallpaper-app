# Art Wallpaper Museum

**One application. Multiple museums. Thousands of artworks. A new work of art on your screen.**

Art Wallpaper Museum is a React application that turns your screen into a rotating digital gallery. It brings together artworks from multiple museum APIs behind one common interface, so the user can explore art by museum, type, period, or movement without needing to know where the data came from.

## Vision

The goal is to create a calm, artwork-first experience: the artwork should remain the focus, while information, filters, favorites, and zoom are available only when the user wants them.

The project is evolving from the original Art Wallpaper App into a museum-agnostic platform that can support multiple institutions through a shared provider architecture.

## Current museum sources

- The Metropolitan Museum of Art
- Cleveland Museum of Art
- Harvard Art Museums — enabled only when a Harvard API key is configured

The Met and Cleveland integrations use public museum APIs. Harvard requires an API key.

## Features

- Random artwork discovery across enabled museums
- Museum-specific browsing
- Filters by artwork type, period, and movement
- 10-minute automatic artwork refresh
- Manual refresh without losing the selected filter or museum
- Favorites stored in localStorage
- High-resolution artwork viewing with OpenSeadragon
- Desktop artwork-first mode
  - click the artwork to show metadata temporarily
  - use the mouse wheel to enter zoom mode and continue zooming
- Mobile landscape artwork-first mode
  - tap the artwork to show metadata temporarily
  - metadata hides automatically after a few seconds
- Offline/API error state with retry behavior
- Responsive desktop and mobile layout

## Museum provider architecture

The UI does not talk directly to individual museum APIs. Each museum has its own provider that converts source-specific data into one normalized artwork model.

```text
Museum API
  ↓
Museum Provider
  ↓
normalizeArtwork()
  ↓
Common Artwork Object
  ↓
artworkService
  ↓
React UI
```

The normalized model currently contains:

```js
{
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
  medium
}
```

Museum integrations live in:

```text
src/services/museums/
```

Current providers:

```text
metProvider.js
clevelandProvider.js
harvardProvider.js
```

The registry enables only providers that are available/configured.

## Open access and image rights

Museum APIs expose artwork metadata and images under different rights conditions. The application keeps source and license information in the normalized artwork model where available.

When extending the project with new museums, image rights and API terms should be reviewed for each provider independently.

## Development

This repository uses Yarn.

### Requirements

- Node.js 20+
- Yarn

### Install

```bash
git clone https://github.com/MariosPliatsikas/art-wallpaper-app.git
cd art-wallpaper-app
yarn install
```

### Environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Harvard Art Museums is optional. To enable it, add your own key:

```text
REACT_APP_HARVARD_API_KEY=your_key_here
```

Do not commit `.env.local` or API credentials.

Note: variables prefixed with `REACT_APP_` are included in the client-side bundle. They should not be treated as true secrets.

### Start the development server

```bash
yarn start
```

### Run tests

```bash
yarn test --watchAll=false
```

### Production build

```bash
yarn build
```

## Continuous integration

The `art-wallpaper-museum-v2` branch is validated with GitHub Actions.

The workflow currently checks:

- dependency installation with the Yarn lockfile
- unit tests
- live availability of the public Met and Cleveland API endpoints
- production build

Harvard is not part of the live CI smoke test because it requires a private API key configuration.

## Deployment

The project is deployed with Vercel.

The current architecture is intentionally lightweight and primarily client-side so the project can remain economical to host while it is still being developed and tested.

Preview deployments are used to validate changes before merging them into `main`.

## Project direction

Planned improvements include:

- migrate the remaining legacy UI fields fully to the normalized artwork model
- stronger provider and artwork-service tests
- improved randomization and pagination for large museum collections
- more museum providers
- richer artwork metadata where useful
- accessibility improvements
- further refinement of desktop and mobile artwork-first controls

## Contributing

Contributions are welcome.

A useful contribution can include:

- a new museum provider
- tests for an existing provider
- UX/accessibility improvements
- documentation
- bug fixes

Please keep museum-specific logic inside its provider whenever possible instead of coupling it directly to the React UI.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Art Wallpaper Museum is currently under active development. The `art-wallpaper-museum-v2` branch is the preview/testing branch for the new multi-museum architecture.
