import { Button } from '@/components/common';
import clsx from 'clsx';
import React from 'react';
import { useMemo, useState } from 'react';

const tabs = [
  {
    id: 'connection',
    label: '연결',
    component: () => import('./components').then((m) => ({ default: m.ConnectionTab })),
  },
  {
    id: 'video',
    label: '비디오',
    component: () => import('./components').then((m) => ({ default: m.VideoTab })),
  },
  {
    id: 'audio',
    label: '오디오',
    component: () => import('./components').then((m) => ({ default: m.AudioTab })),
  },
];

export interface Props {
  onClose?: () => void;
}

export const SettingPanel = (props: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const tabList = tabs.map((tab) => (
    <button
      key={tab.id}
      className={clsx('px-4 py-2 text-sm font-medium rounded-lg focus:outline-none text-left', {
        'bg-gray-200': activeTab === tab.id,
        'text-gray-700 hover:bg-gray-100': activeTab !== tab.id,
      })}
      onClick={() => onTabChange(tab.id)}
    >
      {tab.label}
    </button>
  ));

  const ActiveTabComponent = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab ? React.lazy(tab.component) : null;
  }, [activeTab]);

  return (
    <div className="flex justify-center items-center absolute size-full top-0 left-0 z-100 py-4 bg-black/50">
      <section className="flex flex-col gap-4 bg-white rounded-lg p-4 w-[48rem] h-[40rem] max-h-full border border-gray-300 shadow-2xl">
        <header className="flex flex-row justify-between items-center">
          <span className="font-medium text-lg px-4">설정</span>
          <span className="flex flex-row gap-2">
            <Button color="tertiary" onClick={props.onClose}>
              닫기
            </Button>
          </span>
        </header>
        <div className="flex flex-row gap-4 items-stretch h-0 flex-1">
          <aside className="flex flex-col w-40">{tabList}</aside>
          <div className="flex flex-col gap-4 flex-1 px-2 rounded-lg overflow-y-auto">
            <React.Suspense fallback={<div>Loading...</div>}>
              {ActiveTabComponent && <ActiveTabComponent />}
            </React.Suspense>
          </div>
        </div>
      </section>
    </div>
  );
};
