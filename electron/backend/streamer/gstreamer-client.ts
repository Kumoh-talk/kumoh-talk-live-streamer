import { ExternalStreamer, ExternalStreamerStats } from './external-streamer';

export type KeyValueType = {
  key: string;
  type: string;
  value: string | KeyValueType[];
};

export class GstreamerClient extends ExternalStreamer {
  public readonly name = 'gstreamer';
  public streamKey: string = '';

  public generateCommand = (): [string, string[]] => {
    const source =
      this._options.device.type === 'screen'
        ? [
            `d3d11screencapturesrc`,
            `monitor-index=${this._options.device.name}`,
            `show-cursor=true`,
            // `crop-width=${this._options.resolution.width}`,
            // `crop-height=${this._options.resolution.height}`,
            `!`,
            `video/x-raw(memory:D3D11Memory)`,
          ]
        : [`mfvideosrc`, `device-name="${this._options.device.name}"`, `!`, `d3d11upload`];
    return [
      'gst-launch-1.0',
      [
        `-v`,
        source,
        `! queue`,
        `! d3d11convert`,
        `! video/x-raw(memory:D3D11Memory),format=NV12,width=${this._options.resolution.width},height=${this._options.resolution.height},framerate=${this._options.resolution.frameRate}/1`,
        `! d3d11download`,
        `! nvh264enc bitrate=${Math.floor(this._options.bitrate / 2)}`,
        `! video/x-h264,profile=high ! h264parse`,
        `! flvmux streamable=true ! queue `,
        `! rtmpsink location=${this.streamKey}`,
      ].flatMap((v) => (Array.isArray(v) ? v : v.split(' '))),
    ];
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
