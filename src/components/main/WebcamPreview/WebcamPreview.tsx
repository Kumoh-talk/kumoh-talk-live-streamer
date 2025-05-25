import { useStreamValue } from '@/context/context';
import { useEffect, useRef, useState } from 'react';

export const WebcamPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const { connStatus, streamWebcam } = useStreamValue();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 1280;
        canvas.height = 720;
      }
      ctxRef.current = ctx;
      const canvasStream = canvas.captureStream(30);
      const newRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm; codecs=vp8,opus',
      });
      setRecorder(newRecorder);
      newRecorder.ondataavailable = (event: BlobEvent) => {
        const reader = new FileReader();
        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          window.stream.sendChunkWebcam(buffer);
        };
        reader.readAsArrayBuffer(event.data);
      };
    }
  }, []);
  
  useEffect(() => {
    if (!streamWebcam) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (video) {
      video.srcObject = streamWebcam;
      video.play();
    }
    const captureLoop = () => {
      if (video && ctx && canvas) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };
    const intervalId = setInterval(captureLoop, 30);
    return () => {
      clearInterval(intervalId);
    };
  }, [streamWebcam]);

  useEffect(() => {
    if (recorder && connStatus.desktop === true && recorder.state !== 'recording') {
      recorder.start(100);
    }
    if (connStatus.desktop === false && recorder && recorder.state === 'recording') {
      recorder.stop();
    }
  }, [recorder, connStatus]);

  return (
    <div className="h-full aspect-video bg-black">
      <canvas ref={canvasRef} className="h-full aspect-video bg-black" />
      <video ref={videoRef} autoPlay playsInline className="h-full aspect-video bg-black hidden" />
    </div>
  );
};
