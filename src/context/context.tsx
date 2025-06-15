import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { useCaptureSource } from '@/hooks/useCaptureSource';
import { useStreamer } from '@/hooks/useStreamer';
import { useStreamerOptions } from '@/hooks/useStreamerOptions';
import { CaptureSource } from '@/types/capture';
import { createStreamKey } from '@/utils/api/stream';
import useSocketStore, { SocketStore } from '@/utils/stores/socketStore';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Values = {
  readonly displaySource: string;
  readonly displaySources: CaptureSource[];
  readonly webcamSource: string;
  readonly webcamSources: CaptureSource[];
  readonly connStatus: Record<string, boolean>;
  readonly streamKey: string;
  readonly streamDesktop: MediaStream | null;
  readonly streamWebcam: MediaStream | null;

  readonly videoCodec: { codec: string; preset: string };
  readonly videoDesktopResolution: { width: number; height: number; frameRate: number };
  readonly videoWebcamResolution: { width: number; height: number; frameRate: number };
  readonly videoDesktopBitrate: number;
  readonly videoWebcamBitrate: number;
  readonly audioCodec: string;
  readonly audioBitrate: number;

  readonly gain: number;
  readonly level: number;
  readonly audioStream: MediaStream | null;

  readonly socketStore: SocketStore;

  readonly accessToken?: string;
  readonly refreshToken?: string;
};

export type Actions = {
  readonly setDisplaySource: (source: string) => void;
  readonly setWebcamSource: (source: string) => void;
  readonly connect: () => Promise<void>;
  readonly disconnect: () => Promise<void>;
  readonly setStreamKey: (key: string) => Promise<void>;

  readonly setVideoCodec: (codec: string, preset: string) => Promise<void>;
  readonly setVideoDesktopResolution: (
    width: number,
    height: number,
    frameRate: number
  ) => Promise<void>;
  readonly setVideoWebcamResolution: (
    width: number,
    height: number,
    frameRate: number
  ) => Promise<void>;
  readonly setVideoDesktopBitrate: (bitrate: number) => Promise<void>;
  readonly setVideoWebcamBitrate: (bitrate: number) => Promise<void>;
  readonly setAudioCodec: (codec: string, bitrate: number) => Promise<void>;
  readonly setAudioBitrate: (bitrate: number) => Promise<void>;

  readonly setGain: (gain: number) => void;

  readonly handleLogin: (accessToken: string, refreshToken: string) => void;
  readonly logout: () => void;
};

const StreamValueContext = createContext<Values | undefined>(undefined);
const StreamActionsContext = createContext<Actions | undefined>(undefined);

type Props = {
  readonly children: ReactNode;
};

export const StreamProvider = (props: Props): React.ReactNode => {
  const { connect, disconnect, connStatus, streamKey, setStreamKey } = useStreamer();
  const {
    videoCodec,
    setVideoCodec,
    videoDesktopResolution,
    setVideoDesktopResolution,
    videoWebcamResolution,
    setVideoWebcamResolution,
    videoDesktopBitrate,
    videoWebcamBitrate,
    setVideoDesktopBitrate,
    setVideoWebcamBitrate,
    audioCodec,
    setAudioCodec,
    audioBitrate,
    setAudioBitrate,
  } = useStreamerOptions();
  const {
    displaySources,
    displaySource,
    setDisplaySource,
    webcamSources,
    webcamSource,
    setWebcamSource,
  } = useCaptureSource();
  const { gain, level, audioStream, setGain } = useAudio();

  const [streamDesktop, setStreamDesktop] = useState<MediaStream | null>(null);
  const [streamWebcam, setStreamWebcam] = useState<MediaStream | null>(null);

  const socketStore = useSocketStore();

  const { accessToken, refreshToken, handleLogin, logout } = useAuth();

  useEffect(() => {
    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: {
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        });

        setStreamDesktop(stream);
      } catch (err) {
        console.error('화면 캡처 실패:', err);
        setStreamDesktop(null);
      }
    };
    startCapture();
  }, [displaySource]);

  useEffect(() => {
    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            deviceId: webcamSource,
            width: 1280,
            height: 720,
            frameRate: 30,
          },
        });

        setStreamWebcam(stream);
      } catch (err) {
        console.error('웹캠 캡처 실패:', err);
        setStreamWebcam(null);
      }
    };
    startCapture();
  }, [webcamSource]);

  useEffect(() => {
    const fetchStreamKey = async () => {
      try {
        const key = await createStreamKey();
        setStreamKey(key);
      } catch (err) {
        console.error('스트림 키를 가져오는 데 실패했습니다:', err);
      }
    };

    if (accessToken && !streamKey) {
      fetchStreamKey();
    }
    if (!accessToken && streamKey) {
      // 로그아웃시 스트림 키 초기화
      setStreamKey('');
    }
  }, [accessToken, streamKey, setStreamKey]);

  const actions: Actions = useMemo(
    () => ({
      setDisplaySource,
      setWebcamSource,
      connect,
      disconnect,
      setStreamKey,

      setVideoCodec,
      setVideoDesktopResolution,
      setVideoWebcamResolution,
      setVideoDesktopBitrate,
      setVideoWebcamBitrate,
      setAudioCodec,
      setAudioBitrate,

      setGain,

      handleLogin,
      logout,
    }),
    [
      setDisplaySource,
      setWebcamSource,
      connect,
      disconnect,
      setStreamKey,
      setVideoCodec,
      setVideoDesktopResolution,
      setVideoWebcamResolution,
      setVideoDesktopBitrate,
      setVideoWebcamBitrate,
      setAudioCodec,
      setAudioBitrate,
      setGain,
      handleLogin,
      logout,
    ]
  );

  return (
    <StreamActionsContext.Provider value={actions}>
      <StreamValueContext.Provider
        value={{
          displaySources,
          displaySource,
          webcamSources,
          webcamSource,
          connStatus,
          streamKey,
          streamDesktop,
          streamWebcam,

          videoCodec,
          videoDesktopResolution,
          videoWebcamResolution,
          videoDesktopBitrate,
          videoWebcamBitrate,
          audioCodec,
          audioBitrate,

          gain,
          level,
          audioStream,

          socketStore,

          accessToken,
          refreshToken,
        }}
      >
        {props.children}
      </StreamValueContext.Provider>
    </StreamActionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStreamValue = () => {
  const value = useContext(StreamValueContext);
  if (!value) {
    throw new Error('useStreamValue should be used within StreamProvider');
  }
  return value;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStreamActions = () => {
  const value = useContext(StreamActionsContext);
  if (!value) {
    throw new Error('useStreamActions should be used within StreamProvider');
  }
  return value;
};
