import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import OpenSeadragon from 'openseadragon';
import useArtwork from './useArtwork';

jest.mock('./useArtwork', () => jest.fn());
jest.mock('openseadragon', () => jest.fn());
let container, root, destroy, refresh;
const click = selector => act(() => container.querySelector(selector).click());
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  jest.useFakeTimers();
  refresh = jest.fn(); destroy = jest.fn();
  useArtwork.mockReturnValue({ artwork: { primaryImage: 'https://example.com/art.jpg', title: 'Test', source: 'Test Museum' }, loading: false, refresh, secondsRemaining: 600 });
  OpenSeadragon.mockReturnValue({ destroy, viewport: { goHome: jest.fn() } });
  container = document.createElement('div'); document.body.appendChild(container);
  root = createRoot(container); act(() => root.render(<App />));
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.useRealTimers(); jest.clearAllMocks(); });
test('touch users can open and close the viewer with gentle wheel settings', () => {
  click('.zoom-button');
  expect(OpenSeadragon).toHaveBeenCalledWith(expect.objectContaining({ zoomPerScroll: 1.05, gestureSettingsTouch: { pinchToZoom: true, dragToPan: true }, showNavigationControl: false }));
  click('.exit-canvas-button'); expect(destroy).toHaveBeenCalledTimes(1);
});
test('pause and open panels suspend rotation through the hook', () => {
  click('.playback button'); expect(useArtwork.mock.calls.at(-1)[2]).toBe(true);
  click('.playback button'); expect(useArtwork.mock.calls.at(-1)[2]).toBe(false);
  click('.control-dock button'); expect(container.querySelector('[role=dialog]')).toBeTruthy();
  expect(useArtwork.mock.calls.at(-1)[2]).toBe(true);
  click('[aria-label="Close panel"]'); expect(useArtwork.mock.calls.at(-1)[2]).toBe(false);
});
test('saving twice toggles the favorite without duplicates', () => {
  click('.control-dock button:nth-child(3)'); expect(JSON.parse(localStorage.getItem('favorites'))).toHaveLength(1);
  click('.control-dock button:nth-child(3)'); expect(JSON.parse(localStorage.getItem('favorites'))).toHaveLength(0);
});
test('controls hide after inactivity and return with interaction', () => {
  act(() => jest.advanceTimersByTime(5000));
  expect(container.querySelector('.controls-visible')).toBeNull();
  click('.art-stage'); expect(container.querySelector('.controls-visible')).toBeTruthy();
});
