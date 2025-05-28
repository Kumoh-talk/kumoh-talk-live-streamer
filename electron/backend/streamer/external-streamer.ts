import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { TypedEmitter } from 'tiny-typed-emitter';
import { VideoCaptureOptions } from '../types';

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
    videoCodec: 'libx264',
    videoPreset: 'veryfast',
    resolution: {
      width: 1280,
      height: 720,
      frameRate: 30,
    },
    videoBitrate: 3000,
    audioCodec: 'aac',
    audioBitrate: 160,
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

  public start = async () => {
    await this.stop();
    const [command, args] = this.generateCommand();
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
    client.stdin.on('error', stdHandler);

    client.on('close', (code) => {
      console.log(`${this.name} process exited with code ${code}`);
      this.stream = null;
    });
    this.stream = client;
  };

  protected abstract generateCommand: () => [string, string[]];

  protected abstract parseStats: (data: string) => ExternalStreamerStats | null;

  public stop = async () => {
    if (this.stream !== null) {
      this.stream.kill('SIGTERM');
      if (!this.stream.stdin.destroyed) {
        this.stream.stdin.end();
      }
      await this.waitForStop();
    }
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

  public sendChunk = (chunk: Buffer) => {
    try {
      this.stream?.stdin.write(chunk);
    } catch (error) {
      console.error(`Error sending chunk to ${this.name}:`, error);
    }
  };

  public setStreamKey = (key: string) => {
    this.streamKey = key;
  };

  public setVideoCodec = (videoCodec: string, videoPreset: string) => {
    this._options.videoCodec = videoCodec;
    this._options.videoPreset = videoPreset;
  };

  public setResolution = (width: number, height: number, frameRate: number) => {
    this._options.resolution = { width, height, frameRate };
  };

  public setVideoBitrate = (bitrate: number) => {
    this._options.videoBitrate = bitrate;
  };

  public setAudioCodec = (audioCodec: string, audioBitrate: number) => {
    this._options.audioCodec = audioCodec;
    this._options.audioBitrate = audioBitrate;
  };

  public setAudioBitrate = (bitrate: number) => {
    this._options.audioBitrate = bitrate;
  };
}
