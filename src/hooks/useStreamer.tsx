import { changeStreamingTitle } from '@/utils/api/stream';
import { StreamType } from '@electron/backend/types';
import { useEffect, useState } from 'react';

export const useStreamer = () => {
  const [connStatus, setConnStatus] = useState<Record<StreamType, boolean>>({
    desktop: false,
    webcam: false,
  });
  const [streamKey, _setStreamKey] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [streamId, setStreamId] = useState<number>(-1);

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

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const streamId = await changeStreamingTitle(streamKey, title);
        setStreamId(streamId);
      } catch (error) {
        console.error('Failed to change stream title:', error);
      }
    };
    if (title && streamKey) {
      fetchTitle();
    }
  }, [title, streamKey]);

  const connect = async () => {
    await window.stream.start();
  };
  const disconnect = async () => {
    await window.stream.stop();
  };
  const setStreamKey = async (key: string) => {
    // TODO: connect 상태에서 변경시 disconnect 후 재연결
    await window.options.setStreamKey(key);
    _setStreamKey(key);
  };

  return {
    connect,
    disconnect,
    connStatus,
    streamKey,
    setStreamKey,
    title,
    setTitle,
    streamId,
    setStreamId,
  };
};
