import { ipcRenderer, contextBridge, CookiesSetDetails, CookiesGetFilter } from 'electron';
import { StreamType } from './backend/types';
import { ApiError, ApiResponse } from '@/types/api';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});

declare global {
  interface Window {
    screenCapture: {
      getDesktopSources: () => Promise<
        {
          id: string;
          name: string;
          thumbnail: string;
          display_id: string;
          appIcon: string | null;
        }[]
      >;
      selectSource: (sourceId: string) => Promise<void>;
    };
    stream: {
      start: () => Promise<void>;
      stop: () => Promise<void>;

      getConnStatus: () => Promise<Record<StreamType, boolean>>;
      onChangeConnStatus: (
        listener: (event: Electron.IpcRendererEvent, status: Record<StreamType, boolean>) => void
      ) => void;
      offChangeConnStatus: (
        listener: (event: Electron.IpcRendererEvent, status: Record<StreamType, boolean>) => void
      ) => void;

      sendChunk: (streamType: StreamType, chunk: ArrayBuffer) => Promise<void>;
    };
    options: {
      openLoginPopup: (provider: string) => Promise<{
        accessToken: string;
        refreshToken: string;
      }>;

      getStreamKey: () => Promise<string>;
      setStreamKey: (streamKey: string) => Promise<void>;

      getVideoCodec: () => Promise<{ codec: string; preset: string }>;
      setVideoCodec: (videoCodec: string, videoPreset: string) => Promise<void>;
      getResolution: (
        streamType: StreamType
      ) => Promise<{ width: number; height: number; frameRate: number }>;
      setResolution: (
        streamType: StreamType,
        width: number,
        height: number,
        frameRate: number
      ) => Promise<void>;
      getVideoBitrate: (streamType: StreamType) => Promise<number>;
      setVideoBitrate: (streamType: StreamType, bitrate: number) => Promise<void>;
      getAudioCodec: () => Promise<string>;
      setAudioCodec: (audioCodec: string, audioBitrate: number) => Promise<void>;
      getAudioBitrate: () => Promise<number>;
      setAudioBitrate: (bitrate: number) => Promise<void>;
    };
    api: {
      fetch: (
        input: string | URL | globalThis.Request,
        init?: RequestInit
      ) => Promise<ApiResponse<unknown> | ApiError>;
    };
    electronCookie: {
      set: (cookie: CookiesSetDetails) => Promise<void>;
      get: (filter: CookiesGetFilter) => Promise<CookiesSetDetails[]>;
      remove: (url: string, name: string) => Promise<void>;
    };
  }
}

contextBridge.exposeInMainWorld('stream', {
  start: () => ipcRenderer.invoke('stream/start'),
  stop: () => ipcRenderer.invoke('stream/stop'),

  getConnStatus: () => ipcRenderer.invoke('stream/get-conenction-status'),
  onChangeConnStatus: (
    listener: (event: Electron.IpcRendererEvent, status: Record<StreamType, boolean>) => void
  ) => {
    ipcRenderer.on('stream/on-connection-status', listener);
  },
  offChangeConnStatus: (
    listener: (event: Electron.IpcRendererEvent, status: Record<StreamType, boolean>) => void
  ) => {
    ipcRenderer.off('stream/on-connection-status', listener);
  },

  sendChunk: async (streamType: StreamType, chunk: ArrayBuffer) => {
    await ipcRenderer.invoke(`stream/media-chunk-${streamType}`, chunk);
  },
});

contextBridge.exposeInMainWorld('options', {
  openLoginPopup: (provider: string) => ipcRenderer.invoke('options/open-login-popup', provider),

  getStreamKey: () => ipcRenderer.invoke('stream/get-stream-key'),
  setStreamKey: async (streamKey: string) => {
    await ipcRenderer.invoke('stream/set-stream-key', streamKey);
  },

  getVideoCodec: () => ipcRenderer.invoke('stream/get-video-codec'),
  setVideoCodec: async (videoCodec: string, videoPreset: string) => {
    await ipcRenderer.invoke('stream/set-video-codec', videoCodec, videoPreset);
  },
  getResolution: (streamType: StreamType) =>
    ipcRenderer.invoke('stream/get-resolution', streamType),
  setResolution: async (
    streamType: StreamType,
    width: number,
    height: number,
    frameRate: number
  ) => {
    await ipcRenderer.invoke('stream/set-resolution', streamType, width, height, frameRate);
  },
  getVideoBitrate: (streamType: StreamType) =>
    ipcRenderer.invoke('stream/get-video-bitrate', streamType),
  setVideoBitrate: async (streamType: StreamType, bitrate: number) => {
    await ipcRenderer.invoke('stream/set-video-bitrate', streamType, bitrate);
  },
  getAudioCodec: () => ipcRenderer.invoke('stream/get-audio-codec'),
  setAudioCodec: async (audioCodec: string, audioBitrate: number) => {
    await ipcRenderer.invoke('stream/set-audio-codec', audioCodec, audioBitrate);
  },
  getAudioBitrate: () => ipcRenderer.invoke('stream/get-audio-bitrate'),
  setAudioBitrate: async (bitrate: number) => {
    await ipcRenderer.invoke('stream/set-audio-bitrate', bitrate);
  },
});

contextBridge.exposeInMainWorld('screenCapture', {
  getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  selectSource: async (sourceId: string) => {
    await ipcRenderer.invoke('select-source', sourceId);
  },
});

contextBridge.exposeInMainWorld('api', {
  fetch: async (input: string | URL | globalThis.Request, init?: RequestInit) =>
    await ipcRenderer.invoke('api/fetch', input, init),
});

contextBridge.exposeInMainWorld('electronCookie', {
  set: (cookie: CookiesSetDetails) => ipcRenderer.invoke('cookie/set', cookie),
  get: (filter: CookiesGetFilter) => ipcRenderer.invoke('cookie/get', filter),
  remove: (url: string, name: string) => ipcRenderer.invoke('cookie/remove', url, name),
});
