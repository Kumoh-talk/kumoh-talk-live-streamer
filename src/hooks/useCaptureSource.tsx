import { CaptureSource } from '@/types/capture';
import { useCallback, useEffect, useState } from 'react';

export const useCaptureSource = () => {
  const [displaySources, setDisplaySources] = useState<CaptureSource[]>([]);
  const [displaySource, setDisplaySource] = useState<string>('screen:0:0');

  const [webcamSources, setWebcamSources] = useState<CaptureSource[]>([]);
  const [webcamSource, setWebcamSource] = useState<string>('');

  const updateCaptureSources = useCallback(async () => {
    const desktopSources = await window.screenCapture.getDesktopSources();
    setDisplaySources(
      desktopSources.map((source) => ({
        id: source.id,
        name: source.name,
      }))
    );
    setDisplaySource(desktopSources[0].id);
    const userSources = await navigator.mediaDevices.enumerateDevices();
    const webcamSources = userSources.filter((source) => source.kind === 'videoinput');
    setWebcamSources(
      webcamSources.map((source) => ({
        id: source.deviceId,
        name: source.label,
      }))
    );
    setWebcamSource(webcamSources[0]?.deviceId || '');
  }, []);

  // 소스 목록 초기화
  useEffect(() => {
    updateCaptureSources();
  }, [updateCaptureSources]);

  useEffect(() => {
    window.screenCapture.selectSource(displaySource);
  }, [displaySource]);

  return {
    updateCaptureSources,
    displaySources,
    displaySource,
    setDisplaySource,
    webcamSources,
    webcamSource,
    setWebcamSource,
  };
};
