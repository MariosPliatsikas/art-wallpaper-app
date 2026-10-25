import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import useArtwork from './useArtwork';
import getRandomArtwork from './services/museums/artworkService';
jest.mock('./services/museums/artworkService', () => jest.fn());
let latest, root, container;
function Probe({ paused }) { latest = useArtwork('random', '', paused); return null; }
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true; jest.useFakeTimers();
  getRandomArtwork.mockResolvedValue({ id: 'test', image: 'https://example.com/image.jpg' });
  container = document.createElement('div'); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); jest.useRealTimers(); jest.clearAllMocks(); });
test('pause freezes the remaining time and resume continues it', async () => {
  await act(async () => root.render(<Probe paused={false} />));
  act(() => jest.advanceTimersByTime(5000)); expect(latest.secondsRemaining).toBe(595);
  act(() => root.render(<Probe paused />));
  act(() => jest.advanceTimersByTime(10000)); expect(latest.secondsRemaining).toBe(595);
  act(() => root.render(<Probe paused={false} />));
  act(() => jest.advanceTimersByTime(1000)); expect(latest.secondsRemaining).toBe(594);
  expect(getRandomArtwork).toHaveBeenCalledTimes(1);
});
test('rotation fetches another artwork when the countdown ends', async () => {
  await act(async () => root.render(<Probe paused={false} />));
  await act(async () => jest.advanceTimersByTime(600000));
  expect(getRandomArtwork.mock.calls.length).toBeGreaterThan(1);
  expect(latest.secondsRemaining).toBe(600);
});
