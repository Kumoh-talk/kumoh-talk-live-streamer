import clsx from 'clsx';
import { Button } from '@/components/common';
import { SettingPanel } from '..';
import { useState } from 'react';
import { useStreamActions, useStreamValue } from '@/context/context';
import { toast } from 'react-toastify';

export const ControlSection = () => {
  const { connect, disconnect } = useStreamActions();
  const { connStatus, streamKey, title } = useStreamValue();
  const [isOpenedSettings, setIsOpenedSettings] = useState(false);

  const onStartBroadcast = () => {
    if (title.length === 0) {
      toast.warn('방송 제목을 먼저 설정해주세요.');
      return;
    }
    connect();
  };

  const isConnected = connStatus.desktop || connStatus.webcam;
  return (
    <section className="flex flex-col items-stretch gap-2 bg-white rounded-lg w-[423px] p-2">
      <Button
        className={clsx({ 'bg-blue-500 text-white': isConnected })}
        onClick={isConnected ? disconnect : onStartBroadcast}
        disabled={!streamKey || streamKey.length === 0}
      >
        {isConnected ? '방송 종료' : '방송 시작'}
      </Button>
      <Button onClick={() => setIsOpenedSettings(!isOpenedSettings)}>설정</Button>
      {isOpenedSettings && <SettingPanel onClose={() => setIsOpenedSettings(false)} />}
    </section>
  );
};
