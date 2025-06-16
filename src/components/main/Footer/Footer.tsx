import { useStreamer } from '@/hooks/useStreamer';
import { useEffect, useState } from 'react';

export const Footer = () => {
  const { connStatus } = useStreamer();
  const [startedTime, setStartedTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

  useEffect(() => {
    if (connStatus.desktop) {
      setStartedTime(Date.now());
    } else {
      setStartedTime(0);
    }
  }, [connStatus]);

  const formatTime = (startedTime: number) => {
    const elapsedTime = Date.now() - startedTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
    const hours = Math.floor(elapsedTime / 1000 / 60 / 60);

    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (startedTime) {
      const interval = setInterval(() => {
        setElapsedTime(formatTime(startedTime));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startedTime]);

  return (
    <footer className="flex flex-row h-8 items-center justify-end px-4 leading-none gap-4 bg-white rounded-lg">
      <div className="flex flex-row gap-2">
        <span className="flex flex-row gap-1 items-center">
          <StatusCircle status={connStatus.desktop} />
          <span className="text- text-gray-500">화면</span>
        </span>
        <span className="flex flex-row gap-1 items-center">
          <StatusCircle status={connStatus.webcam} />
          <span className="text- text-gray-500">웹캠</span>
        </span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <span className="text-gray-500">방송시간</span>
        <span className="text-gray-800 font-semibold">{elapsedTime}</span>
      </div>
    </footer>
  );
};

const StatusCircle = ({ status }: { status: boolean }) => {
  return <div className={`size-3 rounded-full ${status ? 'bg-red-500' : 'bg-gray-400'}`}></div>;
};
