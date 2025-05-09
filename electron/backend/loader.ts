import { BrowserWindow } from 'electron';
import { StreamClient } from './streamer/stream-client';

export const loadBackend = (win: BrowserWindow) => {
  new StreamClient(win);
};
