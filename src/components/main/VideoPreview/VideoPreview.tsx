import { useStreamValue } from '@/context/context';
import { useEffect, useRef, useState } from 'react';

export const VideoPreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const { connStatus, streamDesktop, audioStream } = useStreamValue();

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
      if (audioStream) {
        const audioTracks = audioStream.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      }
      const newRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm; codecs=vp8,opus',
      });

      combinedStreamRef.current = canvasStream;
      setRecorder(newRecorder);

      newRecorder.ondataavailable = (event: BlobEvent) => {
        const reader = new FileReader();
        reader.onload = () => {
          const buffer = reader.result as ArrayBuffer;
          window.stream.sendChunk('desktop', buffer);
        };
        reader.readAsArrayBuffer(event.data);
      };
    }
  }, [audioStream]);

  useEffect(() => {
    if (!streamDesktop) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (video) {
      video.srcObject = streamDesktop;
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
  }, [streamDesktop]);

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
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full aspect-video bg-black hidden"
        muted
      />
    </div>
  );
};
