import { ipcRenderer, contextBridge } from 'electron';
import { StreamType } from './backend/types';

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

      getSourceDesktop: () => Promise<string>;
      setSourceDesktop: (sourceId: string) => Promise<void>;
      setSourceWebcam: (sourceId: string) => Promise<void>;
      getSourceWebcam: () => Promise<string>;

      getStreamKey: () => Promise<string>;
      setStreamKey: (streamKey: string) => Promise<void>;
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

  getStreamKey: () => ipcRenderer.invoke('stream/get-stream-key'),
  setStreamKey: async (streamKey: string) => {
    await ipcRenderer.invoke('stream/set-stream-key', streamKey);
  },

  getSourceDesktop: () => ipcRenderer.invoke('stream/get-source-desktop'),
  setSourceDesktop: async (sourceId: string) => {
    await ipcRenderer.invoke('stream/set-source-desktop', sourceId);
  },
  getSourceWebcam: () => ipcRenderer.invoke('stream/get-source-webcam'),
  setSourceWebcam: async (sourceId: string) => {
    await ipcRenderer.invoke('stream/set-source-webcam', sourceId);
  },
});

contextBridge.exposeInMainWorld('screenCapture', {
  getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  selectSource: async (sourceId: string) => {
    await ipcRenderer.invoke('select-source', sourceId);
  },
});
