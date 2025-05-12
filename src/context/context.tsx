import { useStreamer } from '@/hooks/useStreamer';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Values = {
  readonly displaySource: string;
  readonly displaySources: {
    id: string;
    name: string;
    thumbnail: string;
    display_id: string;
    appIcon: string | null;
  }[];
  readonly webcamSource: string;
  readonly webcamSources: {
    id: string;
    name: string;
    thumbnail: string;
    display_id: string;
    appIcon: string | null;
  }[];
  readonly connStatus: Record<string, boolean>;
  readonly streamKey: string;
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

  const [displaySources, setDisplaySources] = useState<
    {
      id: string;
      name: string;
      thumbnail: string;
      display_id: string;
      appIcon: string | null;
    }[]
  >([]);
  const [displaySource, setDisplaySource] = useState<string>('screen:0:0');

  const [webcamSources, setWebcamSources] = useState<
    {
      id: string;
      name: string;
      thumbnail: string;
      display_id: string;
      appIcon: string | null;
    }[]
  >([]);
  const [webcamSource, setWebcamSource] = useState<string>('');

  useEffect(() => {
    const fetchDisplaySources = async () => {
      const sources = await window.screenCapture.getDesktopSources();
      setDisplaySources(sources);
      setDisplaySource(sources[0].id);
    };
    const fetchWebcamSources = async () => {
      const sources = await navigator.mediaDevices.enumerateDevices();
      const webcamSources = sources.filter((source) => source.kind === 'videoinput');
      setWebcamSources(
        webcamSources.map((source) => ({
          id: source.deviceId,
          name: source.label || 'Webcam',
          thumbnail: '', // Placeholder, as webcam sources don't have thumbnails in this context
          display_id: '', // Placeholder, as webcam sources don't have display IDs in this context;
          appIcon: null, // Placeholder, as webcam sources don't have app icons in this context
        }))
      );
      setWebcamSource(webcamSources[0]?.deviceId || '');
    };
    fetchDisplaySources();
    fetchWebcamSources();
  }, []);

  useEffect(() => {
    window.screenCapture.selectSource(displaySource);
    window.stream.setSourceDesktop(displaySource);
  }, [displaySource]);

  useEffect(() => {
    const source = webcamSources.find((source) => source.id === webcamSource);
    if (source) {
      window.stream.setSourceWebcam(source.name);
    }
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
        }}
      >
        {props.children}
      </StreamValueContext.Provider>
    </StreamActionsContext.Provider>
  );
};

export const useStreamValue = () => {
  const value = useContext(StreamValueContext);
  if (!value) {
    throw new Error('useStreamValue should be used within StreamProvider');
  }
  return value;
};

export const useStreamActions = () => {
  const value = useContext(StreamActionsContext);
  if (!value) {
    throw new Error('useStreamActions should be used within StreamProvider');
  }
  return value;
};
