import { changeStreamingTitle } from '@/utils/api/stream';
import { StreamType } from '@electron/backend/types';
import { useCallback, useEffect, useState } from 'react';

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

  const fetchTitle = useCallback(async (streamKey: string, title: string) => {
    try {
      const streamId = await changeStreamingTitle(streamKey, title);
      setStreamId(streamId);
    } catch (error) {
      console.error('Failed to change stream title:', error);
    }
  }, []);

  // 방송 시작 후 streamId 가져오기
  useEffect(() => {
    const fetchStreamId = async () => {
      if (streamKey && connStatus.desktop && streamId === -1) {
        fetchTitle(streamKey, title || '방송');
      }
    };
    const loop = setInterval(fetchStreamId, 500);
    return () => clearInterval(loop);
  }, [streamKey, connStatus, streamId, title, fetchTitle]);

  // 제목 변경 반영
  useEffect(() => {
    if (title && streamKey) {
      fetchTitle(streamKey, title);
    }
  }, [title, streamKey, fetchTitle]);

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
