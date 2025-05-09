import { useStreamValue } from '@/context/context';
import { useEffect, useRef } from 'react';

export const WebcamPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { webcamSource } = useStreamValue();

  useEffect(() => {
    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            deviceId: webcamSource,
            width: 1280,
            height: 720,
            frameRate: 10,
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('화면 캡처 실패:', err);
      }
    };
    startCapture();
  }, [webcamSource]);

  return (
    <div className="h-full aspect-video bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full aspect-video bg-black" />
    </div>
  );
};
