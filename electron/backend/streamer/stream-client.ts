import { BrowserWindow, ipcMain } from 'electron';
import { FfmpegClient } from './ffmpeg-client';
import { ExternalStreamer } from './external-streamer';

const dummyRtp = {
  ssrc: 1,
  ipAddress: 'string',
  rtpPort: 1,
  rtcpPort: 1,
};

export class StreamClient {
  private win: BrowserWindow;

  private desktopClient: ExternalStreamer;
  private webcamClient: ExternalStreamer;

  private _streamKey: string = '';
  private set streamKey(value: string) {
    this._streamKey = value;
    this.desktopClient.setStreamKey(this._streamKey + '_desktop');
    this.webcamClient.setStreamKey(this._streamKey + '_webcam');
  }

  constructor(win: BrowserWindow) {
    this.win = win;

    this.desktopClient = new FfmpegClient();
    this.webcamClient = new FfmpegClient();

    this.handleEvents();
  }

  handleEvents = () => {
    ipcMain.handle('stream/start', async () => {
      this.start();
    });
    ipcMain.handle('stream/stop', async () => {
      this.stop();
    });

    ipcMain.handle('stream/get-conenction-status', async () => {
      return this.getConnStatus();
    });
    this.desktopClient.on('start', this.sendConnStatus);
    this.webcamClient.on('start', this.sendConnStatus);
    this.desktopClient.on('stop', this.sendConnStatus);
    this.webcamClient.on('stop', this.sendConnStatus);

    ipcMain.handle('stream/set-source-desktop', async (_, deviceName: string) => {
      const [type, id] = deviceName.split(':');
      console.log('set-source-desktop', type, id);
      this.desktopClient.setDevice(type as 'window' | 'screen', id);
    });

    ipcMain.handle('stream/set-source-webcam', async (_, deviceName: string) => {
      const converted = deviceName.split(' (')[0];
      this.webcamClient.setDevice('camera', converted);
    });

    ipcMain.handle('stream/get-stream-key', async () => {
      return this._streamKey;
    });
    ipcMain.handle('stream/set-stream-key', async (_, streamKey: string) => {
      this.streamKey = streamKey;
    });

    ipcMain.handle('stream/media-chunk-desktop', async (_, chunk: ArrayBuffer) => {
      this.desktopClient.sendChunk(Buffer.from(new Uint8Array(chunk)));
    });

    ipcMain.handle('stream/media-chunk-webcam', async (_, chunk: ArrayBuffer) => {
      this.webcamClient.sendChunk(Buffer.from(new Uint8Array(chunk)));
    });
  };

  getConnStatus = () => {
    const desktopClient = this.desktopClient.isStarted;
    const webcamClient = this.webcamClient.isStarted;
    return {
      desktop: desktopClient,
      webcam: webcamClient,
    };
  };

  sendConnStatus = () => {
    this.win.webContents.send('stream/on-connection-status', this.getConnStatus());
  };

  start = () => {
    if (!this.desktopClient.isStarted) {
      this.desktopClient.start(dummyRtp);
    }
    if (!this.webcamClient.isStarted) {
      this.webcamClient.start(dummyRtp);
    }
  };

  stop = () => {
    this.desktopClient.stop();
    this.webcamClient.stop();
  };
}
