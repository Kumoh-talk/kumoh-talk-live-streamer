import { BrowserWindow, ipcMain } from 'electron';
import { FfmpegClient } from './ffmpeg-client';
import { ExternalStreamer } from './external-streamer';
import { StreamType } from '../types';

export class StreamClient {
  private win: BrowserWindow;

  private desktopClient: ExternalStreamer;
  private webcamClient: ExternalStreamer;

  private _streamKey: string = '';
  private set streamKey(value: string) {
    this._streamKey = value;
    this.desktopClient.setStreamKey(`${process.env.RTMP_URL}/live/${this._streamKey}_desktop`);
    this.webcamClient.setStreamKey(`${process.env.RTMP_URL}/live/${this._streamKey}_webcam`);
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

    ipcMain.handle('stream/media-chunk-desktop', async (_, chunk: ArrayBuffer) => {
      this.desktopClient.sendChunk(Buffer.from(new Uint8Array(chunk)));
    });

    ipcMain.handle('stream/media-chunk-webcam', async (_, chunk: ArrayBuffer) => {
      this.webcamClient.sendChunk(Buffer.from(new Uint8Array(chunk)));
    });

    ipcMain.handle('stream/get-stream-key', async () => {
      return this._streamKey;
    });
    ipcMain.handle('stream/set-stream-key', async (_, streamKey: string) => {
      this.streamKey = streamKey;
    });

    ipcMain.handle('stream/get-video-codec', async () => {
      return {
        codec: this.desktopClient.options.videoCodec,
        preset: this.desktopClient.options.videoPreset,
      };
    });
    ipcMain.handle('stream/set-video-codec', async (_, videoCodec: string, videoPreset: string) => {
      this.desktopClient.options.videoCodec = videoCodec;
      this.desktopClient.options.videoPreset = videoPreset;
      this.webcamClient.options.videoCodec = videoCodec;
      this.webcamClient.options.videoPreset = videoPreset;
    });
    ipcMain.handle('stream/get-resolution', async (_, streamType: StreamType) => {
      if (streamType === 'desktop') {
        return this.desktopClient.options.resolution;
      }
      return this.webcamClient.options.resolution;
    });
    ipcMain.handle(
      'stream/set-resolution',
      async (_, streamType: StreamType, width: number, height: number, frameRate: number) => {
        if (streamType === 'desktop') {
          this.desktopClient.options.resolution = { width, height, frameRate };
        } else {
          this.webcamClient.options.resolution = { width, height, frameRate };
        }
      }
    );
    ipcMain.handle('stream/get-video-bitrate', async (_, streamType: StreamType) => {
      if (streamType === 'desktop') {
        return this.desktopClient.options.videoBitrate;
      }
      return this.webcamClient.options.videoBitrate;
    });
    ipcMain.handle(
      'stream/set-video-bitrate',
      async (_, streamType: StreamType, bitrate: number) => {
        if (streamType === 'desktop') {
          this.desktopClient.options.videoBitrate = bitrate;
        } else {
          this.webcamClient.options.videoBitrate = bitrate;
        }
      }
    );
    ipcMain.handle('stream/get-audio-codec', async () => {
      return this.desktopClient.options.audioCodec;
    });
    ipcMain.handle(
      'stream/set-audio-codec',
      async (_, audioCodec: string, audioBitrate: number) => {
        this.desktopClient.options.audioCodec = audioCodec;
        this.desktopClient.options.audioBitrate = audioBitrate;
        this.webcamClient.options.audioCodec = audioCodec;
        this.webcamClient.options.audioBitrate = audioBitrate;
      }
    );
    ipcMain.handle('stream/get-audio-bitrate', async () => {
      return this.desktopClient.options.audioBitrate;
    });
    ipcMain.handle('stream/set-audio-bitrate', async (_, bitrate: number) => {
      this.desktopClient.options.audioBitrate = bitrate;
      this.webcamClient.options.audioBitrate = bitrate;
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
      this.desktopClient.start();
    }
    if (!this.webcamClient.isStarted) {
      this.webcamClient.start();
    }
  };

  stop = () => {
    this.desktopClient.stop();
    this.webcamClient.stop();
  };
}
