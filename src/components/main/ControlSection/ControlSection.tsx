import { Button } from '@/components/common';
import { useStreamer } from '@/hooks/useStreamer';
import clsx from 'clsx';

export const ControlSection = () => {
  const { connect, disconnect, connStatus } = useStreamer();

  const isConnected = connStatus.desktop || connStatus.webcam;
  return (
    <section className="flex flex-col items-stretch gap-4 bg-white rounded-lg w-[423px] p-2">
      <Button className={clsx({'bg-blue-500 text-white': isConnected})} onClick={isConnected ? disconnect : connect}>
        {isConnected ? '방송 종료' : '방송 시작'}
      </Button>
    </section>
  );
};
