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


  public generateCommand = (): [string, string[]] => {
    const exePath = this.getExecutablePath();
    return [
      exePath,
      [
        `-v`,
        `fdsrc`,
        `! matroskademux name=demux demux.video_0 ! vp8dec ! videoconvert`,
        // `! qsvh264enc bitrate=${this._options.bitrate}`,
        // `! x264enc bitrate=${Math.floor(this._options.bitrate / 2)} tune=zerolatency`,
        `! nvh264enc bitrate=${1000}`,
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
