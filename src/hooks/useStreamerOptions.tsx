import { useCallback, useEffect, useState } from 'react';

export const useStreamerOptions = () => {
  const [videoCodec, setVideoCodec] = useState<{ codec: string; preset: string }>({
    codec: 'libx264',
    preset: 'veryfast',
  });
  const [videoDesktopResolution, setVideoDesktopResolution] = useState<{
    width: number;
    height: number;
    frameRate: number;
  }>({ width: 1280, height: 720, frameRate: 30 });
  const [videoWebcamResolution, setVideoWebcamResolution] = useState<{
    width: number;
    height: number;
    frameRate: number;
  }>({ width: 1280, height: 720, frameRate: 30 });
  const [videoDesktopBitrate, setVideoDesktopBitrate] = useState<number>(2500);
  const [videoWebcamBitrate, setVideoWebcamBitrate] = useState<number>(2500);
  const [audioCodec, setAudioCodec] = useState<string>('aac');
  const [audioBitrate, setAudioBitrate] = useState<number>(128);

  const update = useCallback(async () => {
    const videoCodec = await window.options.getVideoCodec();
    const videoDesktopResolution = await window.options.getResolution('desktop');
    const videoWebcamResolution = await window.options.getResolution('webcam');
    const videoDesktopBitrate = await window.options.getVideoBitrate('desktop');
    const videoWebcamBitrate = await window.options.getVideoBitrate('webcam');
    const audioCodec = await window.options.getAudioCodec();
    const audioBitrate = await window.options.getAudioBitrate();
    setVideoCodec(videoCodec);
    setVideoDesktopResolution(videoDesktopResolution);
    setVideoWebcamResolution(videoWebcamResolution);
    setVideoDesktopBitrate(videoDesktopBitrate);
    setVideoWebcamBitrate(videoWebcamBitrate);
    setAudioCodec(audioCodec);
    setAudioBitrate(audioBitrate);
  }, []);

  useEffect(() => {
    update();
  }, [update]);

  return {
    videoCodec,
    setVideoCodec: async (codec: string, preset: string) => {
      await window.options.setVideoCodec(codec, preset);
      setVideoCodec({ codec, preset });
    },
    videoDesktopResolution,
    setVideoDesktopResolution: async (width: number, height: number, frameRate: number) => {
      await window.options.setResolution('desktop', width, height, frameRate);
      setVideoDesktopResolution({ width, height, frameRate });
    },
    videoWebcamResolution,
    setVideoWebcamResolution: async (width: number, height: number, frameRate: number) => {
      await window.options.setResolution('webcam', width, height, frameRate);
      setVideoWebcamResolution({ width, height, frameRate });
    },
    videoDesktopBitrate,
    setVideoDesktopBitrate: async (bitrate: number) => {
      await window.options.setVideoBitrate('desktop', bitrate);
      setVideoDesktopBitrate(bitrate);
    },
    videoWebcamBitrate,
    setVideoWebcamBitrate: async (bitrate: number) => {
      await window.options.setVideoBitrate('webcam', bitrate);
      setVideoWebcamBitrate(bitrate);
    },
    audioCodec,
    setAudioCodec: async (codec: string, bitrate: number) => {
      await window.options.setAudioCodec(codec, bitrate);
      setAudioCodec(codec);
      setAudioBitrate(bitrate);
    },
    audioBitrate,
    setAudioBitrate: async (bitrate: number) => {
      await window.options.setAudioBitrate(bitrate);
      setAudioBitrate(bitrate);
    },
  };
};
