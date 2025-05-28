export type VideoCaptureOptions = {
  videoCodec: string;
  videoPreset: string;
  resolution: {
    width: number;
    height: number;
    frameRate: number;
  };
  videoBitrate: number;
  audioCodec: string;
  audioBitrate: number;
};

export type StreamType = 'desktop' | 'webcam';
