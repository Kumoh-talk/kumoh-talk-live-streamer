import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { TypedEmitter } from 'tiny-typed-emitter';
import { VideoCaptureOptions, VideoCaptureRtpParams } from '../types';

export type ExternalStreamerStats = {
  frameSent: number;
  bytesSent: number;
  fps: number;
  currentBitrate: number;
  timestamp: number;
};

export interface ExternalStreamerEventMap {
  start: () => void;
  stop: () => void;
}

export abstract class ExternalStreamer extends TypedEmitter<ExternalStreamerEventMap> {
  public abstract readonly name: string;
  public isStarted = false;
  public streamKey: string = '';

  protected _stream: ChildProcessWithoutNullStreams | null = null;
  protected set stream(value: ChildProcessWithoutNullStreams | null) {
    if (this._stream !== value) {
      this._stream = value;

      this.isStarted = !!value;
      this.emit(value ? 'start' : 'stop');
    }
  }
  protected get stream() {
    return this._stream;
  }

  protected _options: VideoCaptureOptions = {
    device: {
      type: 'camera',
      name: 'OBS Virtual Camera',
    },
    resolution: {
      width: 1920,
      height: 1080,
      frameRate: 60,
    },
    bitrate: 6000,
  };
  public get options() {
    return this._options;
  }

  protected _stats: ExternalStreamerStats = {
    frameSent: 0,
    bytesSent: 0,
    fps: 0,
    currentBitrate: 0,
    timestamp: 0,
  };

  public start = async (rtp: VideoCaptureRtpParams) => {
    await this.stop();
    const [command, args] = this.generateCommand(rtp);
    console.log(command, args.join(' '));
    const client = spawn(command, args).on('error', function (err) {
      console.log(err);
    });
    const stdHandler = (data: string) => {
      const stats = this.parseStats(data.toString());
      if (stats) {
        this._stats = stats;
        console.log(
          `stats: fps=${this._stats.fps}, bitrate=${
            this._stats.currentBitrate / 1024
          }Kbps, timestamp=${this._stats.timestamp}`
        );
      } else {
        console.log(`${this.name} message: ${data}`);
      }
    };
    client.stdout.on('data', stdHandler);
    client.stderr.on('data', stdHandler);

    client.on('close', (code) => {
      console.log(`${this.name} process exited with code ${code}`);
      this.stream = null;
    });
    this.stream = client;
  };

  public stop = async () => {
    if (this.stream !== null) {
      this.stream.kill('SIGTERM');
      await this.waitForStop();
    }
  };

  public setDevice = (type: 'screen' | 'camera' | 'window', device: string) => {
    this._options.device = {
      type,
      name: device,
    };
  };

  public setResolution = (width: number, height: number, frameRate: number) => {
    this._options.resolution = { width, height, frameRate };
  };

  public setBitrate = (bitrate: number) => {
    this._options.bitrate = bitrate;
  };

  protected waitForStop = async () => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.stream === null) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };

  public setStreamKey = (key: string) => {
    this.streamKey = key;
  };

  public sendChunk = (chunk: Buffer) => {
    this.stream?.stdin.write(chunk);
  };

  protected abstract generateCommand: (rtp: VideoCaptureRtpParams) => [string, string[]];

  protected abstract parseStats: (data: string) => ExternalStreamerStats | null;
}
