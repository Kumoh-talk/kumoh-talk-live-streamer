import { StreamType } from '@electron/backend/types';
import { useEffect, useState } from 'react';

export const useStreamer = () => {
  const [connStatus, setConnStatus] = useState<Record<StreamType, boolean>>({
    desktop: false,
    webcam: false,
  });
  const [streamKey, _setStreamKey] = useState<string>('');

  useEffect(() => {
    const handleConnStatus = (
      _: Electron.IpcRendererEvent,
      status: Record<StreamType, boolean>
    ) => {
      setConnStatus(status);
    };
    window.stream.onChangeConnStatus(handleConnStatus);
    return () => {
      window.stream.offChangeConnStatus(handleConnStatus);
    };
  }, []);

  const connect = async () => {
    await window.stream.start();
  }
  const disconnect = async () => {
    await window.stream.stop();
  }
  const setStreamKey = async (key: string) => {
    // TODO: connect 상태에서 변경시 disconnect 후 재연결
    await window.options.setStreamKey(key);
    _setStreamKey(key);
  }

  return {
    connect,
    disconnect,
    connStatus,
    streamKey,
    setStreamKey,
  };
};
