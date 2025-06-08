import { BrowserWindow, ipcMain } from 'electron';
import { StreamClient } from './streamer/stream-client';
import { URL } from 'url';
import path from 'node:path';

export const loadBackend = (win: BrowserWindow) => {
  new StreamClient(win);

  ipcMain.handle('options/open-login-popup', async (_, provider: string) => {
    const authWindow = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
      autoHideMenuBar: true,
      width: 900,
      height: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
      title: '야밤의 금오톡 로그인',
    });

    const url = `${
      process.env.KUMOH_TALK_API_URL
    }/api/users/oauth2/${provider}?redirect-uri=${encodeURIComponent(
      'https://kumoh-talk.com/streamer/callback'
    )}&mode=login`;

    authWindow.loadURL(url);

    return new Promise((resolve, reject) => {
      const { session } = authWindow.webContents;

      const filter = { urls: ['https://kumoh-talk.com/streamer/callback*'] };

      session.webRequest.onBeforeRequest(filter, (details, callback) => {
        const redirectUrl = details.url;
        const parsed = new URL(redirectUrl);
        const accessToken = parsed.searchParams.get('access-token');
        const refreshToken = parsed.searchParams.get('refresh-token');
        resolve({
          accessToken,
          refreshToken,
        });

        authWindow.close();
        callback({ cancel: true });
      });

      authWindow.on('closed', () => {
        reject(new Error('User closed the window'));
      });
    });
  });
};
