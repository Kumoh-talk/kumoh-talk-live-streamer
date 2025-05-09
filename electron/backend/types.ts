/* videoCapture */
export type VideoCaptureRtpParams = {
  ssrc: number;
  ipAddress: string;
  rtpPort: number;
  rtcpPort: number;
};

export type VideoCaptureOptions = {
  device: {
    type: 'screen' | 'camera';
    name: string;
  };
  resolution: {
    width: number;
    height: number;
    frameRate: number;
  };
  bitrate: number;
};

export type StreamType = 'desktop' | 'webcam';