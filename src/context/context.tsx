import { useCaptureSource } from '@/hooks/useCaptureSource';
import { useStreamer } from '@/hooks/useStreamer';
import { CaptureSource } from '@/types/capture';
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
};

export type Actions = {
  readonly setDisplaySource: (source: string) => void;
  readonly setWebcamSource: (source: string) => void;
  readonly connect: () => Promise<void>;
  readonly disconnect: () => Promise<void>;
  readonly setStreamKey: (key: string) => Promise<void>;
};

const StreamValueContext = createContext<Values | undefined>(undefined);
const StreamActionsContext = createContext<Actions | undefined>(undefined);

type Props = {
  readonly children: ReactNode;
};

export const StreamProvider = (props: Props): React.ReactNode => {
  const { connect, disconnect, connStatus, streamKey, setStreamKey } = useStreamer();
  const {
    displaySources,
    displaySource,
    setDisplaySource,
    webcamSources,
    webcamSource,
    setWebcamSource,
  } = useCaptureSource();

  const [streamDesktop, setStreamDesktop] = useState<MediaStream | null>(null);
  const [streamWebcam, setStreamWebcam] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
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

  const actions: Actions = useMemo(
    () => ({
      setDisplaySource,
      setWebcamSource,
      connect,
      disconnect,
      setStreamKey,
    }),
    [setDisplaySource, setWebcamSource, connect, disconnect, setStreamKey]
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
