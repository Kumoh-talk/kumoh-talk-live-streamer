import { useStreamValue } from '@/context/context';
import { useEffect, useRef } from 'react';

export const VideoPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { displaySource } = useStreamValue();

  useEffect(() => {
    const startCapture = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: {
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
  }, [displaySource]);

  return (
    <div className="h-full aspect-video bg-black">
      <video ref={videoRef} autoPlay playsInline className="h-full aspect-video bg-black" />
    </div>
  );
};
