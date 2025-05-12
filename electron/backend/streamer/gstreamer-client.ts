import { ExternalStreamer, ExternalStreamerStats } from './external-streamer';
import { app } from 'electron';
import path from 'path';

const isDev = !app.isPackaged;

export type KeyValueType = {
  key: string;
  type: string;
  value: string | KeyValueType[];
};

export class GstreamerClient extends ExternalStreamer {
  public readonly name = 'gstreamer';
  public streamKey: string = '';

  private generateSource = () => {
    switch (this._options.device.type) {
      case 'screen':
        return [
          `d3d11screencapturesrc`,
          `monitor-index=${this._options.device.name}`,
          `show-cursor=true`,
          // `crop-width=${this._options.resolution.width}`,
          // `crop-height=${this._options.resolution.height}`,
          `!`,
          `video/x-raw(memory:D3D11Memory)`,
          `! queue`,
          `! d3d11convert`,
          `! video/x-raw(memory:D3D11Memory),format=NV12,width=${this._options.resolution.width},height=${this._options.resolution.height},framerate=${this._options.resolution.frameRate}/1`,
          `! d3d11download`,
        ];
      case 'camera':
        return [`mfvideosrc`, `device-name="${this._options.device.name}"`, `!`, `d3d11upload`,
          `! d3d11convert`,
          `! video/x-raw(memory:D3D11Memory),format=NV12`,
          `! d3d11download`,];
      case 'window':
        return [
          `d3d11screencapturesrc`,
          `window-handle=${this._options.device.name}`,
          `show-cursor=true`,
          // `crop-width=${this._options.resolution.width}`,
          // `crop-height=${this._options.resolution.height}`,
          `!`,
          `video/x-raw(memory:D3D11Memory)`,
          `! queue`,
          `! d3d11convert`,
          `! video/x-raw(memory:D3D11Memory),format=NV12,width=${this._options.resolution.width},height=${this._options.resolution.height},framerate=${this._options.resolution.frameRate}/1`,
          `! d3d11download`,
        ];
      default:
        throw new Error('Invalid device type');
    }
  };

  public generateCommand = (): [string, string[]] => {
    const exePath = this.getExecutablePath();
    const source = this.generateSource();
    return [
      exePath,
      [
        `-v`,
        source,
        `! qsvh264enc bitrate=${this._options.bitrate}`,
        // `! x264enc bitrate=${Math.floor(this._options.bitrate / 2)} tune=zerolatency`,
        // `! nvh264enc bitrate=${Math.floor(this._options.bitrate / 2)}`,
        `! h264parse ! video/x-h264,profile=high ! queue ! mux.`,
        `wasapisrc ! audioconvert ! audioresample ! voaacenc bitrate=128000 ! queue ! mux.`,
        `flvmux name=mux streamable=true ! queue `,
        `! rtmpsink location=${this.streamKey}`,
      ].flatMap((v) => (Array.isArray(v) ? v : v.split(' '))),
    ];
  };

  private getExecutablePath = () => {
    if (isDev) {
      return path.join(
        app.getAppPath(),
        'public/lib/gstreamer/1.0/msvc_x86_64/bin/gst-launch-1.0.exe'
      );
    } else {
      return path.join(
        process.resourcesPath,
        'lib/gstreamer/1.0/msvc_x86_64/bin/gst-launch-1.0.exe'
      );
    }
  };

  protected parseStats = (data: string): ExternalStreamerStats | null => {
    const matched = data.match(/^\/GstPipeline:pipeline.+: stats = (.+?);(?!")/);
    if (!matched) {
      return null;
    }
    const parsed = this.parseKeyValue(matched[1]);
    // const frameSent = parseInt(data.match(/frame=\s*(\d+)/)?.[1] ?? '0');
    // const bytesSent = parseInt(data.match(/size=\s*(\d+)/)?.[1] ?? '0');
    // const fps = parseInt(data.match(/fps=\s*(\d+)/)?.[1] ?? '0');
    const currentBitrate = parseInt(
      ((parsed.find((v) => v.key === 'source-stats')?.value as KeyValueType[]).find(
        (v) => v.key === 'bitrate'
      )?.value as string) ?? '0'
    );
    // const timeString =
    //   data.match(/time=(\d+:\d+:\d+\.\d+)/)?.[1] ?? '00:00:00.00';
    // const timestamp = new Date(`1970-01-01T${timeString}Z`).getTime();
    return { frameSent: 0, bytesSent: 0, fps: 0, currentBitrate, timestamp: 0 };
  };

  private parseKeyValue = (data: string): KeyValueType[] => {
    return data.split(', ').map((pair) => {
      if (pair.includes('=')) {
        const key = pair.slice(0, pair.indexOf('='));
        const typevalue = pair.slice(pair.indexOf('=') + 1).replaceAll('\\', '');
        const type = typevalue.slice(1, typevalue.indexOf(')'));
        const value = typevalue.slice(typevalue.indexOf(')') + 1);
        if (type === 'GValueArray') {
          return {
            key,
            type,
            value: this.parseKeyValue(value.slice(3, -4)),
          };
        }
        return {
          key,
          type,
          value,
        };
      } else {
        return {
          key: pair,
          type: 'key',
          value: '',
        };
      }
    });
  };

  public setStreamKey = (key: string) => {
    this.streamKey = key;
  };
}
