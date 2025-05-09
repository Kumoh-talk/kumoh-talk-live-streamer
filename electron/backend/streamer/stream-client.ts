import { BrowserWindow, ipcMain } from 'electron';
import { GstreamerClient } from './gstreamer-client';

const dummyRtp = {
  ssrc: 1,
  ipAddress: 'string',
  rtpPort: 1,
  rtcpPort: 1,
};

export class StreamClient {
  private win: BrowserWindow;

  private desktopClient: GstreamerClient;
  private webcamClient: GstreamerClient;

  private _streamKey: string = '';
  private set streamKey(value: string) {
    this._streamKey = value;
    this.desktopClient.setStreamKey(this._streamKey + '/desktop');
    this.webcamClient.setStreamKey(this._streamKey + '/webcam');
  }

  constructor(win: BrowserWindow) {
    this.win = win;

    this.desktopClient = new GstreamerClient();
    this.desktopClient.setDevice('screen', '0');

    this.webcamClient = new GstreamerClient();

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

    ipcMain.handle('stream/get-stream-key', async () => {
      return this._streamKey;
    });
    ipcMain.handle('stream/set-stream-key', async (_, streamKey: string) => {
      this.streamKey = streamKey;
    });
  };

  getConnStatus = () => {
    const desktopClient = this.desktopClient.isStarted;
    const webcamClient = this.webcamClient.isStarted;
    console.log('getConnStatus', this.desktopClient.isStarted, this.webcamClient.isStarted);
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
