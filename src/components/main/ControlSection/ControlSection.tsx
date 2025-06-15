import clsx from 'clsx';
import { Button } from '@/components/common';
import { SettingPanel } from '..';
import { useState } from 'react';
import { useStreamActions, useStreamValue } from '@/context/context';

export const ControlSection = () => {
  const { connect, disconnect } = useStreamActions();
  const { connStatus } = useStreamValue();
  const [isOpenedSettings, setIsOpenedSettings] = useState(false);

  const isConnected = connStatus.desktop || connStatus.webcam;
  return (
    <section className="flex flex-col items-stretch gap-2 bg-white rounded-lg w-[423px] p-2">
      <Button
        className={clsx({ 'bg-blue-500 text-white': isConnected })}
        onClick={isConnected ? disconnect : connect}
      >
        {isConnected ? '방송 종료' : '방송 시작'}
      </Button>
      <Button onClick={() => setIsOpenedSettings(!isOpenedSettings)}>설정</Button>
      {isOpenedSettings && <SettingPanel onClose={() => setIsOpenedSettings(false)} />}
    </section>
  );
};
