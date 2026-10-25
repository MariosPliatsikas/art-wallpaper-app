import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from './App';
import OpenSeadragon from 'openseadragon';

jest.mock('./useArtwork', () => () => ({ artwork: { primaryImage: 'https://example.com/art.jpg', title: 'Test' }, loading: false }));
jest.mock('openseadragon', () => jest.fn());
jest.mock('./ArtworkInfo', () => () => null);
jest.mock('./components/CategoryMenu', () => () => null);

test('touch users can open and close the viewer with gentle wheel settings', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia = jest.fn(() => ({ matches: false }));
  const destroy = jest.fn();
  OpenSeadragon.mockReturnValue({ destroy });
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(<App />));
  act(() => container.querySelector('.zoom-button').click());
  expect(OpenSeadragon).toHaveBeenCalledWith(expect.objectContaining({
    zoomPerScroll: 1.05,
    gestureSettingsTouch: { pinchToZoom: true, dragToPan: true },
    showNavigationControl: false,
  }));
  act(() => container.querySelector('.exit-canvas-button').click());
  expect(destroy).toHaveBeenCalledTimes(1);
  act(() => root.unmount());
  container.remove();
});
